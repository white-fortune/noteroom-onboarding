import MobileSignIn from "./components/MobileSignIn";
import DesktopSigninForm from "./components/DesktopSignIn";
import { Metadata } from "next";
import SessionUserProfile from "@/components/signin/SessionUserProfile";
import { cookies as getCookies } from "next/headers";
import cookies from "@/config/cookies";
import JWT from "@/lib/jwt";
import UserService from "@/lib/user";
import connectToDatabase from "@/lib/mongodb";
import DemoTrigger from "@/components/auth/DemoTrigger";
import { TAuthTokenCookie } from "@/types/cookies";

export const metadata: Metadata = {
    title: "Sign In"
}

export default async function SigninPage({ searchParams }: { searchParams: Promise<{ next: string | undefined }> }) {
    let user = null

    const authTokenCookie = (await getCookies()).get(cookies.AUTH_TOKEN)
    if (authTokenCookie) {
        const authToken = authTokenCookie.value
        const jwtResponse = JWT.verifyToken(authToken) as TAuthTokenCookie
        if (jwtResponse) {
            await connectToDatabase()
            
            const userResponse = await UserService.getSessionUserByID(jwtResponse._id, jwtResponse.authTokenVersion)
            if (userResponse.ok) {
                user = userResponse.user!
            }
        }
    }

    const params = await searchParams
    const nextURL = params.next

    return (
        <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-inter">
            {/* Desktop Design */}
            <div className="hidden lg:grid w-full max-w-300 grid-cols-2 gap-20 items-center p-4">
                <div className={`flex flex-col h-full ${user ? 'justify-start' : 'justify-center'} items-start gap-5`}>
                    
                    { user && (
                        <SessionUserProfile user={user} />
                    ) }

                    <img
                        className="w-auto h-12 object-contain"
                        src="/noteroom.png"
                        alt="NoteRoom Logo"
                    />
                    
                    <div className="justify-start">
                        <span className="text-slate-900 text-5xl font-bold font-space leading-tight block">
                            Welcome back to
                        </span>
                        <span className="text-sky-500 text-5xl font-bold font-space leading-tight block">
                            NoteRoom
                        </span>
                    </div>
                    <div className="text-slate-500 text-xl font-normal leading-7 max-w-115.75">
                        A knowledge based social platform reflecting your intellect
                    </div>
                    <DemoTrigger />
                </div>

                <div className="w-full max-w-121.75 bg-white rounded-[20px] shadow-sm p-10 mx-auto">
                    <DesktopSigninForm nextURL={nextURL} />
                </div>
            </div>

            {/* Mobile Design */}
            <div className="lg:hidden w-full min-h-screen bg-white relative overflow-hidden flex flex-col">
                <MobileSignIn user={user} nextURL={nextURL} />
            </div>
        </div>
    );
}

