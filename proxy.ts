import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import cookies from "./config/cookies";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const userAgent = request.headers.get("user-agent") || ""
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)

    if (pathname === "/verify/email") {
        const emailVerificationCookie = request.cookies.get(cookies.EMAIL_VERIFICATION)
        if (!emailVerificationCookie) {
            return NextResponse.redirect(new URL("/sign-in", request.url))
        }
    } else if (pathname === "/onboard") {
        const onboardingUserCookie = request.cookies.get(cookies.ONBOARDING_USER)
        if (!onboardingUserCookie) {
            return NextResponse.redirect(new URL("/sign-up", request.url))
        }
    } else if (!isMobile && pathname === "/welcome") {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/verify/email", "/onboard", "/welcome"]
};
