"use client"

import { JwtPayload } from "jsonwebtoken";
import WelcomeActions from "../../../components/welcome/WelcomeActions";

export default function DesktopWelcome({ user }: { user: JwtPayload | null }) {
    return (
        <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-inter">
            <div className="hidden lg:grid w-full max-w-300 grid-cols-2 gap-20 items-center p-4">
                <div className="flex flex-col justify-start items-start gap-5">
                    <img
                        className="w-auto h-12 object-contain"
                        src="https://app.noteroom.co/noteroom.png"
                        alt="NoteRoom Logo"
                    />
                    <div className="justify-start">
                        <span className="text-slate-900 text-5xl font-bold font-space leading-tight block">
                            Welcome to{" "}
                        </span>
                        <span className="text-sky-500 text-5xl font-bold font-space leading-tight block">
                            NoteRoom
                        </span>
                    </div>
                    <div className="text-slate-500 text-xl font-normal leading-7 max-w-115.75">
                        A knowledge based social platform reflecting your intellect
                    </div>
                </div>

                <div className="w-full max-w-121.75 bg-white rounded-[20px] shadow-sm p-10 mx-auto">
                    <WelcomeActions user={user} />
                </div>
            </div>
        </div>
    )
}
