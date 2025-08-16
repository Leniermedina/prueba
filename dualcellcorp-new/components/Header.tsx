'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@lib/i18n';

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const path = usePathname();
  const router = useRouter();

  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.replace('/login'); };

  const nav = [
    { href: '/home', label: t('nav.home') },
    { href: '/productos', label: t('nav.products') },
    { href: '/carrito', label: t('nav.cart') },
    { href: '/acerca-de', label: t('nav.about') },
    { href: '/admin', label: t('nav.admin') }
  ];

  return (
    <header className="header">
      <div className="brand">
        <Link href="/home" className="brand-link">
          <img src="/logo.svg" alt="logo" width={28} height={28} />
          <span>Dual Cell Corp</span>
        </Link>
      </div>
      <nav className="nav">
        {nav.map((n) => (<Link key={n.href} href={n.href} className={path?.startsWith(n.href) ? 'active' : ''}>{n.label}</Link>))}
      </nav>
      <div className="actions">
        <select aria-label="Language" value={locale} onChange={(e) => setLocale(e.target.value as any)} className="select">
          <option value="es">ES</option><option value="en">EN</option>
        </select>
        <button className="btn btn-secondary small" onClick={logout}>{t('auth.logout')}</button>
      </div>
    </header>
  );
}