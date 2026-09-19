import React, { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, ArrowUpRight, Lock, ShieldCheck, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetCurrentUserQueryKey } from '@workspace/api-client-react';

export function AuthPage() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to sign in.');
      await queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
      setLocation(body.redirectTo || '/md');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setIdentifier('admin');
    setPassword('changeme123!');
  };

  return (
    <div className="min-h-screen bg-[#0e2a1d] text-white flex flex-col justify-between selection:bg-[#df3b28] selection:text-white font-sans antialiased">
      {/* Top Header */}
      <header className="border-b border-white/10 px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#df3b28] text-white font-black text-lg transition-transform group-hover:scale-105">
              Z
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                ZM Printing & Design Ltd.
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-emerald-400/80 font-mono">
                FactoryOS Access
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to website
          </Link>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-16 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-[460px] relative z-10">
          {/* Card */}
          <div className="rounded-sm border border-white/15 bg-[#143a29] p-8 md:p-10 shadow-2xl">
            {/* Eyebrow */}
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                <span className="text-[#df3b28]">01 /</span> FACTORYOS ACCESS
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-mono uppercase text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Node
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tighter text-white leading-tight">
              Enter the
              <br />
              factory floor.
            </h1>

            <p className="mt-2 text-sm text-emerald-100/70 leading-relaxed">
              Sign in with your individual work account to access jobs, production sections, client orders, and billing.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-sm border border-red-500/40 bg-red-950/60 p-3.5 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1.5">
                  USERNAME OR EMAIL
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="e.g. admin or employee"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-sm border border-white/20 bg-[#0e2a1d] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#df3b28] focus:ring-1 focus:ring-[#df3b28]"
                  data-testid="input-auth-identifier"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1.5">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-sm border border-white/20 bg-[#0e2a1d] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#df3b28] focus:ring-1 focus:ring-[#df3b28]"
                  data-testid="input-auth-password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="button-auth-submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-[#df3b28] hover:bg-[#c93220] py-3.5 px-5 text-sm font-black uppercase tracking-wider text-white transition-all shadow-[2px_2px_0_rgba(0,0,0,0.3)] disabled:opacity-50"
                >
                  {loading ? 'Checking access…' : 'Sign In to FactoryOS'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Dev Demo Fill Helper */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] text-emerald-400/70">
                Default: <strong>admin</strong>
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:text-white underline decoration-emerald-500/50"
              >
                Auto-fill credentials
              </button>
            </div>

            {/* Note */}
            <p className="mt-4 text-center font-mono text-[10px] text-emerald-400/60">
              No public registration. Contact the Master MD for account provisioning.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-white/10 px-6 py-4 md:px-10 text-center text-xs font-mono text-emerald-400/60">
        © 2026 ZM Printing & Design Ltd. All rights reserved
      </footer>
    </div>
  );
}

export function ChangePasswordPage() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to update password.');
      await queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
      setLocation(body.redirectTo || '/md');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e2a1d] text-white flex flex-col justify-between selection:bg-[#df3b28] selection:text-white font-sans antialiased">
      <header className="border-b border-white/10 px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#df3b28] text-white font-black text-lg">
              Z
            </div>
            <span className="block text-sm font-black tracking-tight text-white">
              ZM Printing & Design Ltd.
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px]">
          <div className="rounded-sm border border-white/15 bg-[#143a29] p-8 md:p-10 shadow-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
              <span className="text-[#df3b28]">02 /</span> SECURITY VERIFICATION
            </p>
            <h1 className="mt-3 text-3xl font-black text-white">
              Set your password.
            </h1>
            <p className="mt-2 text-sm text-emerald-100/70">
              Your temporary password must be replaced before entering the factory workspace.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-sm border border-red-500/40 bg-red-950/60 p-3.5 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1.5">
                  TEMPORARY PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-sm border border-white/20 bg-[#0e2a1d] px-4 py-3 text-sm text-white outline-none focus:border-[#df3b28]"
                  data-testid="input-current-password"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1.5">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-sm border border-white/20 bg-[#0e2a1d] px-4 py-3 text-sm text-white outline-none focus:border-[#df3b28]"
                  data-testid="input-new-password"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1.5">
                  CONFIRM NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-sm border border-white/20 bg-[#0e2a1d] px-4 py-3 text-sm text-white outline-none focus:border-[#df3b28]"
                  data-testid="input-confirm-password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  data-testid="button-change-password"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-[#df3b28] hover:bg-[#c93220] py-3.5 px-5 text-sm font-black uppercase tracking-wider text-white transition-all shadow-[2px_2px_0_rgba(0,0,0,0.3)] disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save new password'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-4 text-center text-xs font-mono text-emerald-400/60">
        © 2026 ZM Printing & Design Ltd. All rights reserved
      </footer>
    </div>
  );
}
