import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAuthenticated(req: NextRequest) {
  const authheader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authheader) {
    return false;
  }

  const auth = Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];

  if (user === process.env.USER && pass === process.env.PASSWORD) {
    return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' unsafe-inline https://vercel.live/ https://va.vercel-scripts.com/;
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self' https://fonts.gstatic.com/;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
