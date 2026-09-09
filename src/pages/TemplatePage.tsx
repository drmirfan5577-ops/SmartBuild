import React, { useState, useRef, useEffect } from 'react'
import {
  Search, Grid, List, Download, Zap, Eye, Code2, Copy,
  Star, Tag, ChevronRight, Plus, BookOpen, Sparkles, Package,
  Globe, Smartphone, Layout, RefreshCw, X, CheckCircle
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { HudCard } from '@/components/ui/HudCard'
import { generateId, formatDate } from '@/lib/utils'
import type { Project } from '@/types'

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: Grid, color: '#00e5ff' },
  { id: 'html', label: 'HTML / CSS', icon: Globe, color: '#fb923c' },
  { id: 'react', label: 'React Apps', icon: Package, color: '#00e5ff' },
  { id: 'portfolio', label: 'Portfolios', icon: Layout, color: '#c084fc' },
  { id: 'react-native', label: 'React Native', icon: Smartphone, color: '#4ade80' },
  { id: 'featured', label: '⭐ Featured', icon: Star, color: '#ffc107' },
]

const BUILT_IN_TEMPLATES = [
  // HTML Templates
  {
    id: 'saas-landing', name: 'Modern SaaS Landing', category: 'html', featured: true, downloads: 234,
    tags: ['landing', 'saas', 'modern'], description: 'Clean SaaS landing page with hero, features, pricing',
    color: '#00e5ff',
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>{{APP_NAME}} - {{TAGLINE}}</title>\n  <style>\n    *{margin:0;padding:0;box-sizing:border-box}\n    body{font-family:Inter,sans-serif;background:#0f172a;color:#f1f5f9}\n    nav{position:fixed;top:0;left:0;right:0;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;background:rgba(15,23,42,.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08);z-index:100}\n    .logo{font-size:1.3rem;font-weight:900;color:#38bdf8}nav a{color:#94a3b8;text-decoration:none;font-size:.9rem}\n    .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:radial-gradient(ellipse at center,rgba(56,189,248,.1) 0%,transparent 70%)}\n    .badge{display:inline-block;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3);color:#38bdf8;padding:.35rem 1rem;border-radius:999px;font-size:.8rem;margin-bottom:1.5rem}\n    .hero h1{font-size:3.5rem;font-weight:900;line-height:1.1;margin-bottom:1.5rem}\n    .hero h1 span{background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\n    .hero p{color:#94a3b8;font-size:1.1rem;margin-bottom:2.5rem;max-width:500px}\n    .buttons{display:flex;gap:1rem;justify-content:center}\n    .btn{padding:.75rem 1.75rem;border-radius:8px;font-weight:700;text-decoration:none;cursor:pointer;border:none;font-size:.95rem}\n    .btn-primary{background:#38bdf8;color:#0f172a}\n    .btn-outline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.2)}\n    .features{max-width:1100px;margin:0 auto;padding:5rem 2rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}\n    .feature{background:rgba(30,41,59,.8);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:1.75rem}\n    .feature h3{color:#f1f5f9;margin-bottom:.5rem;font-size:1.1rem}\n    .feature p{color:#64748b;font-size:.9rem;line-height:1.6}\n    .icon{font-size:1.5rem;margin-bottom:.75rem}\n  </style>\n</head>\n<body>\n  <nav>\n    <span class="logo">{{APP_NAME}}</span>\n    <div style="display:flex;gap:2rem"><a href="#">Features</a><a href="#">Pricing</a><a href="#">Docs</a></div>\n    <a href="#" class="btn btn-primary" style="padding:.5rem 1.25rem">Get Started</a>\n  </nav>\n  <section class="hero">\n    <div>\n      <div class="badge">✨ Now available</div>\n      <h1>{{HEADLINE}}<br><span>{{SUBHEADLINE}}</span></h1>\n      <p>{{DESCRIPTION}}</p>\n      <div class="buttons">\n        <a href="#" class="btn btn-primary">{{CTA_PRIMARY}}</a>\n        <a href="#" class="btn btn-outline">{{CTA_SECONDARY}}</a>\n      </div>\n    </div>\n  </section>\n  <div class="features">\n    <div class="feature"><div class="icon">⚡</div><h3>{{FEATURE_1_TITLE}}</h3><p>{{FEATURE_1_DESC}}</p></div>\n    <div class="feature"><div class="icon">🔒</div><h3>{{FEATURE_2_TITLE}}</h3><p>{{FEATURE_2_DESC}}</p></div>\n    <div class="feature"><div class="icon">🚀</div><h3>{{FEATURE_3_TITLE}}</h3><p>{{FEATURE_3_DESC}}</p></div>\n  </div>\n</body>\n</html>`,
    variables: [
      { key: 'APP_NAME', label: 'App Name', default: 'MyApp' },
      { key: 'TAGLINE', label: 'Tagline', default: 'Build Faster' },
      { key: 'HEADLINE', label: 'Hero Headline', default: 'Build Faster' },
      { key: 'SUBHEADLINE', label: 'Hero Sub-Headline', default: 'Ship Smarter' },
      { key: 'DESCRIPTION', label: 'Description', default: 'The all-in-one platform for modern teams.' },
      { key: 'CTA_PRIMARY', label: 'Primary CTA', default: 'Get Started Free' },
      { key: 'CTA_SECONDARY', label: 'Secondary CTA', default: 'View Demo →' },
      { key: 'FEATURE_1_TITLE', label: 'Feature 1 Title', default: 'Lightning Fast' },
      { key: 'FEATURE_1_DESC', label: 'Feature 1 Desc', default: 'Optimized for performance and speed.' },
      { key: 'FEATURE_2_TITLE', label: 'Feature 2 Title', default: 'Secure by Default' },
      { key: 'FEATURE_2_DESC', label: 'Feature 2 Desc', default: 'Enterprise-grade security built in.' },
      { key: 'FEATURE_3_TITLE', label: 'Feature 3 Title', default: 'Deploy Anywhere' },
      { key: 'FEATURE_3_DESC', label: 'Feature 3 Desc', default: 'One-click deployment to any platform.' },
    ]
  },
  {
    id: 'dark-portfolio', name: 'Developer Portfolio Pro', category: 'portfolio', featured: true, downloads: 312,
    tags: ['portfolio', 'developer', 'dark'], description: 'Professional developer portfolio with dark theme',
    color: '#c084fc',
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>{{YOUR_NAME}} — Developer</title>\n  <style>\n    *{margin:0;padding:0;box-sizing:border-box}\n    :root{--bg:#0a0a0f;--card:rgba(255,255,255,.04);--border:rgba(255,255,255,.08);--accent:#a855f7}\n    body{font-family:Inter,sans-serif;background:var(--bg);color:#e2e8f0;overflow-x:hidden}\n    nav{position:fixed;top:0;left:0;right:0;padding:1.25rem 3rem;display:flex;justify-content:space-between;align-items:center;background:rgba(10,10,15,.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);z-index:100}\n    .logo{font-weight:900;font-size:1.1rem;color:var(--accent)}nav a{color:#94a3b8;text-decoration:none;font-size:.9rem;transition:.2s}nav a:hover{color:#fff}\n    .hero{min-height:100vh;display:flex;align-items:center;padding:0 3rem;position:relative;overflow:hidden}\n    .hero::before{content:"";position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(168,85,247,.15),transparent);top:-100px;right:-100px;pointer-events:none}\n    .tag{display:inline-block;background:rgba(168,85,247,.15);border:1px solid rgba(168,85,247,.3);color:var(--accent);padding:.3rem .9rem;border-radius:999px;font-size:.8rem;margin-bottom:1.5rem}\n    h1{font-size:4rem;font-weight:900;line-height:1.1;margin-bottom:1rem}h1 span{color:var(--accent)}\n    .subtitle{color:#64748b;font-size:1.1rem;margin-bottom:2rem;max-width:500px;line-height:1.7}\n    .btns{display:flex;gap:1rem}.btn{padding:.75rem 1.75rem;border-radius:8px;font-weight:700;text-decoration:none;cursor:pointer;border:none;font-size:.9rem}\n    .btn-main{background:var(--accent);color:#fff}.btn-ghost{background:var(--card);color:#e2e8f0;border:1px solid var(--border)}\n    .skills{max-width:1100px;margin:0 auto;padding:5rem 3rem}\n    .skills h2{font-size:1.75rem;font-weight:800;margin-bottom:2rem}h2 span{color:var(--accent)}\n    .skill-grid{display:flex;flex-wrap:wrap;gap:.75rem}\n    .skill{background:var(--card);border:1px solid var(--border);padding:.5rem 1.25rem;border-radius:8px;font-size:.9rem}\n    .projects{max-width:1100px;margin:0 auto;padding:0 3rem 5rem}\n    .project-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}\n    .project{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.75rem;transition:.3s}\n    .project:hover{border-color:rgba(168,85,247,.4);transform:translateY(-2px)}\n    .project h3{font-size:1.1rem;margin-bottom:.5rem}.project p{color:#64748b;font-size:.9rem;line-height:1.6;margin-bottom:1rem}\n    .tech{display:flex;flex-wrap:wrap;gap:.4rem}\n    .tech span{background:rgba(168,85,247,.1);color:var(--accent);padding:.2rem .6rem;border-radius:4px;font-size:.75rem}\n  </style>\n</head>\n<body>\n  <nav><span class="logo">{{YOUR_NAME}}</span><div style="display:flex;gap:2rem"><a href="#">About</a><a href="#">Projects</a><a href="#">Contact</a></div></nav>\n  <section class="hero">\n    <div>\n      <span class="tag">Available for work</span>\n      <h1>Hi, I am <span>{{YOUR_NAME}}</span></h1>\n      <p class="subtitle">{{BIO}}</p>\n      <div class="btns"><a href="#" class="btn btn-main">View Projects</a><a href="#" class="btn btn-ghost">Download CV</a></div>\n    </div>\n  </section>\n  <section class="skills"><h2>My <span>Skills</span></h2>\n    <div class="skill-grid">\n      {{SKILLS}}\n    </div>\n  </section>\n  <section class="projects"><h2>Featured <span>Projects</span></h2>\n    <div class="project-grid">\n      <div class="project"><h3>{{PROJECT_1_NAME}}</h3><p>{{PROJECT_1_DESC}}</p><div class="tech"><span>React</span><span>TypeScript</span></div></div>\n      <div class="project"><h3>{{PROJECT_2_NAME}}</h3><p>{{PROJECT_2_DESC}}</p><div class="tech"><span>Node.js</span><span>MongoDB</span></div></div>\n    </div>\n  </section>\n</body>\n</html>`,
    variables: [
      { key: 'YOUR_NAME', label: 'Your Name', default: 'John Doe' },
      { key: 'BIO', label: 'Short Bio', default: 'Full-stack developer building amazing digital experiences.' },
      { key: 'SKILLS', label: 'Skills (HTML)', default: '<span class="skill">React</span><span class="skill">Node.js</span><span class="skill">TypeScript</span><span class="skill">Python</span>' },
      { key: 'PROJECT_1_NAME', label: 'Project 1 Name', default: 'E-Commerce Platform' },
      { key: 'PROJECT_1_DESC', label: 'Project 1 Description', default: 'Full-stack e-commerce with real-time inventory.' },
      { key: 'PROJECT_2_NAME', label: 'Project 2 Name', default: 'AI Dashboard' },
      { key: 'PROJECT_2_DESC', label: 'Project 2 Description', default: 'Machine learning dashboard with data visualization.' },
    ]
  },
  {
    id: 'link-in-bio', name: 'Link in Bio', category: 'html', featured: true, downloads: 567,
    tags: ['linkinbio', 'social', 'links'], description: 'Instagram-style social link page',
    color: '#4ade80',
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>{{YOUR_NAME}} — Links</title>\n  <style>\n    *{margin:0;padding:0;box-sizing:border-box}\n    body{min-height:100vh;background:linear-gradient(135deg,{{BG_COLOR_1}},{{BG_COLOR_2}});font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;padding:2rem}\n    .card{background:rgba(255,255,255,.15);backdrop-filter:blur(20px);border-radius:24px;padding:2.5rem;width:100%;max-width:400px;text-align:center;color:#fff;border:1px solid rgba(255,255,255,.2)}\n    .avatar{width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:3px solid rgba(255,255,255,.5);object-fit:cover}\n    .name{font-size:1.5rem;font-weight:800;margin-bottom:.4rem}.bio{opacity:.8;margin-bottom:.25rem;font-size:.9rem}.handle{opacity:.5;font-size:.8rem;margin-bottom:2rem}\n    .links a{display:flex;align-items:center;justify-content:center;gap:.75rem;background:rgba(255,255,255,.2);border-radius:14px;padding:1rem 1.5rem;margin-bottom:.75rem;color:#fff;text-decoration:none;font-weight:600;transition:.2s;border:1px solid rgba(255,255,255,.1)}\n    .links a:hover{background:rgba(255,255,255,.35);transform:scale(1.02)}\n    .footer{margin-top:1.5rem;opacity:.5;font-size:.75rem}\n  </style>\n</head>\n<body>\n  <div class="card">\n    <img class="avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=180" alt="avatar">\n    <h1 class="name">{{YOUR_NAME}}</h1>\n    <p class="bio">{{BIO}}</p>\n    <p class="handle">@{{HANDLE}}</p>\n    <div class="links">\n      <a href="{{LINK_1_URL}}">🌐 {{LINK_1_LABEL}}</a>\n      <a href="{{LINK_2_URL}}">📸 {{LINK_2_LABEL}}</a>\n      <a href="{{LINK_3_URL}}">🐙 {{LINK_3_LABEL}}</a>\n      <a href="{{LINK_4_URL}}">💼 {{LINK_4_LABEL}}</a>\n      <a href="{{LINK_5_URL}}">📧 {{LINK_5_LABEL}}</a>\n    </div>\n    <p class="footer">Made with ❤️ using E-SMART-WORLD</p>\n  </div>\n</body>\n</html>`,
    variables: [
      { key: 'YOUR_NAME', label: 'Your Name', default: 'Alex Johnson' },
      { key: 'BIO', label: 'Bio Line', default: 'Creator • Developer • Designer' },
      { key: 'HANDLE', label: 'Social Handle', default: 'alexjohnson' },
      { key: 'BG_COLOR_1', label: 'Background Color 1', default: '#667eea' },
      { key: 'BG_COLOR_2', label: 'Background Color 2', default: '#764ba2' },
      { key: 'LINK_1_URL', label: 'Link 1 URL', default: 'https://mywebsite.com' },
      { key: 'LINK_1_LABEL', label: 'Link 1 Label', default: 'My Website' },
      { key: 'LINK_2_URL', label: 'Link 2 URL', default: 'https://instagram.com' },
      { key: 'LINK_2_LABEL', label: 'Link 2 Label', default: 'Instagram' },
      { key: 'LINK_3_URL', label: 'Link 3 URL', default: 'https://github.com' },
      { key: 'LINK_3_LABEL', label: 'Link 3 Label', default: 'GitHub' },
      { key: 'LINK_4_URL', label: 'Link 4 URL', default: 'https://linkedin.com' },
      { key: 'LINK_4_LABEL', label: 'Link 4 Label', default: 'LinkedIn' },
      { key: 'LINK_5_URL', label: 'Link 5 URL', default: 'mailto:hello@example.com' },
      { key: 'LINK_5_LABEL', label: 'Link 5 Label', default: 'Email Me' },
    ]
  },
  {
    id: 'resume-cv', name: 'Professional Resume / CV', category: 'html', featured: true, downloads: 534,
    tags: ['resume', 'cv', 'professional'], description: 'Professional online resume with skills and experience',
    color: '#ffc107',
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>{{YOUR_NAME}} — Resume</title>\n  <style>\n    *{margin:0;padding:0;box-sizing:border-box}\n    body{font-family:"Georgia",serif;background:#f9f9f9;color:#333;padding:2rem}\n    .container{max-width:800px;margin:0 auto;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.1);border-radius:8px;overflow:hidden}\n    .header{background:{{ACCENT_COLOR}};color:#fff;padding:2.5rem 3rem}\n    .header h1{font-size:2rem;margin-bottom:.5rem}.header p{opacity:.85;font-size:1rem}\n    .section{padding:2rem 3rem;border-bottom:1px solid #e2e8f0}\n    .section h2{font-size:1rem;font-weight:700;color:{{ACCENT_COLOR}};text-transform:uppercase;letter-spacing:.08em;margin-bottom:1.5rem;padding-bottom:.5rem;border-bottom:2px solid {{ACCENT_COLOR}}}\n    .job{margin-bottom:1.5rem}.job h3{font-weight:700;margin-bottom:.25rem;color:#1a202c}\n    .job .meta{color:#718096;font-size:.85rem;margin-bottom:.5rem;font-style:italic}\n    .job ul{list-style:none;padding:0}.job li{color:#4a5568;font-size:.9rem;line-height:1.7;padding-left:1rem;position:relative}\n    .job li::before{content:"▸";position:absolute;left:0;color:{{ACCENT_COLOR}}}\n    .skills-grid{display:flex;flex-wrap:wrap;gap:.5rem}\n    .skill{background:#ebf8ff;color:#2b6cb0;padding:.3rem .8rem;border-radius:999px;font-size:.8rem}\n    .contact-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem}\n    .contact-item{display:flex;align-items:center;gap:.5rem;font-size:.9rem}\n  </style>\n</head>\n<body>\n  <div class="container">\n    <div class="header">\n      <h1>{{YOUR_NAME}}</h1>\n      <p>{{JOB_TITLE}} | {{EMAIL}} | {{PHONE}} | {{LOCATION}}</p>\n    </div>\n    <div class="section"><h2>Professional Summary</h2><p style="color:#4a5568;line-height:1.8">{{SUMMARY}}</p></div>\n    <div class="section"><h2>Experience</h2>\n      <div class="job"><h3>{{JOB_1_TITLE}}</h3><div class="meta">{{JOB_1_COMPANY}} | {{JOB_1_PERIOD}}</div><ul><li>{{JOB_1_ACHIEVEMENT_1}}</li><li>{{JOB_1_ACHIEVEMENT_2}}</li></ul></div>\n    </div>\n    <div class="section"><h2>Skills</h2><div class="skills-grid">{{SKILLS}}</div></div>\n    <div class="section"><h2>Education</h2><div class="job"><h3>{{DEGREE}}</h3><div class="meta">{{UNIVERSITY}} | {{GRAD_YEAR}}</div></div></div>\n  </div>\n</body>\n</html>`,
    variables: [
      { key: 'YOUR_NAME', label: 'Full Name', default: 'Muhammad Irfan' },
      { key: 'JOB_TITLE', label: 'Job Title', default: 'Full Stack Developer' },
      { key: 'EMAIL', label: 'Email', default: 'drmirfan5577@gmail.com' },
      { key: 'PHONE', label: 'Phone', default: '+92 300 1234567' },
      { key: 'LOCATION', label: 'Location', default: 'Pakistan' },
      { key: 'ACCENT_COLOR', label: 'Accent Color', default: '#1a365d' },
      { key: 'SUMMARY', label: 'Professional Summary', default: 'Experienced developer with expertise in web technologies.' },
      { key: 'JOB_1_TITLE', label: 'Job Title 1', default: 'Senior Developer' },
      { key: 'JOB_1_COMPANY', label: 'Company 1', default: 'Tech Company' },
      { key: 'JOB_1_PERIOD', label: 'Period 1', default: '2022 - Present' },
      { key: 'JOB_1_ACHIEVEMENT_1', label: 'Achievement 1', default: 'Led development of key product features' },
      { key: 'JOB_1_ACHIEVEMENT_2', label: 'Achievement 2', default: 'Improved system performance by 40%' },
      { key: 'SKILLS', label: 'Skills (HTML spans)', default: '<span class="skill">React</span><span class="skill">Node.js</span><span class="skill">TypeScript</span>' },
      { key: 'DEGREE', label: 'Degree', default: 'B.Sc. Computer Science' },
      { key: 'UNIVERSITY', label: 'University', default: 'University Name' },
      { key: 'GRAD_YEAR', label: 'Graduation Year', default: '2020' },
    ]
  },
  {
    id: 'tech-dark-landing', name: 'Dark Tech Landing Page', category: 'html', featured: true, downloads: 678,
    tags: ['tech', 'product', 'dark'], description: 'Premium dark mode tech product page',
    color: '#4ade80',
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>{{PRODUCT_NAME}}</title>\n  <style>\n    *{margin:0;padding:0;box-sizing:border-box}\n    body{font-family:Inter,sans-serif;background:#09090b;color:#fafafa}\n    .nav{padding:1.25rem 2rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.08)}\n    .nav .logo{font-weight:900;font-size:1.2rem;color:#{{BRAND_COLOR}}}\n    .nav a{color:#a1a1aa;text-decoration:none;font-size:.9rem;margin-left:2rem}\n    .hero{max-width:1000px;margin:0 auto;padding:6rem 2rem;text-align:center}\n    .badge{display:inline-flex;align-items:center;gap:.5rem;border:1px solid rgba(255,255,255,.15);border-radius:999px;padding:.3rem 1rem;font-size:.8rem;color:#a1a1aa;margin-bottom:2rem}\n    h1{font-size:3.5rem;font-weight:900;line-height:1.1;margin-bottom:1.5rem;background:linear-gradient(135deg,#fff,rgba(255,255,255,.6));-webkit-background-clip:text;-webkit-text-fill-color:transparent}\n    .subtitle{color:#71717a;font-size:1.1rem;margin-bottom:2.5rem;max-width:500px;margin-left:auto;margin-right:auto}\n    .buttons{display:flex;gap:1rem;justify-content:center}\n    .btn-main{padding:.8rem 1.75rem;background:#fafafa;color:#09090b;border-radius:8px;font-weight:700;border:none;cursor:pointer;font-size:.95rem}\n    .btn-outline{padding:.8rem 1.75rem;background:transparent;color:#fafafa;border:1px solid rgba(255,255,255,.2);border-radius:8px;cursor:pointer;font-size:.95rem}\n    .features{max-width:900px;margin:6rem auto;padding:0 2rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}\n    .feat{background:#18181b;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:1.75rem}\n    .feat .icon{font-size:1.75rem;margin-bottom:1rem}\n    .feat h3{font-size:1rem;font-weight:700;margin-bottom:.5rem}\n    .feat p{color:#71717a;font-size:.85rem;line-height:1.6}\n  </style>\n</head>\n<body>\n  <nav class="nav">\n    <span class="logo">{{PRODUCT_NAME}}</span>\n    <div><a href="#">Features</a><a href="#">Pricing</a><a href="#">Blog</a></div>\n    <a href="#" style="background:#fff;color:#000;padding:.5rem 1.25rem;border-radius:8px;font-weight:700;text-decoration:none">Sign Up</a>\n  </nav>\n  <div class="hero">\n    <div class="badge">✨ {{BADGE_TEXT}}</div>\n    <h1>{{HEADLINE_LINE_1}}<br>{{HEADLINE_LINE_2}}</h1>\n    <p class="subtitle">{{SUBTITLE}}</p>\n    <div class="buttons"><button class="btn-main">{{CTA_1}}</button><button class="btn-outline">{{CTA_2}}</button></div>\n  </div>\n  <div class="features">\n    <div class="feat"><div class="icon">{{FEAT_1_ICON}}</div><h3>{{FEAT_1_TITLE}}</h3><p>{{FEAT_1_DESC}}</p></div>\n    <div class="feat"><div class="icon">{{FEAT_2_ICON}}</div><h3>{{FEAT_2_TITLE}}</h3><p>{{FEAT_2_DESC}}</p></div>\n    <div class="feat"><div class="icon">{{FEAT_3_ICON}}</div><h3>{{FEAT_3_TITLE}}</h3><p>{{FEAT_3_DESC}}</p></div>\n  </div>\n</body>\n</html>`,
    variables: [
      { key: 'PRODUCT_NAME', label: 'Product Name', default: 'E-SMART-WORLD' },
      { key: 'BRAND_COLOR', label: 'Brand Color (hex no #)', default: '38bdf8' },
      { key: 'BADGE_TEXT', label: 'Badge Text', default: 'Now in Public Beta' },
      { key: 'HEADLINE_LINE_1', label: 'Headline Line 1', default: 'Build Faster' },
      { key: 'HEADLINE_LINE_2', label: 'Headline Line 2', default: 'Ship Smarter' },
      { key: 'SUBTITLE', label: 'Subtitle', default: 'The all-in-one platform for modern development teams.' },
      { key: 'CTA_1', label: 'Button 1', default: 'Start for free' },
      { key: 'CTA_2', label: 'Button 2', default: 'View Demo →' },
      { key: 'FEAT_1_ICON', label: 'Feature 1 Icon (emoji)', default: '⚡' },
      { key: 'FEAT_1_TITLE', label: 'Feature 1 Title', default: 'Lightning Fast' },
      { key: 'FEAT_1_DESC', label: 'Feature 1 Desc', default: 'Blazing fast performance out of the box.' },
      { key: 'FEAT_2_ICON', label: 'Feature 2 Icon (emoji)', default: '🔒' },
      { key: 'FEAT_2_TITLE', label: 'Feature 2 Title', default: 'Secure' },
      { key: 'FEAT_2_DESC', label: 'Feature 2 Desc', default: 'Enterprise-grade security built in.' },
      { key: 'FEAT_3_ICON', label: 'Feature 3 Icon (emoji)', default: '🤖' },
      { key: 'FEAT_3_TITLE', label: 'Feature 3 Title', default: 'AI-Powered' },
      { key: 'FEAT_3_DESC', label: 'Feature 3 Desc', default: 'Smart automation at every step.' },
    ]
  },
]

const PROMPTS_50 = [
  { category: 'Landing Pages', items: [
    'Create a modern SaaS landing page with animated hero, 3 feature cards, pricing table, and CTA',
    'Build a mobile app marketing page with phone mockup, screenshots gallery, and app store buttons',
    'Design a startup landing page with video background, product demo section, and waitlist form',
    'Make a crypto/blockchain project landing page with live price ticker and whitepaper download',
    'Create a freelancer services page with portfolio grid, testimonials, and contact form',
  ]},
  { category: 'Portfolio Sites', items: [
    'Build a developer portfolio with GitHub stats integration, live project demos, and skill badges',
    'Create a UI/UX designer portfolio with case study cards, Dribbble embed, and contact form',
    'Make a photographer portfolio with lightbox gallery, client testimonials, and booking form',
    'Design a music producer portfolio with audio player, track list, and collaboration CTA',
    'Build a data scientist portfolio with project notebooks, skills radar chart, and resume download',
  ]},
  { category: 'Business Sites', items: [
    'Create a restaurant website with menu categories, food gallery, online reservation, and hours',
    'Build an e-commerce store with product grid, cart sidebar, wishlist, and checkout flow',
    'Design a law firm website with practice areas, attorney profiles, and consultation booking',
    'Make a real estate agency with property listings, map integration, and mortgage calculator',
    'Create a gym/fitness studio with class schedule, trainer profiles, and membership pricing',
  ]},
  { category: 'React Apps', items: [
    'Build a full Kanban board with drag-drop columns, task labels, due dates, and team assignment',
    'Create a budget tracker with income/expense categories, monthly charts, and export to CSV',
    'Make a recipe manager with ingredient search, cooking timer, and meal planning calendar',
    'Build a flashcard study app with spaced repetition, progress tracking, and category management',
    'Create a habit tracker with streak counter, calendar heatmap, and motivational quotes',
  ]},
  { category: 'Dashboard Apps', items: [
    'Build an analytics dashboard with line charts, bar graphs, data tables, and date range filter',
    'Create a project management dashboard with team workload, deadline alerts, and Gantt chart',
    'Design an inventory management system with low stock alerts, supplier info, and sales reports',
    'Make a social media analytics dashboard with engagement metrics and follower growth charts',
    'Build a fitness tracking dashboard with workout logs, body measurements, and goal progress',
  ]},
  { category: 'Mobile Apps (React Native)', items: [
    'Create an Expo meditation app with breathing exercises, guided sessions, and mood tracking',
    'Build a React Native food delivery app with restaurant list, cart, and order tracking map',
    'Make an Expo language learning app with flashcards, pronunciation guide, and daily streaks',
    'Design a React Native personal finance app with bank sync, categories, and budget alerts',
    'Create an Expo workout tracker with exercise library, set/rep logging, and progress photos',
  ]},
  { category: 'Advanced Features', items: [
    'Add real-time chat to any React app using WebSockets with typing indicators and read receipts',
    'Implement full authentication flow with OTP verification, social login, and JWT tokens',
    'Build a multi-step form wizard with validation, progress bar, and field autosave',
    'Create a rich text editor with formatting toolbar, image upload, and markdown preview',
    'Add dark/light mode with system preference detection, CSS variables, and smooth transitions',
  ]},
  { category: 'E-Commerce', items: [
    'Build a complete Shopify-style store with product variants, reviews, and abandoned cart emails',
    'Create a digital marketplace with seller profiles, product listings, and escrow payments',
    'Design a subscription box service page with quiz, plan selection, and billing management',
    'Make a print-on-demand store with product customizer, mockup generator, and order tracking',
    'Build an NFT marketplace with wallet connect, mint page, and collection gallery',
  ]},
  { category: 'AI-Powered', items: [
    'Create an AI writing assistant with prompt templates, tone selector, and content history',
    'Build an AI image description tool with upload, analysis, and alt-text generator',
    'Make a chatbot interface with multiple personas, conversation export, and model selector',
    'Design an AI code reviewer with syntax highlighting, suggestions, and fix button',
    'Build an AI resume builder with job description analysis and keyword optimization',
  ]},
  { category: 'Specialized', items: [
    'Create a wedding website with RSVP form, venue map, photo gallery, and countdown timer',
    'Build a school/university website with admissions, courses catalog, and student portal',
    'Design a non-profit charity site with donation form, impact statistics, and volunteer signup',
    'Make a podcast website with episode player, transcript, newsletter, and sponsor section',
    'Create a job board with listing filters, company profiles, application form, and email alerts',
  ]},
]

export function TemplatePage() {
  const { addProject, navigate } = useApp()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selected, setSelected] = useState<(typeof BUILT_IN_TEMPLATES)[0] | null>(null)
  const [customVars, setCustomVars] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'templates' | 'prompts' | 'create' | 'community'>('templates')
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [promptCopied, setPromptCopied] = useState<string | null>(null)
  const [newTemplate, setNewTemplate] = useState({
    name: '', category: 'html', description: '', tags: '', code: ''
  })
  const [savedCustom, setSavedCustom] = useState(false)
  const [communitySubmission, setCommunitySubmission] = useState({ name: '', category: 'html', description: '', code: '', author: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const codePreviewRef = useRef<HTMLIFrameElement>(null)

  const tabs = [
    { id: 'templates', label: 'GALLERY', icon: Grid },
    { id: 'prompts', label: '50+ PROMPTS', icon: Sparkles },
    { id: 'create', label: 'CREATE', icon: Plus },
    { id: 'community', label: 'COMMUNITY', icon: BookOpen },
  ]

  const filteredTemplates = BUILT_IN_TEMPLATES.filter(t => {
    if (activeCategory === 'featured') return t.featured
    if (activeCategory !== 'all' && t.category !== activeCategory) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.tags.some(tag => tag.includes(search.toLowerCase()))) return false
    return true
  })

  const buildCode = (template: typeof BUILT_IN_TEMPLATES[0]) => {
    let code = template.code
    template.variables.forEach(v => {
      const val = customVars[v.key] !== undefined ? customVars[v.key] : v.default
      code = code.replaceAll(`{{${v.key}}}`, val)
    })
    return code
  }

  const handleSelectTemplate = (t: typeof BUILT_IN_TEMPLATES[0]) => {
    setSelected(t)
    const defaults: Record<string, string> = {}
    t.variables.forEach(v => { defaults[v.key] = v.default })
    setCustomVars(defaults)
  }

  const handleImportTemplate = async () => {
    if (!selected) return
    setImporting(true)
    await new Promise(r => setTimeout(r, 1000))
    const code = buildCode(selected)
    const project = {
      id: generateId(),
      name: customVars['APP_NAME'] || customVars['YOUR_NAME'] || customVars['PRODUCT_NAME'] || selected.name,
      type: 'html' as const,
      status: 'ready' as const,
      deployStatus: 'idle' as const,
      files: [{ name: 'index.html', path: '/', content: code, type: 'text/html', size: code.length }],
      createdAt: formatDate(),
    }
    addProject(project)
    setImportSuccess(true)
    setImporting(false)
    setTimeout(() => { navigate('process'); setImportSuccess(false) }, 1400)
  }

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
    setPromptCopied(text)
    setTimeout(() => setPromptCopied(null), 2000)
  }

  const saveCustomTemplate = () => {
    if (!newTemplate.name || !newTemplate.code) return
    setSavedCustom(true)
    setTimeout(() => setSavedCustom(false), 2000)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex-shrink-0 flex border-b" style={{ borderColor: 'rgba(0,229,255,0.12)', background: 'rgba(7,13,26,0.95)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-3 transition-all border-b-2"
              style={{
                borderBottomColor: activeTab === tab.id ? '#00e5ff' : 'transparent',
                background: activeTab === tab.id ? 'rgba(0,229,255,0.08)' : 'transparent',
                color: activeTab === tab.id ? '#00e5ff' : '#94a3b8',
              }}
            >
              <Icon size={13} />
              <span className="font-hud text-[10px] font-bold">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: category filter */}
          <div className="w-40 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'rgba(0,229,255,0.1)', background: 'rgba(7,13,26,0.95)' }}>
            <div className="p-2">
              <input
                className="input-hud text-[10px]"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              const count = cat.id === 'all' ? BUILT_IN_TEMPLATES.length :
                cat.id === 'featured' ? BUILT_IN_TEMPLATES.filter(t => t.featured).length :
                BUILT_IN_TEMPLATES.filter(t => t.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2 px-3 py-2.5 border-l-2 text-left transition-all"
                  style={{
                    borderLeftColor: activeCategory === cat.id ? cat.color : 'transparent',
                    background: activeCategory === cat.id ? `${cat.color}10` : 'transparent',
                  }}
                >
                  <Icon size={11} style={{ color: activeCategory === cat.id ? cat.color : '#94a3b8', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold font-hud truncate" style={{ color: activeCategory === cat.id ? cat.color : '#94a3b8' }}>
                      {cat.label}
                    </div>
                  </div>
                  <span className="text-[9px] text-white/30">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Center: template grid */}
          <div className="flex-1 p-3 panel-scroll overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="font-hud text-[10px] text-white/40">{filteredTemplates.length} TEMPLATES</div>
              <div className="flex gap-1">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'text-hud-cyan bg-hud-cyan/10' : 'text-white/30'}`}><Grid size={12} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'text-hud-cyan bg-hud-cyan/10' : 'text-white/30'}`}><List size={12} /></button>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}>
              {filteredTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className="text-left rounded-lg border p-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderColor: selected?.id === t.id ? t.color : `${t.color}25`,
                    background: selected?.id === t.id ? `${t.color}12` : 'rgba(10,18,32,0.8)',
                    boxShadow: selected?.id === t.id ? `0 0 15px ${t.color}20` : 'none',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="font-hud text-[10px] font-bold" style={{ color: t.color }}>{t.name}</div>
                    {t.featured && <Star size={9} className="flex-shrink-0" style={{ color: '#ffc107' }} />}
                  </div>
                  <div className="text-[9px] text-white/40 mb-2 leading-relaxed">{t.description}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {t.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: `${t.color}15`, color: t.color }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-[9px] text-white/25 flex items-center gap-0.5">
                      <Download size={9} />{t.downloads}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: detail / customizer */}
          {selected && (
            <div className="w-72 flex-shrink-0 border-l flex flex-col overflow-hidden" style={{ borderColor: 'rgba(0,229,255,0.1)' }}>
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                <div className="font-hud text-[10px] font-bold" style={{ color: selected.color }}>CUSTOMIZE</div>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white"><X size={12} /></button>
              </div>
              <div className="flex-1 panel-scroll overflow-y-auto p-3 space-y-2">
                <div className="text-[10px] text-white/50 font-hud mb-1">TEMPLATE VARIABLES</div>
                {selected.variables.map(v => (
                  <div key={v.key}>
                    <label className="text-[9px] text-white/40 block mb-0.5">{v.label}</label>
                    <input
                      className="input-hud text-[10px] py-1.5"
                      value={customVars[v.key] ?? v.default}
                      onChange={e => setCustomVars(prev => ({ ...prev, [v.key]: e.target.value }))}
                      placeholder={v.default}
                    />
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/5 space-y-2">
                <button
                  className={`w-full py-2 rounded font-hud text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${importSuccess ? 'border border-hud-green text-hud-green bg-hud-green/10' : ''}`}
                  style={!importSuccess ? { background: `${selected.color}20`, border: `1px solid ${selected.color}60`, color: selected.color } : {}}
                  onClick={handleImportTemplate}
                  disabled={importing}
                >
                  {importing ? <div className="w-3 h-3 border-2 rounded-full border-t-current animate-spin" style={{ borderColor: `${selected.color}40`, borderTopColor: selected.color }} /> :
                   importSuccess ? <><CheckCircle size={12} /> IMPORTED!</> :
                   <><Zap size={12} /> IMPORT & BUILD</>}
                </button>
                <button
                  onClick={() => {
                    const code = buildCode(selected)
                    navigator.clipboard.writeText(code)
                  }}
                  className="w-full py-1.5 rounded font-hud text-[10px] flex items-center justify-center gap-1.5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
                >
                  <Copy size={10} /> COPY CODE
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROMPTS TAB */}
      {activeTab === 'prompts' && (
        <div className="flex-1 panel-scroll overflow-y-auto p-3">
          <div className="mb-3">
            <div className="font-hud text-[11px] text-hud-cyan mb-1">50+ READY-MADE PROJECT PROMPTS</div>
            <div className="text-[10px] text-white/40">Copy any prompt → Paste in AI Secretary or ChatGPT/Claude → Get complete project code</div>
          </div>
          <div className="space-y-4">
            {PROMPTS_50.map(section => (
              <div key={section.category}>
                <div className="font-hud text-[10px] font-bold text-hud-gold mb-2 flex items-center gap-2">
                  <BookOpen size={11} /> {section.category}
                </div>
                <div className="space-y-1.5">
                  {section.items.map((prompt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 rounded border transition-all"
                      style={{ background: 'rgba(10,18,32,0.8)', borderColor: 'rgba(0,229,255,0.1)' }}
                    >
                      <div className="flex-1 text-[10px] text-white/70 leading-relaxed">{prompt}</div>
                      <button
                        onClick={() => copyPrompt(prompt)}
                        className="flex-shrink-0 p-1.5 rounded border border-white/10 text-white/30 hover:text-hud-cyan hover:border-hud-cyan/40 transition-all"
                      >
                        {promptCopied === prompt ? <CheckCircle size={11} className="text-hud-green" /> : <Copy size={11} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE TEMPLATE TAB */}
      {activeTab === 'create' && (
        <div className="flex-1 flex gap-0 overflow-hidden">
          <div className="flex-1 p-3 overflow-y-auto panel-scroll">
            <HudCard title="CREATE YOUR OWN TEMPLATE" accent="gold" compact>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-hud text-white/50 mb-1 block">TEMPLATE NAME</label>
                    <input className="input-hud" placeholder="My Awesome Template" value={newTemplate.name} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[10px] font-hud text-white/50 mb-1 block">CATEGORY</label>
                    <select className="input-hud" value={newTemplate.category} onChange={e => setNewTemplate(p => ({ ...p, category: e.target.value }))}>
                      <option value="html">HTML / CSS</option>
                      <option value="react">React App</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="react-native">React Native</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-hud text-white/50 mb-1 block">DESCRIPTION</label>
                  <input className="input-hud" placeholder="What does this template do?" value={newTemplate.description} onChange={e => setNewTemplate(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[10px] font-hud text-white/50 mb-1 block">TAGS (comma-separated)</label>
                  <input className="input-hud" placeholder="landing, saas, dark" value={newTemplate.tags} onChange={e => setNewTemplate(p => ({ ...p, tags: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[10px] font-hud text-white/50 mb-1 block">TEMPLATE CODE</label>
                  <div className="text-[9px] text-white/30 mb-1">Use {'{'}{'{'} VARIABLE {'}'}{'}'}  syntax for customizable fields</div>
                  <textarea
                    className="input-hud resize-none font-mono text-[10px]"
                    rows={12}
                    placeholder={'<!DOCTYPE html>\n<html>\n  <head><title>{{TITLE}}</title></head>\n  <body>\n    <h1>{{HEADING}}</h1>\n  </body>\n</html>'}
                    value={newTemplate.code}
                    onChange={e => setNewTemplate(p => ({ ...p, code: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2 rounded font-hud text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${savedCustom ? 'border border-hud-green text-hud-green bg-hud-green/10' : 'btn-gold'}`}
                    onClick={saveCustomTemplate}
                  >
                    {savedCustom ? <><CheckCircle size={12} /> SAVED TO GALLERY!</> : <><Plus size={12} /> SAVE TO MY GALLERY</>}
                  </button>
                  <button
                    className="px-4 py-2 rounded font-hud text-[10px] font-bold btn-primary flex items-center gap-2"
                    onClick={() => {
                      if (!newTemplate.code.trim() || !newTemplate.name.trim()) return
                      const project: Project = {
                        id: generateId(),
                        name: newTemplate.name,
                        type: 'html',
                        status: 'ready',
                        deployStatus: 'idle',
                        files: [{ name: 'index.html', path: '/', content: newTemplate.code, type: 'text/html', size: newTemplate.code.length }],
                        createdAt: formatDate(),
                      }
                      addProject(project)
                      navigate('process')
                    }}
                  >
                    <Zap size={12} /> USE NOW
                  </button>
                </div>
              </div>
            </HudCard>
          </div>
          {/* Tips panel */}
          <div className="w-56 flex-shrink-0 border-l p-3 space-y-3" style={{ borderColor: 'rgba(0,229,255,0.1)' }}>
            <HudCard title="TEMPLATE TIPS" accent="cyan" compact>
              <div className="space-y-2 text-[10px] text-white/60">
                <div className="p-2 rounded" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)' }}>
                  <div className="text-hud-cyan font-bold mb-1">Variables Syntax</div>
                  <div className="font-mono">{'{'}{'{'} VARIABLE {'}'}{'}'}</div>
                  <div className="text-white/40 mt-0.5">Will be replaced by user input</div>
                </div>
                <div className="p-2 rounded" style={{ background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.15)' }}>
                  <div className="text-hud-gold font-bold mb-1">Best Practices</div>
                  <div>• Use semantic HTML</div>
                  <div>• Include mobile viewport</div>
                  <div>• Add meaningful variables</div>
                  <div>• Test before saving</div>
                </div>
                <div className="p-2 rounded" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
                  <div className="text-hud-green font-bold mb-1">Sharing</div>
                  <div>Templates saved to gallery are available in your Import section for quick reuse.</div>
                </div>
              </div>
            </HudCard>
          </div>
        </div>
      )}
      {/* COMMUNITY SUBMISSIONS TAB */}
      {activeTab === 'community' && (
        <div className="flex-1 flex gap-0 overflow-hidden">
          <div className="flex-1 p-3 overflow-y-auto panel-scroll">
            <HudCard title="SUBMIT TO COMMUNITY GALLERY" subtitle="Share your template with all E-SMART-WORLD users" accent="purple" compact>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-hud text-slate-500 mb-1 block">TEMPLATE NAME *</label>
                    <input className="input-hud" placeholder="Amazing Dark Landing Page" value={communitySubmission.name} onChange={e => setCommunitySubmission(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[10px] font-hud text-slate-500 mb-1 block">CATEGORY *</label>
                    <select className="input-hud" value={communitySubmission.category} onChange={e => setCommunitySubmission(p => ({ ...p, category: e.target.value }))}>
                      <option value="html">HTML / CSS</option>
                      <option value="react">React App</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="react-native">React Native</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">YOUR NAME / HANDLE</label>
                  <input className="input-hud" placeholder="@yourname" value={communitySubmission.author} onChange={e => setCommunitySubmission(p => ({ ...p, author: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">DESCRIPTION</label>
                  <input className="input-hud" placeholder="What makes this template special?" value={communitySubmission.description} onChange={e => setCommunitySubmission(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[10px] font-hud text-slate-500 mb-1 block">TEMPLATE CODE *</label>
                  <textarea
                    className="input-hud resize-none font-mono text-[10px]"
                    rows={10}
                    placeholder="Paste your complete HTML/React template code here..."
                    value={communitySubmission.code}
                    onChange={e => setCommunitySubmission(p => ({ ...p, code: e.target.value }))}
                  />
                </div>
                <button
                  className={`w-full py-2.5 rounded-xl font-hud text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
                    submitSuccess ? 'border border-emerald-400 text-emerald-600 bg-emerald-50' : 'btn-bright-purple'
                  }`}
                  disabled={submitting || !communitySubmission.name || !communitySubmission.code}
                  onClick={async () => {
                    setSubmitting(true)
                    await new Promise(r => setTimeout(r, 1200))
                    setSubmitSuccess(true)
                    setSubmitting(false)
                    setTimeout(() => {
                      setSubmitSuccess(false)
                      setCommunitySubmission({ name: '', category: 'html', description: '', code: '', author: '' })
                    }, 3000)
                  }}
                >
                  {submitting ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> :
                   submitSuccess ? <><CheckCircle size={12} /> SUBMITTED FOR REVIEW!</> :
                   <><Plus size={12} /> SUBMIT TO COMMUNITY</>}
                </button>
                <div className="text-[9px] text-slate-400 text-center">Templates are reviewed before appearing in the public gallery</div>
              </div>
            </HudCard>
          </div>
          <div className="w-60 border-l p-3 space-y-3" style={{ borderColor: 'rgba(148,163,184,0.15)', background: 'rgba(255,255,255,0.9)' }}>
            <HudCard title="COMMUNITY GUIDELINES" accent="green" compact>
              <div className="space-y-2 text-[10px] text-slate-600">
                {[
                  { emoji: '✅', text: 'Original work only' },
                  { emoji: '✅', text: 'Clean, readable code' },
                  { emoji: '✅', text: 'Mobile-responsive design' },
                  { emoji: '✅', text: 'No malicious scripts' },
                  { emoji: '✅', text: 'Useful for others' },
                  { emoji: '❌', text: 'No copied templates' },
                  { emoji: '❌', text: 'No offensive content' },
                ].map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{g.emoji}</span>
                    <span>{g.text}</span>
                  </div>
                ))}
              </div>
            </HudCard>
            <HudCard title="REWARD SYSTEM" accent="gold" compact>
              <div className="space-y-1.5 text-[10px] text-slate-600">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div className="font-bold text-amber-700 mb-1">⭐ Featured Status</div>
                  <div>Top-rated templates get Featured badge and appear first</div>
                </div>
                <div className="p-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div className="font-bold text-emerald-700 mb-1">📊 Download Stats</div>
                  <div>Track how many users use your template</div>
                </div>
              </div>
            </HudCard>
          </div>
        </div>
      )}
    </div>
  )
}
