import AuthTokenService from "@/lib/auth_token";
import EmailService from "@/lib/brevo_email";
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
            const response = await AuthTokenService.getTokenByTokenID(tokenID)
            token = response.token!
        } else {
            const response = await AuthTokenService.createToken("reset", email)
            token = response.token!
        }

        await EmailService.sendEmail(process.env.BREVO_VERIFY_EMAIL_TEMPLATE_ID!, body.email, {
            EMAIL: body.email,
            OTP: token.otp
        })

        const res = NextResponse.json({ ok: true, redirect: "/password-reset/otp" })
        res.cookies.set("password-reset", token.tokenID)
        return res
    } catch (error) {
        console.error(error)
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
