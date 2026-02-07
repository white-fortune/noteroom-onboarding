import cookies from "@/config/cookies";
import { EmailVerificationTokenService } from "@/lib/auth_token";
import EmailService from "@/lib/brevo_email";
import JWT from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const emailVerificationCookie = request.cookies.get(cookies.EMAIL_VERIFICATION);

        if (!emailVerificationCookie) {
            return NextResponse.json({ ok: false, message: "Invalid verification token. Try to signin again" });
        }

        const verificationJwtToken = emailVerificationCookie.value;
        const jwtResponse = JWT.verifyToken(verificationJwtToken, process.env.JWT_VERIFICATION_SECRET!);
        if (!jwtResponse) {
            return NextResponse.json({ ok: false, message: "Invalid verification token. Try to signin again" });
        }

        const email = (jwtResponse as JwtPayload).email;

        const response = await EmailVerificationTokenService.createToken(email)
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Couldn't create new token. Try again a bit later"})
        }

        const token = response.token!

        await EmailService.sendEmail(process.env.BREVO_VERIFY_EMAIL_TEMPLATE_ID!, email, {
            EMAIL: email,
            OTP: token!.otp
        });

        const res = NextResponse.json({ ok: true });

        const verificationJwt = JWT.createToken({
            email: email,
            tokenID: token.tokenID
        }, process.env.JWT_VERIFICATION_SECRET!);

        res.cookies.set(cookies.EMAIL_VERIFICATION, verificationJwt);

        return res;
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}
