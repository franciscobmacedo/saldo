/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Link from 'next/link'

import './globals.css'

const locales = [
  { locale: 'pt', name: 'Português' },
  { locale: 'en', name: 'English' }
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
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
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

export default async function RootLayout({ children, params: paramsPromise }) {
  const params = await paramsPromise
  const lang = params?.lang || defaultLocale
  const navbar = (
    <Navbar
      logo={
        <div>
          <b>Saldo</b>{' '}
          <span style={{ opacity: '60%' }}>Portuguese Salary Calculator</span>
        </div>
      }
      // GitHub repository for issues and discussions
      // chatLink="https://discord.gg/hEM84NMkRv"
    />
  )
  const pageMap = await getPageMap(`/${lang}`)
  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          banner={<Banner storageKey="saldo-docs">Saldo is currently in alpha - report any bugs <Link target="_blank" className="underline" href="https://github.com/franciscobmacedo/saldo/issues">here </Link></Banner>}
          navbar={navbar}
          footer={<Footer>MIT {new Date().getFullYear()} © Saldo.</Footer>}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/franciscomacedo/saldo-ts/blob/main/docs"
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
