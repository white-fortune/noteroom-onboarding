import AuthTokenService from "@/lib/auth_token";
import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { authTokenModel } from "@/models/auth_token";
import { authUserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const emailVerificationCookie = request.cookies.get("email-verification")!

        const tokenID = emailVerificationCookie.value
        const otp = body.otp

        const response = await AuthTokenService.getTokenByTokenID(tokenID)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Invalid Token" })
        }

        const token = response.token!
        if (token.otp === otp) {
            await connectToDatabase()
            
            const email = token.email
            await authTokenModel.deleteOne({ tokenID })

            const user = await authUserModel.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true })
            const jwtUser = {
                email: user.email,
                name: user.name,
                username: user.username,
                _id: user._id
            }
            const jwtToken = JWT.createToken(jwtUser)

            const res = NextResponse.json({ ok: true })
            res.cookies.delete("email-verification")
            res.cookies.set({
                name: "auth_token",
                value: jwtToken,
                domain: ".noteroom.co",
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            return res
        }

        return NextResponse.json({ ok: false, message: "Invalid OTP" })
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
