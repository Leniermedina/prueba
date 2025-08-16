import CartClient from '@components/CartClient';
import { useI18nServer } from '@lib/i18n';
export const dynamic = 'force-dynamic';
export default async function CartPage() {
  const { t } = await useI18nServer();
  return (<section><h1 className="page-title">{t('cart.title')}</h1><CartClient /></section>);
}