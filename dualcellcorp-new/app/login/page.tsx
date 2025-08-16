'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@lib/i18n';
import Button from '@components/Button';
import Input from '@components/Input';
import { toast } from '@components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get('redirect') || '/home';
  const { t } = useI18n();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const endpoint = tab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, redirect }) });
      const data = await res.json();
      if (!res.ok) toast(t('auth.error.' + (data.code || 'invalid_credentials')));
      else { toast(t(tab === 'register' ? 'auth.register.success' : 'auth.login.success')); router.replace('/home'); }
    } catch { toast(t('auth.error.invalid_credentials')); } finally { setLoading(false); }
  };

  return (<section className="auth"><div className="auth-card"><div className="tabs" role="tablist">
    <button role="tab" aria-selected={tab === 'login'} className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>{t('auth.login.title')}</button>
    <button role="tab" aria-selected={tab === 'register'} className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>{t('auth.register.title')}</button>
  </div>
  <form onSubmit={submit} className="form">
    {tab === 'register' && (<Input label={t('auth.name')} name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />)}
    <Input label={t('auth.email')} type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
    <Input label={t('auth.password')} type="password" name="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required hint={t('auth.password_hint')} />
    <Button type="submit" disabled={loading}>{loading ? t('common.loading') : t(tab === 'register' ? 'auth.register.cta' : 'auth.login.cta')}</Button>
  </form></div></section>);
}