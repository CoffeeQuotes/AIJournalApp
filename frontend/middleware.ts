import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/journal', '/analysis', '/settings', '/prompts', '/new-entry']; // Removed /dashboard
const authRoutes = ['/login', '/register'];

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken')?.value;
    const url = req.nextUrl.pathname;

    if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
        }
    }

    if (protectedRoutes.some(route => url.startsWith(route))) {
        if (!token) {
            const absoluteURL = new URL(`/login?next=${url}`, req.nextUrl.origin);
            return NextResponse.redirect(absoluteURL.toString());
        }
    }

    if (authRoutes.includes(url) && token) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/', '/journal', '/analysis', '/settings', '/prompts', '/login', '/register', '/new-entry'],
};