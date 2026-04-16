// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 設定你支援的語言代碼 (與你 Sanity 的設定完全對齊)
const locales = ['zh_tw', 'zh_cn', 'en', 'fr']
const defaultLocale = 'zh_tw'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. 排除不需要多語系干擾的系統路徑與後台
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.') // 排除圖片、favicon 等靜態檔案
  ) {
    return NextResponse.next()
  }

  // 2. 檢查目前網址是否已經包含了語言代碼 (例如 /fr/tours)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next() // 如果已經有語言了，就放行
  }

  // 3. 如果網址沒有語言代碼，強制導向預設語言 (例如導向 /zh_tw/...)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // 讓 middleware 攔截所有請求，但明確排除 api, studio, _next 等
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio).*)'],
}
