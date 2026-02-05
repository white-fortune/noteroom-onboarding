import MobileWelcome from "@/app/welcome/components/MobileWelcome";
import cookies from "@/config/cookies";
import JWT from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Metadata } from "next";
import { cookies as getCookies } from "next/headers";
import DesktopWelcome from "./components/DesktopWelcome";

export const metadata: Metadata = {
    title: "Welcome"
}

export default async function WelcomePage() {
    let user = null

    const authTokenCookie = (await getCookies()).get(cookies.AUTH_TOKEN)
    if (authTokenCookie) {
        const authToken = authTokenCookie.value
        user = JWT.verifyToken(authToken) as JwtPayload
    }

    return (
        <section>
            <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-inter">
                <div className="lg:hidden w-full min-h-screen bg-white flex flex-col">
                    <MobileWelcome user={user} />
                </div>

                <div className="max-lg:hidden w-full min-h-screen bg-white flex flex-col">
                    <DesktopWelcome user={user} />
                </div>
            </div>
        </section>
    )
}
