import { useI18nServer } from '@lib/i18n';
export default async function Footer() {
  const { t } = await useI18nServer();
  return (<footer className="footer"><div className="grid"><div><strong>{process.env.NEXT_PUBLIC_SITE_NAME || 'Dual Cell Corp'}</strong><p>{t('footer.tagline')}</p></div><div><p>📍 {t('contact.address')}</p><p>✉️ {t('contact.email')}</p><p>🕘 {t('contact.hours')}</p></div></div><p className="copy">© 2017 - {new Date().getFullYear()} Dual Cell Corp</p></footer>);
}