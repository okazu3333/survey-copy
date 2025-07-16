import { type NextRequest, NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // 認証を一時的に無効化
  return NextResponse.next();
  
  // 以下は認証が有効な場合のコード
  /*
  const basicAuth = request.headers.get("authorization");
  const url = request.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    const validUser = process.env.BASIC_AUTH_USER ?? "";
    const validPassword = process.env.BASIC_AUTH_PASSWORD ?? "";

    if (user === validUser && pwd === validPassword) {
      return NextResponse.next();
    }
  }

  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
  */
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
