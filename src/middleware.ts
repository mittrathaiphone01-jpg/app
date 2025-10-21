
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const roleId = token?.role_id as number | null;

    // const token = "11111"
    // const roleId = 1 as number | null
    
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth/sign-in')
    const isProtectedPageAdmin = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/admins')
    const isProtectedPageMember = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/member')
    const isCheckUserPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/check-user')
    const { pathname } = request.nextUrl;


    // ไม่มี token
    if (!token && (isProtectedPageAdmin || isProtectedPageMember )) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    // บล็อค member ไม่ให้เข้า admin
    if (token && roleId == 2 && (isProtectedPageAdmin || isCheckUserPage) ) return NextResponse.redirect(new URL("/member", request.url));
    if(token && roleId === 1 && isCheckUserPage )return NextResponse.redirect(new URL("/admins", request.url));

    // มี token แล้วเข้าหน้า / หรือ /auth/signin → redirect ตาม role
    if (token && (pathname === "/" || isAuthPage)) {
        if (roleId == 1) return NextResponse.redirect(new URL("/admins", request.url));
        if (roleId == 2) return NextResponse.redirect(new URL("/member", request.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/admins/:path*',
        '/member/:path*',
        '/auth/sign-in' , 
        '/check-user/:path*'
    ],
}