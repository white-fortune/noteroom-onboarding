import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { authUserModel, TUserIdentity } from "@/models/user";
import { userInterestsModel } from "@/models/user_interests";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export type TOnboardData = {
    birthDate: Date | null, //NOTE: already parsed date from client
    identity: TUserIdentity | null,
    interests: string[]
}

export async function POST(request: NextRequest) {
    try {
        const onboardingUserCookie = request.cookies.get("onboarding_user")
        if (!onboardingUserCookie) {
            return NextResponse.json({ ok: false, message: "Invalid user" })
        }
        
        const jwtToken = onboardingUserCookie.value
        const user = JWT.verifyToken(jwtToken)
        if (!user) {
            return NextResponse.json({ ok: false, message: "Invalid user" })
        }

        const body = await request.json() as TOnboardData
        await connectToDatabase()

        if (body.birthDate || body.identity) {
            await authUserModel.updateOne({ email: (user as JwtPayload).email }, { $set: { birthDate: body.birthDate, identity: body.identity } })
        }

        if (body.interests) {
            await userInterestsModel.updateOne(
                { user: (user as JwtPayload)._id }, 
                { interests: body.interests.map(interest => ({ interestID: interest })) },
                { upsert: true }
            )
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
