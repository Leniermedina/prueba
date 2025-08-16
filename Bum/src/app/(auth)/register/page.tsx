'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
export default function RegisterPage(){
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    setLoading(false); if (!res.ok) return toast.error('No se pudo registrar');
    toast.success('Registro completado'); router.replace('/');
  };
  return (<div className="min-h-[80vh] flex items-center justify-center p-6">
    <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
      <h1 className="text-3xl font-bold text-brand text-center">Crear cuenta</h1>
      <input className="input" type="email" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required />
      <button disabled={loading} className="btn btn-primary w-full" type="submit">{loading ? 'Creando...' : 'Registrarme'}</button>
      <p className="text-center text-sm text-zinc-400">¿Ya tienes cuenta? <a className="link" href="/login">Inicia sesión</a></p>
    </form>
  </div>);
}
