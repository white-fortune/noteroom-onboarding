import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import UserService from "@/lib/user";
import { authUserModel } from "@/models/user";
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
        const email = payload.email
        let user = await authUserModel.findOne({ email })

        if (!user) {
            user = await authUserModel.create({
                username: UserService.generateUsernameFromEmail(payload.email),
                email: payload.email,
                name: payload.name,
                authProvider: "google",
                password: null
            });
        } else {
            const authProvider = user.authProvider
            if (!authProvider) {
                return NextResponse.json({ ok: false, message: "An account with this email already exists using a different sign-in method." })
            }
        }

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
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}
