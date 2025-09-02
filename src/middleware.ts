import { NextResponse, type NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/clients",
    "/leads",
    "/quotation",
    "/reservations",
    "/assignments",
    "/tasks",
    "/profile",
    "/pending-contracts",
    "/payments-transaction",
    "/credit-management",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Obtener tokens de las cookies
    const accessToken = request.cookies.get("gestion_hogar_access_token")?.value;
    const refreshToken = request.cookies.get("gestion_hogar_access_token_refresh")?.value;

    const isAuthenticated = !!(accessToken ?? refreshToken);

    // Si está autenticado y va a login, redirigir al dashboard
    if (pathname === "/login" && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Si es una ruta protegida y no está autenticado
    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Permitir acceso a todas las demás rutas
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};
