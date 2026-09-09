import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, Sparkles, Zap, RefreshCw, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/context/AppContext'
import type { AuthUser } from '@/context/AppContext'

type AuthFlow = 'login' | 'signup'
type SignupStep = 'email' | 'otp' | 'password'

function mapUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    username: user.user_metadata?.username || user.user_metadata?.full_name || user.email!.split('@')[0],
    avatar: user.user_metadata?.avatar_url,
  }
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5.3) % 100}%`,
  top: `${(i * 7.1) % 100}%`,
  size: 4 + (i % 5) * 3,
  color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][i % 5],
  duration: 4 + (i % 4),
  delay: i * 0.3,
}))

export function AuthPage() {
  const { login } = useApp()
  const [flow, setFlow] = useState<AuthFlow>('login')
  const [step, setStep] = useState<SignupStep>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(p => p - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [otpTimer])

  const clearMessages = () => { setError(''); setInfo('') }

  // LOGIN
  const handleLogin = async () => {
    clearMessages()
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password'); return }
    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) login(mapUser(data.user))
    // Don't setLoading(false) on success
  }

  // SIGNUP: Send OTP
  const handleSendOTP = async () => {
    clearMessages()
    if (!email.trim()) { setError('Please enter your email address'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError('Please enter a valid email address'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    })
    if (err) { setError(err.message); setLoading(false); return }
    setInfo('✅ OTP sent! Check your email inbox (and spam folder).')
    setStep('otp')
    setOtpTimer(60)
    setLoading(false)
  }

  // SIGNUP: Verify OTP
  const handleVerifyOTP = async () => {
    clearMessages()
    if (otp.trim().length < 4) { setError('Please enter the complete 4-digit OTP'); return }
    setLoading(true)
    const { data, error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      setStep('password')
      setInfo('✅ Email verified! Now set your password.')
    }
    setLoading(false)
  }

  // SIGNUP: Set password
  const handleSetPassword = async () => {
    clearMessages()
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPass) { setError('Passwords do not match'); return }
    setLoading(true)
    const { data, error: err } = await supabase.auth.updateUser({
      password,
      data: { username: email.split('@')[0] },
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) login(mapUser(data.user))
    // Don't setLoading(false) on success
  }

  const switchFlow = (newFlow: AuthFlow) => {
    setFlow(newFlow); setStep('email'); clearMessages()
    setOtp(''); setPassword(''); setConfirmPass('')
  }

  const OTPInput = (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3].map(i => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center text-xl font-bold rounded-2xl outline-none border-2 transition-all"
          style={{ borderColor: otp[i] ? '#3b82f6' : 'rgba(203,213,225,0.6)', background: otp[i] ? 'rgba(59,130,246,0.06)' : 'rgba(248,250,252,0.9)', color: '#1e293b' }}
          value={otp[i] || ''}
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '')
            const newOtp = otp.split('')
            newOtp[i] = val
            setOtp(newOtp.join('').slice(0, 4))
            if (val && i < 3) {
              const next = document.getElementById(`otp-${i + 1}`)
              next?.focus()
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !otp[i] && i > 0) {
              const prev = document.getElementById(`otp-${i - 1}`)
              prev?.focus()
            }
          }}
          id={`otp-${i}`}
        />
      ))}
    </div>
  )

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 30%, #fdf4ff 60%, #fffbeb 100%)' }}
    >
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-25"
            style={{
              left: p.left, top: p.top,
              width: p.size, height: p.size,
              background: p.color,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              filter: 'blur(1px)',
            }}
          />
        ))}
        {/* Large orbs */}
        {[
          { color: '#3b82f6', x: '10%', y: '20%', size: 200 },
          { color: '#8b5cf6', x: '80%', y: '60%', size: 150 },
          { color: '#10b981', x: '60%', y: '10%', size: 120 },
          { color: '#f59e0b', x: '20%', y: '80%', size: 100 },
        ].map((orb, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              left: orb.x, top: orb.y,
              width: orb.size, height: orb.size,
              background: `radial-gradient(circle, ${orb.color}30, transparent)`,
              animation: `float ${8 + i * 2}s ease-in-out ${i}s infinite`,
              filter: 'blur(20px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Auth Card */}
      <div
        className="w-full max-w-sm relative z-10 rounded-3xl overflow-hidden animate-fade-in"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 24px 80px rgba(59,130,246,0.15), 0 4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 animate-float"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 8px 24px rgba(59,130,246,0.4)' }}
          >
            🥭
          </div>
          <div className="font-hud text-base font-black" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            E-SMART-WORLD
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">E.S wOrLd — Project Builder & Deployer</div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b mx-4" style={{ borderColor: 'rgba(203,213,225,0.3)' }}>
          {(['login', 'signup'] as AuthFlow[]).map(f => (
            <button
              key={f}
              onClick={() => switchFlow(f)}
              className="flex-1 py-2.5 font-hud text-[10px] font-bold border-b-2 transition-all uppercase"
              style={{
                borderBottomColor: flow === f ? '#3b82f6' : 'transparent',
                color: flow === f ? '#2563eb' : '#94a3b8',
                background: flow === f ? 'rgba(59,130,246,0.04)' : 'transparent',
              }}
            >
              {f === 'login' ? '🔐 Sign In' : '✨ Create Account'}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {/* Error/Info */}
          {error && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl text-[10px] text-red-600 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Shield size={12} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}
          {info && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl text-[10px] text-emerald-600 animate-fade-in"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle size={12} className="flex-shrink-0 mt-0.5" /> {info}
            </div>
          )}

          {/* LOGIN FORM */}
          {flow === 'login' && (
            <>
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1.5 block">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email"
                    className="input-hud pl-9"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-hud text-slate-500 mb-1.5 block">PASSWORD</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input-hud pl-9 pr-10"
                    placeholder="Your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-all" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button
                className="w-full py-3 rounded-2xl font-hud text-sm font-black text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 6px 20px rgba(59,130,246,0.4)' }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><Zap size={15} /> SIGN IN</>
                }
              </button>
              <button
                className="w-full text-[10px] text-slate-400 hover:text-blue-600 transition-all py-1"
                onClick={() => switchFlow('signup')}
              >
                Don't have an account? Create one →
              </button>
            </>
          )}

          {/* SIGNUP FORM */}
          {flow === 'signup' && (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                {(['email', 'otp', 'password'] as SignupStep[]).map((s, i) => (
                  <React.Fragment key={s}>
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full font-hud text-[9px] font-bold transition-all"
                      style={{
                        background: step === s ? '#3b82f6' : (
                          ['email', 'otp', 'password'].indexOf(step) > i ? 'rgba(16,185,129,0.1)' : 'rgba(203,213,225,0.3)'
                        ),
                        color: step === s ? '#fff' : (
                          ['email', 'otp', 'password'].indexOf(step) > i ? '#059669' : '#94a3b8'
                        ),
                      }}
                    >
                      {['email', 'otp', 'password'].indexOf(step) > i ? '✓' : i + 1}
                    </div>
                    {i < 2 && <div className="flex-1 h-0.5 rounded-full" style={{ background: ['email', 'otp', 'password'].indexOf(step) > i ? 'rgba(16,185,129,0.4)' : 'rgba(203,213,225,0.3)' }} />}
                  </React.Fragment>
                ))}
              </div>
              <div className="font-hud text-[10px] text-slate-500 text-center">
                {step === 'email' && 'Step 1: Enter your email'}
                {step === 'otp' && 'Step 2: Verify OTP from email'}
                {step === 'password' && 'Step 3: Set your password'}
              </div>

              {/* Step: Email */}
              {step === 'email' && (
                <>
                  <div>
                    <label className="text-[10px] font-hud text-slate-500 mb-1.5 block">EMAIL ADDRESS</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="email"
                        className="input-hud pl-9"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    className="w-full py-3 rounded-2xl font-hud text-sm font-black text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 6px 20px rgba(139,92,246,0.4)' }}
                    onClick={handleSendOTP}
                    disabled={loading}
                  >
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><Sparkles size={15} /> SEND OTP CODE</>
                    }
                  </button>
                  <button className="w-full text-[10px] text-slate-400 hover:text-blue-600 transition-all py-1" onClick={() => switchFlow('login')}>
                    Already have an account? Sign in →
                  </button>
                </>
              )}

              {/* Step: OTP */}
              {step === 'otp' && (
                <>
                  <div className="text-center">
                    <div className="text-[11px] text-slate-500 mb-3">Enter the 4-digit code sent to</div>
                    <div className="font-bold text-[11px] text-blue-600 mb-4">{email}</div>
                    {OTPInput}
                  </div>
                  <button
                    className="w-full py-3 rounded-2xl font-hud text-sm font-black text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 6px 20px rgba(59,130,246,0.4)' }}
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length < 4}
                  >
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><CheckCircle size={15} /> VERIFY OTP</>
                    }
                  </button>
                  <button
                    className="w-full text-[10px] text-slate-400 hover:text-purple-600 transition-all py-1 flex items-center justify-center gap-1 disabled:opacity-40"
                    onClick={() => { setOtp(''); handleSendOTP() }}
                    disabled={otpTimer > 0 || loading}
                  >
                    <RefreshCw size={10} />
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
                  </button>
                  <button className="w-full text-[10px] text-slate-400 hover:text-slate-600 transition-all py-1" onClick={() => setStep('email')}>
                    ← Change email
                  </button>
                </>
              )}

              {/* Step: Password */}
              {step === 'password' && (
                <>
                  <div>
                    <label className="text-[10px] font-hud text-slate-500 mb-1.5 block">NEW PASSWORD (min 6 chars)</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input-hud pl-9 pr-10"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoFocus
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-all" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-1 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: password.length > i * 2 + 1 ? (password.length >= 8 ? '#10b981' : '#f59e0b') : 'rgba(203,213,225,0.4)' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-hud text-slate-500 mb-1.5 block">CONFIRM PASSWORD</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input-hud pl-9 pr-10"
                        placeholder="Repeat your password"
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSetPassword()}
                      />
                      {confirmPass && password === confirmPass && (
                        <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                      )}
                    </div>
                  </div>
                  <button
                    className="w-full py-3 rounded-2xl font-hud text-sm font-black text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 6px 20px rgba(16,185,129,0.4)' }}
                    onClick={handleSetPassword}
                    disabled={loading || !password || password !== confirmPass}
                  >
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><Zap size={15} /> CREATE ACCOUNT</>
                    }
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-center">
          <div className="text-[9px] text-slate-300">
            By signing in you agree to our{' '}
            <span className="text-blue-400">Terms of Service</span>
            {' & '}
            <span className="text-blue-400">Privacy Policy</span>
          </div>
          <div className="text-[8px] text-slate-300 mt-1">
            © {new Date().getFullYear()} E-SMART-WORLD — E.S wOrLd Platform
          </div>
        </div>
      </div>
    </div>
  )
}
