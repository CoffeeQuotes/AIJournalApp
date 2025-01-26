import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deleteCookie } from 'cookies-next';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const protectedRoutes = [
  '/journal',
  '/analysis',
  '/settings',
  '/prompts',
  '/new-entry',
  '/dashboard',
];
const authRoutes = [
  '/login',
  '/register',
  '/reset-password/:token',
  '/reset-password/request',
];

async function validateToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false; // No token, consider invalid
  }
  try {
    const response = await fetch(
      `${apiBaseUrl}/authentication/index.php?action=validate-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.status === 200;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error validating token: ', error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const url = req.nextUrl.pathname;

  if (
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/register'
  ) {
    if (token) {
      const isValid = await validateToken(token);
      if (isValid) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
      } else {
        deleteCookie('authToken', { req, res: NextResponse.next() });
        return NextResponse.next();
      }
    }
  }

  if (protectedRoutes.some((route) => url.startsWith(route))) {
    if (!token) {
      const absoluteURL = new URL(`/login?next=${url}`, req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    } else {
      const isValid = await validateToken(token);
      if (!isValid) {
        deleteCookie('authToken', { req, res: NextResponse.next() });
        const absoluteURL = new URL(`/login?next=${url}`, req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
      }
    }
  }

  if (authRoutes.some((route) => url.startsWith(route)) && token) {
    const isValid = await validateToken(token);
    if (isValid) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
    } else {
      deleteCookie('authToken', { req, res: NextResponse.next() });
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/',
    '/journal',
    '/analysis',
    '/settings',
    '/prompts',
    '/login',
    '/register',
    '/reset-password/:token',
    '/reset-password/request',
  ],
};
