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
        const body = await request.json();
        const emailVerificationCookie = request.cookies.get(cookies.EMAIL_VERIFICATION)!;

        const emailVerificationJwtToken = emailVerificationCookie.value;
        const jwtResponse = JWT.verifyToken(emailVerificationJwtToken, process.env.JWT_VERIFICATION_SECRET!);
        if (!jwtResponse) {
            return NextResponse.json({ ok: false, message: "Invalid Token" });
        }

        const email = (jwtResponse as JwtPayload).email
        const otp = body.otp;

        const response = await AuthTokenService.getTokenByEmailAndType("email", email);
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Invalid Token" });
        }

        const token = response.token!;
        if (token.otp === otp) {
            await connectToDatabase();

            const email = token.email;
            await AuthTokenService.deleteTokenByEmailAndType("email", email)

            const user = await authUserModel.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true });
            const jwtOnboardingUser = {
                email: user.email,
                name: user.name,
                _id: user._id
            };
            const jwtOnboardingUserToken = JWT.createToken(jwtOnboardingUser);

            const res = NextResponse.json({ ok: true });
            res.cookies.delete(cookies.EMAIL_VERIFICATION);
            res.cookies.set(cookies.ONBOARDING_USER, jwtOnboardingUserToken);
            return res;
        }

        return NextResponse.json({ ok: false, message: "Invalid OTP" });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}
