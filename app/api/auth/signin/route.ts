import AuthTokenService from "@/lib/auth_token";
import JWT from "@/lib/jwt";
import UserService from "@/lib/user";
import { authTokenModel } from "@/models/auth_token";
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
            const jwtUser = {
                email: user.email,
                name: user.name,
                username: user.username,
                _id: user._id
            }
            const jwtToken = JWT.createToken(jwtUser)

            const res = NextResponse.json({ ok: true, token: jwtToken })
            res.cookies.set("auth_token", jwtToken)

            return res
        }

        const code = response.code!
        if (code === "NOT_VALID_AUTH") {
            return NextResponse.json({ ok: false, message: "Invalid Email or Password" })
        } else if (code === "SERVER_ERROR") {
            return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
        } else if (code === "NOT_VERIFIED") {
            const response = await AuthTokenService.createToken("email", body.email, AuthTokenService.createOTP())
            //FIXME: check response for errors
            const res = NextResponse.json({ ok: false, needVerification: true })
            res.cookies.set("email-verification", response.token!.tokenID)
            return res
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
