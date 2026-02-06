"use client"

import { JwtPayload } from "jsonwebtoken"
import AuthButton from "../AuthButton"
import Link from "next/link"

export default function MobileSessionUserProfile({ user, setShowSessionUser }: { user: JwtPayload, setShowSessionUser: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className="w-full flex flex-col items-center px-6 gap-4 mt-auto">
            <div className="session-user w-fill flex flex-col items-center gap-3">
                <div className="profile-image overflow-hidden rounded-full w-40 h-40">
                    <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="user-fullname">
                    <span className="font-inter text-lg">{user.name}</span>
                </div>
            </div>

            <AuthButton label={`Continue as ${user.name}`} />

            <div className="w-full flex items-center justify-center my-5 gap-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    or
                </div>
                <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <button
                onClick={() => setShowSessionUser(false)}
                className="w-full max-w-md h-12 bg-white rounded-lg outline-1 -outline-offset-1 outline-sky-500 flex items-center justify-center text-sky-500 text-base font-medium hover:bg-sky-50 transition-all active:scale-[0.98]"
            >
                Continue to Sign In
            </button>

            <div className="w-full flex flex-col items-center mt-10">
                <div className="flex flex-col items-center gap-1 mb-4">
                    <img
                        src="https://app.noteroom.co/noteroom.png"
                        alt="NoteRoom Logo"
                        className="w-36 h-12 object-contain"
                    />
                    <div className="text-center">
                        <span className="text-zinc-600 text-sm font-medium">
                            New here?{" "}
                        </span>
                        <Link
                            href="/signup"
                            className="text-sky-500 text-sm font-semibold hover:underline"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}