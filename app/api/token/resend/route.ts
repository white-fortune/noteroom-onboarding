import AuthTokenService from "@/lib/auth_token";
import EmailService from "@/lib/brevo_email";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const pathname = body.from

        let verificationCookie = null

        const verificationCookieKey = pathname === "/verify/email" ? "email-verification" : "password-reset"
        verificationCookie = request.cookies.get(verificationCookieKey)

        if (!verificationCookie) {
            return NextResponse.json({ ok: false, message: "Invalid verification token" })
        }
        
        const tokenID = verificationCookie.value

        await connectToDatabase()

        const response = await AuthTokenService.getTokenByTokenID(tokenID)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Invalid verification token. Try to signin again" })
        }

        const token = response.token!
        const email = token.email

        await EmailService.sendEmail(process.env.BREVO_VERIFY_EMAIL_TEMPLATE_ID!, email, {
            EMAIL: email,
            OTP: token.otp
        })

        const res = NextResponse.json({ ok: true })
        res.cookies.set(verificationCookieKey, tokenID)
        return res
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
