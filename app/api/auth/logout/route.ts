import cookies from "@/config/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
    try {
        const res = NextResponse.json({ ok: true, message: "Signed out successfully" });

        res.cookies.delete(cookies.AUTH_TOKEN);
        res.cookies.delete(cookies.ONBOARDING_USER);
        res.cookies.delete(cookies.EMAIL_VERIFICATION);

        return res;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { ok: false, message: "Unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
