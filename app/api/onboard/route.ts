import cookies, { cookieMaxAge } from "@/config/cookies";
import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { authUserModel } from "@/models/user";
import { userInterestsModel } from "@/models/user_interests";
import { TAuthTokenCookie } from "@/types/cookies";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export type TOnboardData = {
    dob: string | null,
    identity: string | null,
    interests: string[]
}

function __parseDate(dateStr: string | null) {
    if (!dateStr) return null

    //NOTE: dateStr = "YYYY-MM-DD", got from the date input
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(Date.UTC(year, month - 1, day))
}


export async function POST(request: NextRequest) {
    try {
        const onboardingUserCookie = request.cookies.get(cookies.ONBOARDING_USER)
        if (!onboardingUserCookie) {
            return NextResponse.json({ ok: false, message: "Invalid user" })
        }
        
        const jwtToken = onboardingUserCookie.value
        const user = JWT.verifyToken(jwtToken)
        if (!user) {
            return NextResponse.json({ ok: false, message: "Invalid user" })
        }
        
        const body = await request.json() as TOnboardData
        const res = NextResponse.json({ ok: true })

        await connectToDatabase()

        if (body.interests) {
            await userInterestsModel.updateOne(
                { user: (user as JwtPayload)._id }, 
                { interests: body.interests.map(interest => ({ interestID: interest })) },
                { upsert: true }
            )
        }

        if (body.dob || body.identity) {
            const updatedUser = await authUserModel.findOneAndUpdate(
                { email: (user as JwtPayload).email }, 
                { $set: { birthDate: __parseDate(body.dob), identity: body.identity, onboarded: true } },
                { new: true }
            )
            const jwtUser: TAuthTokenCookie = {
                email: updatedUser.email,
                name: updatedUser.name,
                username: updatedUser.username,
                _id: updatedUser._id,
                authTokenVersion: updatedUser.authTokenVersion
            }
            const jwtToken = JWT.createToken(jwtUser)
            
            res.cookies.delete(cookies.ONBOARDING_USER)
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
        }

        return res
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}

