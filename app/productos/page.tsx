import { cookies } from 'next/headers';
import { useI18nServer } from '@lib/i18n';
import ProductsGrid from '@components/ProductsGrid';

export const dynamic = 'force-dynamic';

export default async function ProductosPage({ searchParams }: { searchParams: { category?: string } }) {
  const { t } = await useI18nServer();
  const category = (searchParams.category as 'moviles'|'covers'|'accesorios'|undefined) || undefined;
  cookies();
  return (<section><h1 className="page-title">{t('products.title')}</h1>
    <div className="tabs-row">
      <a className={!category ? 'active' : ''} href="/productos">{t('products.all')}</a>
      <a className={category==='moviles'?'active':''} href="/productos?category=moviles">{t('products.mobiles')}</a>
      <a className={category==='covers'?'active':''} href="/productos?category=covers">{t('products.covers')}</a>
      <a className={category==='accesorios'?'active':''} href="/productos?category=accesorios">{t('products.accessories')}</a>
    </div>
    <ProductsGrid category={category} />
  </section>);
}