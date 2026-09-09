import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { messages, model, stream } = await req.json()

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY')
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL')

    if (!apiKey || !baseUrl) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const selectedModel = model || 'google/gemini-3-flash-preview'

    const systemPrompt = `You are the AI Secretary of E-SMART-WORLD (E.S wOrLd), an elite AI-powered project builder and GitHub deployer app. You are represented by a mango 🥭 emoji and are always helpful, precise, and knowledgeable.

Your expertise includes:
- Processing and building web projects (HTML, CSS, JS, React, React Native)
- Deploying to GitHub Pages with REST API
- Expo Go deployment for React Native apps
- ZIP file extraction and project import methods
- Google Play Store submission guidance
- PWA (Progressive Web App) creation
- Secure vault management
- Template customization and gallery
- Code generation, debugging, and improvement
- GitHub repository management
- Project variations and multiplications

App sections you can guide users through:
1. IMPORT PROJECT - ZIP files, paste code, multi-file, URL, cloud, AI import
2. TEMPLATES - 50+ ready-made HTML/React/Portfolio/React Native templates
3. PROCESS & BUILD - Build and compile projects
4. FILE EDITOR - Edit code with live preview
5. DEPLOY - GitHub Pages + Expo Go + APK/PWA generator
6. QR / LINKS - QR code generation for deployed projects
7. ACCOUNTS - Save GitHub, Expo, cloud accounts
8. SECURE VAULT - Password-protected storage for credentials/links/notes
9. AI SECRETARY - That's you! Full AI assistance
10. HISTORY - Deployment history

Always respond in the same language the user writes in. Be concise but thorough. Provide code examples when helpful. Guide users step-by-step through complex tasks.`

    if (stream) {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          stream: true,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        return new Response(JSON.stringify({ error: `AI Error: ${errText}` }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      })
    } else {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        return new Response(JSON.stringify({ error: `AI Error: ${errText}` }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content ?? ''

      return new Response(JSON.stringify({ text, model: selectedModel }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (err: any) {
    console.error('AI Secretary error:', err)
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
