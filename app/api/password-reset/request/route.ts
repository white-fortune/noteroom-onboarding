import { PasswordResetTokenService } from "@/lib/auth_token";
import EmailService from "@/lib/brevo_email";
import connectToDatabase from "@/lib/mongodb";
import { authUserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        if (!body || !body.email) {
            return NextResponse.json({ ok: false, message: "Invalid Data" })
        }

        const email = body.email

        await connectToDatabase()

        //NOTE: only proceed if an account with that email already exists with the local auth provider, but displaying the same success message
        const exitstingUser = await authUserModel.findOne({ email, authProvider: null })
        if (!exitstingUser) {
            return NextResponse.json({ ok: true })
        }

        const response = await PasswordResetTokenService.createToken(email)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Couldn't create password reset token" })
        }

        const token = response.token!

        await EmailService.sendEmail(process.env.BREVO_PASSWORD_RESET_TEMPLATE_ID!, email, {
            EMAIL: email,
            LINK: `https://onboarding.noteroom.co/password-reset/reset?token=${token}`
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}

