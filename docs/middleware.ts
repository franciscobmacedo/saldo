export { middleware } from 'nextra/locales'

export const config = {
  // Matcher ignoring assets and Next internals.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind).*)'
  ]
}

