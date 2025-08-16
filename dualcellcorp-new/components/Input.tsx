import { InputHTMLAttributes } from 'react';
export default function Input({ label, hint, ...props }: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (<label className="label"><span>{label}</span><input {...props} className="input" />{hint && <small className="hint">{hint}</small>}</label>);
}