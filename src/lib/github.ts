// Real GitHub REST API integration for E-SMART-WORLD

export interface GitHubDeployOptions {
  token: string
  username: string
  repoName: string
  projectName: string
  files: { path: string; content: string }[]
  onProgress: (step: string, progress: number) => void
}

export interface GitHubDeployResult {
  success: boolean
  repoUrl?: string
  pagesUrl?: string
  error?: string
}

const GH_API = 'https://api.github.com'

async function ghFetch(path: string, token: string, method = 'GET', body?: unknown) {
  const res = await fetch(`${GH_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

export async function deployToGitHub(opts: GitHubDeployOptions): Promise<GitHubDeployResult> {
  const { token, username, repoName, files, onProgress } = opts

  try {
    // Step 1: Verify token / authenticate
    onProgress('Authenticating with GitHub...', 8)
    const authRes = await ghFetch('/user', token)
    if (!authRes.ok) {
      return { success: false, error: 'GitHub authentication failed. Please check your access token.' }
    }
    const ghUsername = authRes.data.login || username

    // Step 2: Check if repo exists, create if not
    onProgress('Creating / checking repository...', 20)
    let repoExists = false
    const checkRes = await ghFetch(`/repos/${ghUsername}/${repoName}`, token)
    if (checkRes.ok) {
      repoExists = true
      onProgress(`Repository "${repoName}" already exists — updating...`, 25)
    } else {
      const createRes = await ghFetch('/user/repos', token, 'POST', {
        name: repoName,
        description: `Deployed via E-SMART-WORLD — ${opts.projectName}`,
        auto_init: true,
        private: false,
        homepage: `https://${ghUsername}.github.io/${repoName}`,
      })
      if (!createRes.ok) {
        return { success: false, error: `Failed to create repo: ${createRes.data?.message || 'Unknown error'}` }
      }
      // Wait for repo to initialize
      await new Promise(r => setTimeout(r, 2000))
    }

    // Step 3: Get default branch SHA
    onProgress('Reading repository state...', 35)
    let defaultBranch = 'main'
    let baseSha = ''
    const branchRes = await ghFetch(`/repos/${ghUsername}/${repoName}/git/ref/heads/main`, token)
    if (!branchRes.ok) {
      const masterRes = await ghFetch(`/repos/${ghUsername}/${repoName}/git/ref/heads/master`, token)
      if (masterRes.ok) {
        defaultBranch = 'master'
        baseSha = masterRes.data.object?.sha || ''
      }
    } else {
      baseSha = branchRes.data.object?.sha || ''
    }

    // Step 4: Push all files as blobs
    onProgress('Uploading project files...', 50)
    const fileBlobs: { path: string; sha: string }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      onProgress(`Uploading ${file.path} (${i + 1}/${files.length})...`, 50 + Math.round((i / files.length) * 20))
      
      // Encode content to base64
      const encoded = btoa(unescape(encodeURIComponent(file.content)))
      const blobRes = await ghFetch(`/repos/${ghUsername}/${repoName}/git/blobs`, token, 'POST', {
        content: encoded,
        encoding: 'base64',
      })
      if (blobRes.ok) {
        fileBlobs.push({ path: file.path, sha: blobRes.data.sha })
      }
    }

    // Step 5: Create tree
    onProgress('Creating file tree...', 73)
    const treeRes = await ghFetch(`/repos/${ghUsername}/${repoName}/git/trees`, token, 'POST', {
      base_tree: baseSha || undefined,
      tree: fileBlobs.map(f => ({
        path: f.path,
        mode: '100644',
        type: 'blob',
        sha: f.sha,
      })),
    })
    if (!treeRes.ok) {
      return { success: false, error: `Failed to create tree: ${treeRes.data?.message || 'Unknown'}` }
    }

    // Step 6: Create commit
    onProgress('Creating commit...', 82)
    const commitBody: Record<string, unknown> = {
      message: `Deploy: ${opts.projectName} via E-SMART-WORLD`,
      tree: treeRes.data.sha,
      author: { name: 'E-SMART-WORLD Bot', email: 'esw@deploy.local', date: new Date().toISOString() },
    }
    if (baseSha) commitBody.parents = [baseSha]

    const commitRes = await ghFetch(`/repos/${ghUsername}/${repoName}/git/commits`, token, 'POST', commitBody)
    if (!commitRes.ok) {
      return { success: false, error: `Failed to create commit: ${commitRes.data?.message || 'Unknown'}` }
    }

    // Step 7: Update branch ref
    onProgress('Pushing to branch...', 88)
    const refPath = `/repos/${ghUsername}/${repoName}/git/refs/heads/${defaultBranch}`
    const updateRef = await ghFetch(refPath, token, 'PATCH', {
      sha: commitRes.data.sha,
      force: true,
    })
    if (!updateRef.ok) {
      // Try creating the ref instead
      await ghFetch(`/repos/${ghUsername}/${repoName}/git/refs`, token, 'POST', {
        ref: `refs/heads/${defaultBranch}`,
        sha: commitRes.data.sha,
      })
    }

    // Step 8: Enable GitHub Pages
    onProgress('Enabling GitHub Pages...', 93)
    const pagesRes = await ghFetch(`/repos/${ghUsername}/${repoName}/pages`, token, 'POST', {
      source: { branch: defaultBranch, path: '/' },
    })
    // Pages might already be enabled — that's ok
    if (!pagesRes.ok && pagesRes.status !== 409 && pagesRes.status !== 422) {
      // Try to update existing pages config
      await ghFetch(`/repos/${ghUsername}/${repoName}/pages`, token, 'PUT', {
        source: { branch: defaultBranch, path: '/' },
      })
    }

    onProgress('Deployment complete!', 100)

    const repoUrl = `https://github.com/${ghUsername}/${repoName}`
    const pagesUrl = `https://${ghUsername}.github.io/${repoName}`

    return { success: true, repoUrl, pagesUrl }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('GitHub deploy error:', err)
    return { success: false, error: `Deployment error: ${msg}` }
  }
}

export async function getGitHubRepos(token: string): Promise<{ name: string; full_name: string; html_url: string; has_pages: boolean }[]> {
  const res = await ghFetch('/user/repos?per_page=50&sort=updated', token)
  if (!res.ok) return []
  return res.data || []
}

export async function checkGitHubToken(token: string): Promise<{ valid: boolean; username?: string; name?: string }> {
  const res = await ghFetch('/user', token)
  if (!res.ok) return { valid: false }
  return { valid: true, username: res.data.login, name: res.data.name }
}

export async function createGitHubRelease(token: string, username: string, repoName: string, tag: string, notes: string) {
  const res = await ghFetch(`/repos/${username}/${repoName}/releases`, token, 'POST', {
    tag_name: tag,
    name: `Release ${tag}`,
    body: notes,
    draft: false,
    prerelease: false,
  })
  return res
}
