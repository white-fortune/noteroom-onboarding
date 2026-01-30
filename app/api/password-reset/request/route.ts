import AuthTokenService from "@/lib/auth_token";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        if (!body || !body.email) {
            return NextResponse.json({ ok: false, message: "Invalid Data" })
        }

        const email = body.email
        let token = null

        await connectToDatabase()

        const passwordResetCookie = request.cookies.get("password-reset")
        if (passwordResetCookie) {
            const tokenID = passwordResetCookie.value
            token = await AuthTokenService.getTokenByTokenID(tokenID)
        } else {
            const response = await AuthTokenService.createToken("reset", email, AuthTokenService.createOTP())
            token = response.token!
        }

        const res = NextResponse.json({ ok: true, redirect: "/password-reset/otp" })
        res.cookies.set("password-reset", token.tokenID)
        return res
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
