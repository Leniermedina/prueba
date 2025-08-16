'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
export default function LoginPage(){
  const router = useRouter(); const params = useSearchParams();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    setLoading(false); if (!res.ok) return toast.error('Correo o contraseña incorrectos');
    toast.success('Inicio de sesión completado'); const redirect = params.get('redirect') || '/'; router.replace(redirect);
  };
  return (<div className="min-h-[80vh] flex items-center justify-center p-6">
    <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
      <h1 className="text-3xl font-bold text-brand text-center">Inicia sesión</h1>
      <input className="input" type="email" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required />
      <button disabled={loading} className="btn btn-primary w-full" type="submit">{loading ? 'Entrando...' : 'Entrar'}</button>
      <p className="text-center text-sm text-zinc-400">¿No tienes cuenta? <a className="link" href="/register">Regístrate</a></p>
    </form>
  </div>);
}
