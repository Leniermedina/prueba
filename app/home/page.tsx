import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useI18nServer } from '@lib/i18n';
import ProductsGrid from '@components/ProductsGrid';

export const metadata: Metadata = { title: 'Home | ' + (process.env.NEXT_PUBLIC_SITE_NAME || 'Dual Cell Corp') };

export default async function HomePage() {
  const { t } = await useI18nServer();
  const heroButtons = [
    { title: t('home.hero.mobiles'), href: '/productos?category=moviles', img: '/img/hero/1.jpg' },
    { title: t('home.hero.covers'), href: '/productos?category=covers', img: '/img/hero/2.jpg' },
    { title: t('home.hero.accessories'), href: '/productos?category=accesorios', img: '/img/hero/3.jpg' },
    { title: t('home.hero.new'), href: '/productos', img: '/img/hero/4.jpg' },
    { title: t('home.hero.offers'), href: '/productos', img: '/img/hero/5.jpg' }
  ];
  return (<>
    <section className="hero">
      <div className="hero-left">
        <h1 className="title">{t('home.title')}</h1>
        <p className="subtitle">{t('home.subtitle')}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/productos">{t('home.cta_shop')}</Link>
          <Link className="btn btn-secondary" href="/acerca-de">{t('home.cta_about')}</Link>
        </div>
      </div>
      <div className="hero-grid">
        {heroButtons.map((b, i) => (<Link href={b.href} key={i} className="hero-card"><Image src={b.img} alt={b.title} width={360} height={220} /><span className="badge">{b.title}</span></Link>))}
      </div>
    </section>
    <section className="featured"><h2>{t('home.featured')}</h2><ProductsGrid take={6} /></section>
    <section className="reviews"><h2>{t('home.reviews_title')}</h2><div className="grid">{[1,2,3].map((i)=>(<article key={i} className="card"><p>★ ★ ★ ★ ★</p><p>{t(`home.reviews.${i}` as any)}</p></article>))}</div></section>
    <section className="contact"><h2>{t('home.contact_title')}</h2><ul><li>📍 {t('contact.address')}</li><li>✉️ {t('contact.email')}</li><li>🕘 {t('contact.hours')}</li></ul></section>
  </>);
}