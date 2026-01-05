import { redirect } from 'next/navigation'

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE || 'pt'

export default function RootRedirect() {
  redirect(`/${defaultLocale}`)
}
