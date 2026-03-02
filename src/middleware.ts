import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId");
  const { pathname } = request.nextUrl;

  //-----------------------------Entry Point-----------------------------//
  if (pathname === "/") {
    if (userId) {
      return NextResponse.redirect(new URL("/workspace", request.url));
    }
    return NextResponse.redirect(new URL("/join-room", request.url));
  }
  //-----------------------------no user in workspace-----------------------------//
  if (!userId && pathname === "/workspace") {
    return NextResponse.redirect(new URL("/join-room", request.url));
  }
  //-----------------------------has user in workspace-----------------------------//
  if (userId && pathname === "/workspace") {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/join-room", "/workspace"]
};
