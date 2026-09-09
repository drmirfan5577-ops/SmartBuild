import React, { useState } from 'react'
import {
  Info, Shield, AlertTriangle, Copyright, Globe, Mail, Phone,
  FileText, BookOpen, Heart, ChevronDown, ChevronRight, ExternalLink
} from 'lucide-react'
import { HudCard } from '@/components/ui/HudCard'
import { APP_NAME, APP_VERSION, DEFAULT_EMAIL, DEFAULT_GITHUB_USER } from '@/constants'

const ABOUT_TABS = [
  { id: 'about', label: 'ABOUT', icon: Info, color: '#3b82f6' },
  { id: 'disclaimer', label: 'DISCLAIMER', icon: AlertTriangle, color: '#f59e0b' },
  { id: 'privacy', label: 'PRIVACY POLICY', icon: Shield, color: '#8b5cf6' },
  { id: 'terms', label: 'TERMS', icon: FileText, color: '#10b981' },
  { id: 'copyright', label: 'COPYRIGHT', icon: Copyright, color: '#ef4444' },
]

export function AboutPage() {
  const [activeTab, setActiveTab] = useState('about')
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar */}
      <div
        className="w-44 flex-shrink-0 border-r flex flex-col"
        style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.9)' }}
      >
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="font-hud text-[10px] font-bold text-blue-600">APP INFO</div>
        </div>
        {ABOUT_TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3 py-2.5 border-l-[3px] transition-all text-left"
              style={{
                borderLeftColor: activeTab === tab.id ? tab.color : 'transparent',
                background: activeTab === tab.id ? `${tab.color}08` : 'transparent',
              }}
            >
              <Icon size={12} style={{ color: activeTab === tab.id ? tab.color : '#94a3b8' }} />
              <span className="font-hud text-[10px] font-bold" style={{ color: activeTab === tab.id ? tab.color : '#94a3b8' }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto panel-scroll p-3 space-y-3">

        {activeTab === 'about' && (
          <>
            <HudCard title={`ABOUT ${APP_NAME}`} accent="blue" compact>
              <div className="space-y-3">
                <div
                  className="p-4 rounded-2xl text-center"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))', border: '1px solid rgba(59,130,246,0.15)' }}
                >
                  <div className="font-hud text-2xl font-black text-blue-700 mb-1">E-SMART-WORLD</div>
                  <div className="font-hud text-[11px] text-purple-600 mb-2">E.S wOrLd — Build. Deploy. Shine.</div>
                  <div className="text-[10px] text-slate-500">Version {APP_VERSION} · Built with React + TypeScript</div>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>E-SMART-WORLD</strong> is an AI-powered project builder and deployer that helps developers, designers, and creators build, process, and deploy web projects with zero friction. Import any project, customize templates, and deploy to GitHub Pages in seconds.
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {[
                    { emoji: '📦', label: 'ZIP Extractor', desc: 'Extract and process ZIP projects' },
                    { emoji: '🎨', label: '50+ Templates', desc: 'Ready-made HTML/React templates' },
                    { emoji: '🚀', label: 'GitHub Deploy', desc: 'One-click GitHub Pages deployment' },
                    { emoji: '🥭', label: 'AI Secretary', desc: 'Powered by Gemini 3 & GPT-5' },
                    { emoji: '✨', label: 'Variations Engine', desc: 'Auto-generate 3-5 project variants' },
                    { emoji: '🔐', label: 'Secure Vault', desc: 'Encrypted credential storage' },
                    { emoji: '📱', label: 'PWA + APK', desc: 'Package as installable apps' },
                    { emoji: '📊', label: 'Deploy History', desc: 'Track all deployments' },
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(203,213,225,0.3)' }}>
                      <span className="text-base">{feat.emoji}</span>
                      <div>
                        <div className="font-hud text-[10px] font-bold text-slate-700">{feat.label}</div>
                        <div className="text-[9px] text-slate-400">{feat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </HudCard>
            <HudCard title="DEVELOPER CONTACT" accent="green" compact>
              <div className="space-y-2">
                {[
                  { icon: Mail, label: 'Email', value: DEFAULT_EMAIL, href: `mailto:${DEFAULT_EMAIL}`, color: '#3b82f6' },
                  { icon: Globe, label: 'GitHub', value: `github.com/${DEFAULT_GITHUB_USER}`, href: `https://github.com/${DEFAULT_GITHUB_USER}`, color: '#10b981' },
                ].map((contact, i) => {
                  const Icon = contact.icon
                  return (
                    <a
                      key={i}
                      href={contact.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                      style={{ background: `${contact.color}06`, border: `1px solid ${contact.color}20`, textDecoration: 'none' }}
                    >
                      <Icon size={14} style={{ color: contact.color }} />
                      <div>
                        <div className="text-[10px] text-slate-400">{contact.label}</div>
                        <div className="text-[11px] font-bold" style={{ color: contact.color }}>{contact.value}</div>
                      </div>
                      <ExternalLink size={11} className="ml-auto text-slate-300" />
                    </a>
                  )
                })}
              </div>
            </HudCard>
          </>
        )}

        {activeTab === 'disclaimer' && (
          <HudCard title="DISCLAIMER & WARNINGS" accent="gold" compact>
            <div className="space-y-3 text-[11px] text-slate-600">
              {[
                {
                  title: '⚠️ GitHub Token Security',
                  color: '#f59e0b',
                  content: 'Your GitHub Personal Access Token grants access to your repositories. Never share it publicly. Store it in the Secure Vault. If compromised, immediately revoke it at github.com/settings/tokens.'
                },
                {
                  title: '⚠️ Data Backup Warning',
                  color: '#ef4444',
                  content: 'All project data is stored in your browser\'s localStorage. Clearing browser data will delete all projects. Regularly export backups using the Admin Panel → Backup section.'
                },
                {
                  title: '⚠️ AI Secretary Accuracy',
                  color: '#8b5cf6',
                  content: 'The AI Secretary uses large language models (Gemini 3, GPT-5). While highly capable, AI responses may contain errors. Always verify critical code and deployment steps.'
                },
                {
                  title: '⚠️ ZIP File Safety',
                  color: '#f97316',
                  content: 'Only import ZIP files from trusted sources. Malicious ZIP files could contain harmful scripts. E-SMART-WORLD processes files locally in your browser sandbox.'
                },
                {
                  title: '⚠️ Play Store Account',
                  color: '#3b82f6',
                  content: 'Your keystore file is critical for Play Store apps. Losing it means you cannot update your app. Store the keystore, passwords, and key aliases in the Secure Vault and create external backups.'
                },
                {
                  title: 'ℹ️ No Warranty',
                  color: '#64748b',
                  content: 'E-SMART-WORLD is provided "as-is" without warranties. We are not responsible for deployment failures, data loss, or service interruptions. Maintain your own backups.'
                },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: `${item.color}06`, border: `1px solid ${item.color}20` }}>
                  <div className="font-bold mb-1.5" style={{ color: item.color }}>{item.title}</div>
                  <div className="leading-relaxed">{item.content}</div>
                </div>
              ))}
            </div>
          </HudCard>
        )}

        {activeTab === 'privacy' && (
          <HudCard title="PRIVACY POLICY" accent="purple" compact>
            <div className="text-[10px] text-slate-400 mb-3">Last Updated: {new Date().toLocaleDateString()}</div>
            <div className="space-y-3 text-[11px] text-slate-600">
              {[
                { title: '1. Information We Collect', content: 'We collect GitHub tokens (stored locally), project files (processed locally), account information you provide, and anonymous usage data for app improvement.' },
                { title: '2. How We Use Information', content: 'To provide project building and deployment services, save your preferences locally, and facilitate GitHub API integration. We do NOT sell your data.' },
                { title: '3. Data Storage', content: 'All data stored in browser localStorage on your device only. Deploy history stored in Supabase (encrypted at rest). GitHub tokens transmitted only to GitHub\'s API.' },
                { title: '4. Third-Party Services', content: 'GitHub API (deployment), Expo Go (React Native builds), OnSpace AI (AI Secretary), Supabase (backend database). Each has their own privacy policies.' },
                { title: '5. Your Rights', content: 'Export all data anytime from Admin Panel. Delete local data by clearing browser storage. Contact drmirfan5577@gmail.com for data requests.' },
                { title: '6. Contact', content: `Email: ${DEFAULT_EMAIL}` },
              ].map((section, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)' }}>
                  <div className="font-hud font-bold text-purple-700 mb-1.5">{section.title}</div>
                  <div className="leading-relaxed">{section.content}</div>
                </div>
              ))}
            </div>
          </HudCard>
        )}

        {activeTab === 'terms' && (
          <HudCard title="TERMS OF SERVICE" accent="green" compact>
            <div className="text-[10px] text-slate-400 mb-3">Last Updated: {new Date().toLocaleDateString()}</div>
            <div className="space-y-3 text-[11px] text-slate-600">
              {[
                { title: '1. Acceptance', content: 'By using E-SMART-WORLD, you agree to these Terms of Service.' },
                { title: '2. Use of Service', content: 'E-SMART-WORLD is for lawful web project development. You are responsible for your project content. Do not use for illegal purposes.' },
                { title: '3. Intellectual Property', content: 'E-SMART-WORLD software is proprietary. Your projects remain your intellectual property. Templates provided for personal and commercial use.' },
                { title: '4. GitHub Integration', content: 'You are responsible for your GitHub credentials. GitHub Personal Access Tokens are stored locally. We are not responsible for GitHub API outages.' },
                { title: '5. AI Secretary', content: 'AI responses are from Google Gemini/OpenAI GPT. Do not share sensitive personal data with AI. Verify critical AI-generated information.' },
                { title: '6. Limitation of Liability', content: 'E-SMART-WORLD is provided "as-is". We are not liable for data loss — maintain your own backups. Service availability not guaranteed.' },
              ].map((section, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
                  <div className="font-hud font-bold text-emerald-700 mb-1.5">{section.title}</div>
                  <div className="leading-relaxed">{section.content}</div>
                </div>
              ))}
            </div>
          </HudCard>
        )}

        {activeTab === 'copyright' && (
          <HudCard title="COPYRIGHT NOTICE" accent="red" compact>
            <div
              className="p-4 rounded-2xl text-center mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(249,115,22,0.06))', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              <Copyright size={28} className="mx-auto mb-2 text-red-500" />
              <div className="font-hud text-lg font-black text-red-700">© {new Date().getFullYear()} E-SMART-WORLD</div>
              <div className="text-[11px] text-slate-500 mt-1">All Rights Reserved</div>
            </div>
            <div className="space-y-3 text-[11px] text-slate-600">
              {[
                {
                  title: 'Ownership',
                  content: `This application is the intellectual property of ${DEFAULT_EMAIL}. All source code, designs, and algorithms are original works protected under copyright law.`
                },
                {
                  title: 'Permitted Use',
                  content: 'Personal use of the app, creating/deploying your own projects, using provided templates for personal or commercial projects.'
                },
                {
                  title: 'Prohibited Use',
                  content: 'Copying or distributing this application, reverse engineering proprietary algorithms, using the E-SMART-WORLD brand without permission.'
                },
                {
                  title: 'Open Source Libraries',
                  content: 'React (MIT), Vite (MIT), Tailwind CSS (MIT), Lucide Icons (ISC), JSZip (MIT), Supabase JS (MIT). All used in compliance with their licenses.'
                },
              ].map((section, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <div className="font-hud font-bold text-red-700 mb-1.5">{section.title}</div>
                  <div className="leading-relaxed">{section.content}</div>
                </div>
              ))}
            </div>
          </HudCard>
        )}
      </div>
    </div>
  )
}
