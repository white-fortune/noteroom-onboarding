import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import cookies from "./config/cookies";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname === "/password-reset/otp" || pathname === "/password-reset/reset") {
        const passwordResetCookie = request.cookies.get(cookies.PASSWORD_RESET)
        if (!passwordResetCookie) {
            return NextResponse.redirect(new URL("/password-reset", request.url))
        }
    } else if (pathname === "/verify/email") {
        const emailVerificationCookie = request.cookies.get(cookies.EMAIL_VERIFICATION)
        if (!emailVerificationCookie) {
            return NextResponse.redirect(new URL("/signin", request.url))
        }
    } else if (pathname === "/onboard") {
        const onboardingUserCookie = request.cookies.get(cookies.ONBOARDING_USER)
        if (!onboardingUserCookie) {
            return NextResponse.redirect(new URL("/signup", request.url))
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/password-reset/reset", "/password-reset/otp", "/verify/email", "/onboard"]
};
