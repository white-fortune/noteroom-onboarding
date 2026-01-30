import AuthTokenService from "@/lib/auth_token";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        if (!body || !body.otp) {
            return NextResponse.json({ ok: false, message: "Invalid Data" })
        }

        const passwordResetCookie = request.cookies.get("password-reset")
        if(!passwordResetCookie) {
            return NextResponse.json({ ok: false, message: "Invalid reset token" })
        }

        const tokenID = passwordResetCookie.value
        const otp = body.otp

        await connectToDatabase()

        const response = await AuthTokenService.getTokenByTokenID(tokenID)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Invalid Token" })
        }

        const token = response.token!
        if (token.otp === otp) {
            return NextResponse.json({ ok: true, redirect: "/password-reset/reset" })
        }

        return NextResponse.json({ ok: false, message: "Invalid OTP" })
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}