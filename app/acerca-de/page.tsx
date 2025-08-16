import { useI18nServer } from '@lib/i18n';
export default async function AboutPage() {
  const { t } = await useI18nServer();
  return (<section className="prose"><h1 className="page-title">{t('about.title')}</h1><p>{t('about.text1')}</p><p>{t('about.text2')}</p><p>{t('about.text3')}</p></section>);
}