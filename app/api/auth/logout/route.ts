import cookies from "@/config/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
    try {
        const response = NextResponse.json({ ok: true, message: "Signed out successfully" });

        response.cookies.set({
            name: cookies.AUTH_TOKEN,
            value: "",
            domain: process.env.ENVIRONMENT === "production" ? ".noteroom.co" : "localhost",
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(0)
        })
    
        return response;
    } catch (error) {
        return NextResponse.json(
            { ok: false, message: "Unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}

