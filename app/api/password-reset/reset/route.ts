import cookies from "@/config/cookies";
import { PasswordResetTokenService } from "@/lib/auth_token";
import connectToDatabase from "@/lib/mongodb";
import { authUserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body || !body.password) {
            return NextResponse.json({ ok: false, message: "Invalid Data" });
        }

        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get("token");
        if (!token) {
            return NextResponse.json({ ok: false, message: "Invalid Data" });
        }

        //FIXME: enfore token validation as its an api
        const tokenResponse = await PasswordResetTokenService.getEmailFromToken(token);
        if (!tokenResponse.ok || !tokenResponse.email) {
            return NextResponse.json({ ok: false, message: "Invalid token" });
        }

        const password = body.password;
        const email = tokenResponse.email;

        await connectToDatabase();

        const updatedResult = await authUserModel.findOneAndUpdate({ email: email }, { password });
        if (!updatedResult) {
            return NextResponse.json({ ok: false, message: "Couldn't reset your password" });
        }

        await PasswordResetTokenService.deleteTokenByEmail(email);

        const res = NextResponse.json({ ok: true });
        res.cookies.delete(cookies.AUTH_TOKEN);
        return res;
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}
