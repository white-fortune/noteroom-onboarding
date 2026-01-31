import MobileSignIn from "./components/MobileSignIn";
import DesktopSigninForm from "./components/DesktopSignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In"
}

export default function SigninPage() {
    return (
        <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-inter">
            {/* Desktop Design */}
            <div className="hidden lg:grid w-full max-w-300 grid-cols-2 gap-20 items-center p-4">
                {/* Left Content */}
                <div className="flex flex-col justify-start items-start gap-5">
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
                <MobileSignIn />
            </div>
        </div>
    );
}