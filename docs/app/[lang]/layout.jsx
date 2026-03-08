/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Link from 'next/link'
import Image from 'next/image'

import logo from '../../public/logo.png'
import { isPortuguese } from '@/lib/i18n'

import '../globals.css'

const locales = [
  { locale: 'pt', name: '🇵🇹 Português' },
  { locale: 'en', name: '🇬🇧 English' }
]
const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE || 'pt'

export const metadata = {
  metadataBase: new URL('https://saldo-docs.vercel.app'),
  title: {
    template: '%s - Saldo'
  },
  description: 'Saldo: Portuguese salary calculator library',
  applicationName: 'Saldo',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Saldo'
  },
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: 'https://saldo-docs.vercel.app'
  },
  alternates: {
    languages: {
      pt: '/pt',
      en: '/en'
    }
  }
}

export async function generateStaticParams() {
  return locales.map(locale => ({ lang: locale.locale }))
}

export default async function RootLayout({ children, params: paramsPromise }) {
  const params = await paramsPromise
  const lang = params?.lang || defaultLocale
  const pt = isPortuguese(lang)

  const copy = pt
    ? {
      subtitle: 'Calculadora salarial portuguesa',
      alphaBanner: 'O Saldo esta em fase alpha - reporte bugs',
      here: 'aqui',
      editLink: 'Editar esta pagina no GitHub',
    }
    : {
      subtitle: 'Portuguese salary calculator',
      alphaBanner: 'Saldo is currently in alpha - report bugs',
      here: 'here',
      editLink: 'Edit this page on GitHub',
    }

  if (!locales.some(l => l.locale === lang)) {
    return children
  }

  const navbar = (
    <Navbar
      logo={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image src={logo} width={24} height={24} alt="Saldo logo" />
          <b>Saldo</b>{' '}
          <span style={{ opacity: '60%' }}>{copy.subtitle}</span>
        </div>
      }
    // GitHub repository for issues and discussions
    // chatLink="https://discord.gg/hEM84NMkRv"
    />
  );
  const pageMap = await getPageMap(`/${lang}`);
  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={<Banner storageKey="saldo-docs">{copy.alphaBanner} <Link target="_blank" className="underline" href="https://github.com/franciscobmacedo/saldo/issues">{copy.here}</Link></Banner>}
          navbar={navbar}
          footer={<Footer>MIT {new Date().getFullYear()} © Saldo.</Footer>}
          editLink={copy.editLink}
          docsRepositoryBase="https://github.com/franciscobmacedo/saldo/blob/main/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
          i18n={locales}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
