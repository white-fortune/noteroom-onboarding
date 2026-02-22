import cookies, { cookieMaxAge } from "@/config/cookies";
import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import UserService from "@/lib/user";
import { authUserModel } from "@/models/user";
import { TAuthTokenCookie, TOnboardingUserCookie } from "@/types/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body) {
            return NextResponse.json({ ok: false, message: "Invalid Data" });
        }

        await connectToDatabase()

        const credential = body.credential;
        const response = await UserService.verifyGoogleCredential(credential);

        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
        }

        const payload = response.payload!;
        const { name, email, picture } = payload
        let user = await authUserModel.findOne({ email })

        if (!user) {
            user = await authUserModel.create({
                username: UserService.generateUsernameFromEmail(payload.email),
                email,
                name,
                authProvider: "google",
                password: null,
                profileImageUrl: picture
            });
        } else {
            const authProvider = user.authProvider
            if (!authProvider) {
                return NextResponse.json({ ok: false, message: "An account with this email already exists using a different sign-in method." })
            }
        }

        if (user.onboarded) {
            const jwtUser: TAuthTokenCookie = {
                email: user.email,
                name: user.name,
                username: user.username,
                _id: user._id,
                authTokenVersion: user.authTokenVersion
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
                maxAge: cookieMaxAge.AUTH_TOKEN
            })

            return res
        } else {
            const jwtOnboardingUser: TOnboardingUserCookie = {
                email: user.email,
                name: user.name,
                _id: user._id
            }
            const jwtOnboardingUserToken = JWT.createToken(jwtOnboardingUser)

            const res = NextResponse.json({ ok: false, needOnboarding: true })
            res.cookies.set(cookies.ONBOARDING_USER, jwtOnboardingUserToken)
            
            return res
        }
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}

