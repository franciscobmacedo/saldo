import { NextResponse, NextRequest } from 'next/server'

const locales = ['pt', 'en']
const defaultLocale = 'pt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // Check if pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    // We could redirect here too, but let's see if the root redirect is enough for the user's issue
  }
}

export const config = {
  // Matcher ignoring assets and Next internals.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon/|logo|icon\\.svg|apple-icon\\.png|_pagefind|.*\\.(?:webp|png|jpg|jpeg|svg|ico|webmanifest)$).*)'
  ]
}
