import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
export async function middleware(request) {
  //locate current path
  const path = request.nextUrl.pathname;

  //declare the public routes
  const isPublic =
    path === "/" ||
    path === "/login" ||
    path === "/register-bee" ||
    path === "/register-nectar";
  //locate token
  let token = request.cookies.get("jwt")?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  if (token) {
    var { payload } = await jwtVerify(token, secret);
  }
  //accessing protected routes
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  //protect bee routes
  if (isPublic && token && payload.role === "bee") {
    return NextResponse.redirect(new URL("/bee-profile", request.nextUrl));
  }
  if (
    token &&
    payload.role === "bee" &&
    request.nextUrl.pathname.startsWith("/nectar-profile")
  ) {
    return NextResponse.redirect(new URL("/bee-profile", request.nextUrl));
  }
  //protect nectar routes
  if (isPublic && token && payload.role === "nectar") {
    return NextResponse.redirect(new URL("/nectar-profile", request.nextUrl));
  }
  if (
    token &&
    payload.role === "nectar" &&
    request.nextUrl.pathname.startsWith("/bee-profile")
  ) {
    return NextResponse.redirect(new URL("/nectar-profile", request.nextUrl));
  }
}

// matching paths
export const config = {
  matcher: [
    "/",
    "/login",
    "/register-bee",
    "/register-nectar",
    "/bee-profile",
    "/nectar-profile",
    "/nectar-profile/:path*",
    "/bee-profile/:path*",
  ],
};
