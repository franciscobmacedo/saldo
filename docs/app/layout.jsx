/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Link from 'next/link'


import './globals.css'

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
  }
}

export default async function RootLayout({ children }) {
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
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
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
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
