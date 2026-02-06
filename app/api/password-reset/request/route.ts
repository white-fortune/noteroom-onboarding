import cookies from "@/config/cookies";
import AuthTokenService from "@/lib/auth_token";
import EmailService from "@/lib/brevo_email";
import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        if (!body || !body.email) {
            return NextResponse.json({ ok: false, message: "Invalid Data" })
        }

        const email = body.email

        await connectToDatabase()

        const response = await AuthTokenService.createToken("reset", email)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Couldn't create password reset token" })
        }

        const token = response.token!

        await EmailService.sendEmail(process.env.BREVO_VERIFY_EMAIL_TEMPLATE_ID!, body.email, {
            EMAIL: body.email,
            OTP: token.otp
        })

        const res = NextResponse.json({ ok: true, redirect: "/password-reset/otp" })

        const passwordResetJwtToken = JWT.createToken({
            email,
            tokenID: token.tokenID
        }, process.env.JWT_VERIFICATION_SECRET!)

        res.cookies.set(cookies.PASSWORD_RESET, passwordResetJwtToken)
        return res
    } catch (error) {
        console.error(error)
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
