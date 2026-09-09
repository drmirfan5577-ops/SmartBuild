// ZIP file extraction using JSZip
// Dynamically loads JSZip from CDN if not available

export interface ExtractedFile {
  path: string
  name: string
  content: string
  size: number
  type: string
  isDirectory: boolean
}

export async function loadJSZip(): Promise<typeof import('jszip') | null> {
  try {
    // Try dynamic import first
    const JSZip = await import('jszip')
    return JSZip.default || (JSZip as any)
  } catch {
    // If not available, load from CDN via script tag
    return new Promise((resolve) => {
      const existing = document.getElementById('jszip-script')
      if (existing) {
        // Already loading, wait
        const check = setInterval(() => {
          if ((window as any).JSZip) {
            clearInterval(check)
            resolve((window as any).JSZip)
          }
        }, 100)
        return
      }
      const script = document.createElement('script')
      script.id = 'jszip-script'
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
      script.onload = () => resolve((window as any).JSZip)
      script.onerror = () => resolve(null)
      document.head.appendChild(script)
    })
  }
}

export async function extractZip(file: File, onProgress?: (pct: number, fileName: string) => void): Promise<ExtractedFile[]> {
  const JSZip = await loadJSZip()
  if (!JSZip) throw new Error('JSZip library could not be loaded. Please check your connection.')

  const zip = new (JSZip as any)()
  const zipData = await file.arrayBuffer()
  const loaded = await zip.loadAsync(zipData)

  const files: ExtractedFile[] = []
  const fileEntries = Object.entries(loaded.files) as [string, any][]
  let processed = 0

  for (const [path, entry] of fileEntries) {
    processed++
    onProgress?.(Math.round((processed / fileEntries.length) * 100), path)

    if (entry.dir) {
      files.push({
        path,
        name: path.split('/').filter(Boolean).pop() || path,
        content: '',
        size: 0,
        type: 'directory',
        isDirectory: true,
      })
      continue
    }

    // Determine if binary or text
    const ext = path.split('.').pop()?.toLowerCase() || ''
    const textExts = ['html', 'htm', 'css', 'js', 'ts', 'tsx', 'jsx', 'json', 'txt', 'md', 'svg', 'xml', 'yaml', 'yml', 'env', 'gitignore', 'sh']
    const isText = textExts.includes(ext)

    let content = ''
    try {
      if (isText) {
        content = await entry.async('string')
      } else {
        // For binary files, get base64
        const base64 = await entry.async('base64')
        content = `data:application/octet-stream;base64,${base64}`
      }
    } catch {
      content = '[Could not read file]'
    }

    const name = path.split('/').pop() || path
    const mimeMap: Record<string, string> = {
      html: 'text/html', htm: 'text/html', css: 'text/css',
      js: 'text/javascript', ts: 'text/typescript', tsx: 'text/typescript',
      jsx: 'text/javascript', json: 'application/json', txt: 'text/plain',
      md: 'text/markdown', svg: 'image/svg+xml', png: 'image/png',
      jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
    }

    files.push({
      path,
      name,
      content,
      size: content.length,
      type: mimeMap[ext] || 'application/octet-stream',
      isDirectory: false,
    })
  }

  return files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1
    if (!a.isDirectory && b.isDirectory) return 1
    return a.path.localeCompare(b.path)
  })
}

export function detectFrameworkFromFiles(files: ExtractedFile[]): string {
  const fileNames = files.map(f => f.name.toLowerCase())
  const allContent = files.filter(f => !f.isDirectory).map(f => f.content).join('\n').toLowerCase()

  if (fileNames.includes('app.json') && allContent.includes('expo')) return 'React Native (Expo)'
  if (fileNames.includes('package.json') && allContent.includes('"react-native"')) return 'React Native'
  if (fileNames.includes('package.json') && allContent.includes('"next"')) return 'Next.js'
  if (fileNames.includes('package.json') && allContent.includes('"react"')) return 'React'
  if (fileNames.includes('package.json') && allContent.includes('"vue"')) return 'Vue.js'
  if (fileNames.includes('package.json') && allContent.includes('"angular"')) return 'Angular'
  if (fileNames.some(f => f.endsWith('.html'))) return 'HTML/CSS/JS'
  return 'Unknown'
}

export function buildProjectStructureTree(files: ExtractedFile[]): string {
  const dirs = new Set<string>()
  const fileNodes: string[] = []

  files.forEach(f => {
    const parts = f.path.split('/').filter(Boolean)
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i++) {
        dirs.add(parts.slice(0, i).join('/'))
      }
    }
    if (!f.isDirectory) {
      fileNodes.push(f.path)
    }
  })

  return [...dirs].sort().concat(fileNodes.sort()).join('\n')
}
