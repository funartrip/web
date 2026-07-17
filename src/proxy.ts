// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['zh_tw', 'zh_cn', 'en', 'fr']
const defaultLocale = 'zh_tw'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🌟 核心終極修正：如果使用者在網址列輸入的是純粹、乾淨的 /links 超短網址
  if (pathname === '/links') {
    // 施展隱形分身術 (Rewrite)！
    // 幕後悄悄指向帶有預設語系的路徑，這樣就能完美繼承 [lang] 底下的所有 Tailwind 樣式與動畫！
    // 同時，客人的瀏覽器網址列會死死定格在最漂亮的 https://funartrip.com/links
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}/links`
    return NextResponse.rewrite(url)
  }

  // 常規免警察攔截通道
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // 🌟 這裡也要把後方的 |links 拿掉，讓 /links 請求能順利進來上方的主邏輯進行 Rewrite 處理
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|bg-link.jpeg|profile.png).*)'],
}