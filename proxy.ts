import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname === "/password-reset/otp" || pathname === "/password-reset/reset") {
        const passwordResetCookie = request.cookies.get("password-reset")
        if (!passwordResetCookie) {
            return NextResponse.redirect(new URL("/password-reset", request.url))
        }
    } else if (pathname === "/verify/email") {
        const emailVerificationCookie = request.cookies.get("email-verification")
        if (!emailVerificationCookie) {
            return NextResponse.redirect(new URL("/signin", request.url))
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/password-reset/reset", "/password-reset/otp", "/verify/email"]
};
