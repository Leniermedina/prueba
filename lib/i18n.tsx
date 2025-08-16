'use client';
import es from '@locales/es.json'; import en from '@locales/en.json';
import { createContext, useContext, useMemo, useState, startTransition } from 'react';
type Dict = typeof es; type Ctx = { locale: 'es'|'en'; dict: Dict; t: (k:string)=>string; setLocale: (l:'es'|'en')=>void };
const I18nContext = createContext<Ctx>({} as any);
export async function getDictionary(locale: string): Promise<Dict> { return locale === 'en' ? (en as any) : (es as any); }
export function LocaleProvider({ value, children }: { value: { locale: string; dict: Dict }; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<'es'|'en'>((value.locale as any) || 'es');
  const dict = (locale === 'en' ? en : es) as Dict;
  const setLocale = (l: 'es'|'en') => { startTransition(() => { setLocaleState(l); document.cookie = `locale=${l}; Path=/; Max-Age=${60*60*24*365}`; window.location.reload(); }); };
  const t = (k: string) => (dict as any)[k] ?? k;
  const ctx: Ctx = useMemo(() => ({ locale, dict, t, setLocale }), [locale, dict]);
  return <I18nContext.Provider value={ctx}>{children}</I18nContext.Provider>;
}
export function useI18n(){ return useContext(I18nContext); }
export async function useI18nServer(){ const locale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as 'es'|'en') || 'es'; const dict = await getDictionary(locale); const t=(k:string)=>(dict as any)[k]??k; return { locale, dict, t }; }