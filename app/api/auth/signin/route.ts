import cookies from "@/config/cookies";
import { EmailVerificationTokenService } from "@/lib/auth_token";
import EmailService from "@/lib/brevo_email";
import JWT from "@/lib/jwt";
import UserService from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        if (!body) {
            return NextResponse.json({ ok: false, message: "Invalid Data" })
        }

        const response = await UserService.getAuthenticatedUser(body.email, body.password)
        if (response.ok) {
            const user = response.user!

            if (user.onboarded) {
                const jwtUser = {
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    _id: user._id
                }
                const jwtToken = JWT.createToken(jwtUser)
    
                const res = NextResponse.json({ ok: true })
                res.cookies.set({
                    name: cookies.AUTH_TOKEN,
                    value: jwtToken,
                    domain: process.env.ENVIRONMENT === "production" ? ".noteroom.co" : "localhost",
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
    
                return res
            } else {
                const jwtOnboardingUser = {
                    email: user.email,
                    name: user.name,
                    _id: user._id
                }
                const jwtOnboardingUserToken = JWT.createToken(jwtOnboardingUser)

                const res = NextResponse.json({ ok: false, needOnboarding: true })
                res.cookies.set(cookies.ONBOARDING_USER, jwtOnboardingUserToken)

                return res
            }
        }

        const code = response.code!
        if (code === "NOT_VALID_AUTH") {
            return NextResponse.json({ ok: false, message: "Invalid Email or Password" })
        } else if (code === "SERVER_ERROR") {
            return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
        } else if (code === "NOT_VERIFIED") {
            const response = await EmailVerificationTokenService.createToken(body.email)
            if (!response.ok) {
                return NextResponse.json({ ok: false, message: "Couldn't verify your email" })
            }

            const token = response.token!
            await EmailService.sendEmail(process.env.BREVO_VERIFY_EMAIL_TEMPLATE_ID!, body.email, {
                EMAIL: body.email,
                OTP: token.otp!
            })

            const res = NextResponse.json({ ok: false, needVerification: true })

            const emailVerificationJwtToken = JWT.createToken({
                email: body.email,
                tokenID: token.tokenID
            }, process.env.JWT_VERIFICATION_SECRET!)

            res.cookies.set(cookies.EMAIL_VERIFICATION, emailVerificationJwtToken)
            return res
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
