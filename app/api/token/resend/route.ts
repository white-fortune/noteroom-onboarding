import cookies from "@/config/cookies";
import AuthTokenService from "@/lib/auth_token";
import EmailService from "@/lib/brevo_email";
import JWT from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const pathname = body.from;

        let verificationCookie = null;

        const verificationCookieKey =
            pathname === "/verify/email" ? cookies.EMAIL_VERIFICATION : cookies.PASSWORD_RESET;
        verificationCookie = request.cookies.get(verificationCookieKey);

        if (!verificationCookie) {
            return NextResponse.json({ ok: false, message: "Invalid verification token" });
        }

        const verificationJwtToken = verificationCookie.value;
        const jwtResponse = JWT.verifyToken(verificationJwtToken, process.env.JWT_VERIFICATION_SECRET!);
        if (!jwtResponse) {
            return NextResponse.json({ ok: false, message: "Invalid verification token. Try to signin again" });
        }

        await connectToDatabase();

        const tokenID = (jwtResponse as JwtPayload).tokenID;
        const response = await AuthTokenService.getTokenByEmailAndType(pathname === "/verify/email" ? "email" : "reset", (jwtResponse as JwtPayload).email);
        if (!response.ok) {
            return NextResponse.json({ ok: false, message: "Invalid verification token. Try to signin again" });
        }

        const token = response.token!;
        const email = token.email;

        await EmailService.sendEmail(process.env.BREVO_VERIFY_EMAIL_TEMPLATE_ID!, email, {
            EMAIL: email,
            OTP: token.otp
        });

        const res = NextResponse.json({ ok: true });
        const verificationJwt = JWT.createToken(
            {
                email: email,
                tokenID: tokenID
            },
            process.env.JWT_VERIFICATION_SECRET!
        );

        res.cookies.set(verificationCookieKey, verificationJwt);
        return res;
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}
