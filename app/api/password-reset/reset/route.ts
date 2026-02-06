import cookies from "@/config/cookies";
import AuthTokenService from "@/lib/auth_token";
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
        const tokenID = searchParams.get("tokenID");
        if (!tokenID) {
            return NextResponse.json({ ok: false, message: "Invalid Data" });
        }

        const tokenResponse = await AuthTokenService.getEmailByResetTokenID(tokenID);
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
        
        await AuthTokenService.deleteTokenByTokenID(tokenID);

        const res = NextResponse.json({ ok: true });
        res.cookies.delete(cookies.PASSWORD_RESET);
        res.cookies.delete(cookies.AUTH_TOKEN);
        return res;
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Unexpected Error Occured" });
    }
}
