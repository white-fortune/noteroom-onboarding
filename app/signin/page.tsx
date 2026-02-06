import MobileSignIn from "./components/MobileSignIn";
import DesktopSigninForm from "./components/DesktopSignIn";
import { Metadata } from "next";
import SessionUserProfile from "@/components/signin/SessionUserProfile";

export const metadata: Metadata = {
    title: "Sign In"
}

export default function SigninPage() {
    //TODO: fetch the actual user details based on AUTH_TOKEN
    const user = {
        name: "Test User",
        profileImageUrl: "https://api.dicebear.com/9.x/pixel-art/svg"
    }

    return (
        <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-inter">
            {/* Desktop Design */}
            <div className="hidden lg:grid w-full max-w-300 grid-cols-2 gap-20 items-center p-4">
                <div className="flex flex-col h-full justify-start items-start gap-5">
                    
                    { user && (
                        <SessionUserProfile user={user} />
                    ) }

                    <img
                        className="w-auto h-12 object-contain"
                        src="https://app.noteroom.co/noteroom.png"
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
                </div>

                {/* Login Card */}
                <div className="w-full max-w-121.75 bg-white rounded-[20px] shadow-sm p-10 mx-auto">
                    <DesktopSigninForm />
                </div>
            </div>

            {/* Mobile Design */}
            <div className="lg:hidden w-full min-h-screen bg-white relative overflow-hidden flex flex-col">
                <MobileSignIn user={user} />
            </div>
        </div>
    );
}