import cookies from "@/config/cookies";
import AuthTokenService from "@/lib/auth_token";
import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body || !body.otp) {
            return NextResponse.json({ ok: false, message: "Invalid Data" });
        }

        const passwordResetCookie = request.cookies.get(cookies.PASSWORD_RESET);
        if (!passwordResetCookie) {
            return NextResponse.json({ ok: false, message: "Invalid reset token" });
        }

        const passwordResetJwtToken = passwordResetCookie.value;
        const jwtResponse = JWT.verifyToken(passwordResetJwtToken, process.env.JWT_VERIFICATION_SECRET);
        if (!jwtResponse) {
            return NextResponse.json({ ok: false, message: "Invalid Token" });
        }

        const tokenID = (jwtResponse as JwtPayload).tokenID;
        const otp = body.otp;

        await connectToDatabase();

        const response = await AuthTokenService.getTokenByEmailAndType("reset", (jwtResponse as JwtPayload).email);
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Invalid Token" });
        }

        const token = response.token!;
        if (token.otp === otp) {
            return NextResponse.json({ ok: true, redirect: "/password-reset/reset" });
        }

        return NextResponse.json({ ok: false, message: "Invalid OTP" });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}
