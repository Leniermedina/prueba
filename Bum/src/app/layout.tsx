import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
export const metadata = {
  title: 'Dual Cell - Tienda de Móviles',
  description: 'Ofertas en smartphones, accesorios y covers.',
  metadataBase: new URL('https://prueba-wine-seven.vercel.app'),
  openGraph: { title: 'Dual Cell - Tienda de Móviles', description: 'Ofertas en smartphones, accesorios y covers.', images: ['/og-image.png'] },
  icons: { icon: '/icon-192.png' }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-zinc-800">
          <nav className="container mx-auto flex items-center justify-between p-4">
            <Link href="/" className="font-bold text-xl">Dual Cell</Link>
            <div className="flex gap-4">
              <Link href="/" className="link">Home</Link>
              <Link href="/products" className="link">Productos</Link>
              <Link href="/about" className="link">Acerca de</Link>
              <Link href="/cart" className="link">Carrito</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-zinc-800">
          <div className="container mx-auto p-6 text-sm text-zinc-400 flex flex-col md:flex-row gap-2 md:gap-6 justify-between">
            <p>© {new Date().getFullYear()} Dual Cell. Todos los derechos reservados.</p>
            <p>Contacto: <a href="mailto:ventas@example.com" className="link">ventas@example.com</a> • Ubicación: CDMX</p>
          </div>
        </footer>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
