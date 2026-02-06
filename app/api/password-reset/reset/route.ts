import cookies from "@/config/cookies";
import AuthTokenService from "@/lib/auth_token";
import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { authTokenModel } from "@/models/auth_token";
import { authUserModel } from "@/models/user";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {  
        const body = await request.json()
        if (!body || !body.password) {
            return NextResponse.json({ ok: false, message: "Invalid Data" })
        }

        const passwordResetCookie = request.cookies.get(cookies.PASSWORD_RESET)
        if(!passwordResetCookie) {
            return NextResponse.json({ ok: false, message: "Invalid reset token" })
        }

        const passwordResetJwtToken = passwordResetCookie.value
        const jwtResponse = JWT.verifyToken(passwordResetJwtToken, process.env.JWT_VERIFICATION_SECRET)
        if (!jwtResponse) {
            return NextResponse.json({ ok: false, message: "Invalid Token" })
        }

        const tokenID = (jwtResponse as JwtPayload).tokenID
        const password = body.password

        await connectToDatabase()

        const response = await AuthTokenService.getTokenByTokenID(tokenID)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Invalid Token" })
        }

        const token = response.token!
        const updatedResult = await authUserModel.findOneAndUpdate({ email: token.email }, { password })
        if (!updatedResult) {
            return NextResponse.json({ ok: false, message: "Couldn't reset your password" })
        }
        
        await authTokenModel.deleteOne({ tokenID })


        const res = NextResponse.json({ ok: true })
        res.cookies.delete(cookies.PASSWORD_RESET)
        res.cookies.delete(cookies.AUTH_TOKEN)
        return res
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}