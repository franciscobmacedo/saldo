export { middleware } from 'nextra/locales'

export const config = {
  // Matcher ignoring assets and Next internals.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon/|logo|icon\\.svg|apple-icon\\.png|_pagefind|.*\\.(?:webp|png|jpg|jpeg|svg|ico|webmanifest)$).*)'
  ]
}

