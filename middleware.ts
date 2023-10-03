import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'


import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user && req.nextUrl.pathname === '/auth/login') {
        return NextResponse.redirect(new URL('/account', req.url))
    }
    if (user && req.nextUrl.pathname === '/auth/signup') {
        return NextResponse.redirect(new URL('/account', req.url))
    }

    if (!user && req.nextUrl.pathname === '/account') {
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    if (!user && req.nextUrl.pathname === '/chat') {
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    if (!user && req.nextUrl.pathname === '/newadvert') {
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return res
}

export const config = {
    matcher: ['/auth/login', '/auth/signup', '/account', '/chat', '/newadvert'],
}