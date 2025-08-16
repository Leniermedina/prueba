import '../styles/globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getDictionary, LocaleProvider } from '@lib/i18n';
import Header from '@components/Header';
import Footer from '@components/Footer';
import WhatsAppButton from '@components/WhatsAppButton';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Dual Cell Corp',
  description: 'Venta de móviles, covers y accesorios.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const locale = cookieStore.get('locale')?.value || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es';
  const dict = await getDictionary(locale);
  return (<html lang={locale}><body><LocaleProvider value={{ locale, dict }}><Header /><main className="container">{children}</main><Footer /><WhatsAppButton /><div id="toaster" aria-live="polite" aria-atomic="true" className="toaster" /></LocaleProvider></body></html>);
}
