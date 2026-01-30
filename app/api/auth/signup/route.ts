import AuthTokenService from "@/lib/auth_token";
import connectToDatabase from "@/lib/mongodb";
import UserService from "@/lib/user";
import { authUserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        if (!body) {
            return NextResponse.json({ ok: false, message: "Invalid Data" }, { status: 403 })
        }

        await connectToDatabase()
        
        await authUserModel.create({
            username: UserService.generateUsernameFromEmail(body.email),
            email: body.email, 
            name: body.name, 
            password: body.password,
        })

        const response = await AuthTokenService.createToken("email", body.email)
        if (!response.ok) {
            //FIXME: what to do if this fails
            return NextResponse.json({ ok: false, message: "Couldn't create verification token" })
        }

        const token = response.token!
        const res = NextResponse.json({ ok: true, redirect: "/verify/email" })
        res.cookies.set("email-verification", token.tokenID)
        return res
    } catch (error) {
        // @ts-ignore
        if (error.code === 11000) {
            // @ts-ignore handling duplicate key errors
            const duplicate_key = Object.keys(error.keyValue)[0]
            if (duplicate_key === "email") {
                return NextResponse.json({ ok: false, message: 'An account associated with the email already exists'})
            }
        } else {
            return NextResponse.json({ ok: false, message: 'Unexpected Server Error'})
        }
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" })
    }
}
