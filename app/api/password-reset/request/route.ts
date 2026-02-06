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

        await connectToDatabase()

        const response = await AuthTokenService.createToken("reset", email)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Couldn't create password reset token" })
        }

        const token = response.token!

        await EmailService.sendEmail(process.env.BREVO_PASSWORD_RESET_TEMPLATE_ID!, email, {
            EMAIL: email,
            LINK: `https://onboarding.noteroom.co/password-reset/reset?tokenID=${token.tokenID}`
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
