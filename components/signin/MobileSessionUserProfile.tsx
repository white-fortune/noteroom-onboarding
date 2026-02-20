"use client"

import { JwtPayload } from "jsonwebtoken"
import AuthButton from "../AuthButton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MobileSessionUserProfile({ user, setShowSessionUser }: { user: JwtPayload, setShowSessionUser: React.Dispatch<React.SetStateAction<boolean>> }) {
    const router = useRouter()
    const [nextUrl, setNextUrl] = useState<string | null>(null)

    useEffect(() => {
        const url = sessionStorage.getItem("next")
        if (url) {
            setNextUrl(url)
        }
    }, [])

    return (
        <div className="w-full flex flex-col items-center gap-4 mt-10">
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

            <div className="w-full px-6 flex justify-center">
                <AuthButton label={`Continue as ${user.name}`} onClick={() => router.push(nextUrl ? nextUrl : "https://app.noteroom.co")} />
            </div>

            <div className="w-full max-w-md h-6 relative flex justify-center items-center -mx-6">
                <div className="w-full h-px bg-slate-200 absolute"></div>
                <div className="bg-white px-3.5 py-1 rounded-3xl relative z-10">
                    <span className="text-slate-500 text-[10px] font-semibold uppercase leading-4 tracking-wider">
                        or
                    </span>
                </div>
            </div>

            <div className="w-full px-6 flex justify-center">
                <button
                    onClick={() => setShowSessionUser(false)}
                    className="w-full max-w-md h-12 bg-white rounded-lg outline-1 -outline-offset-1 outline-sky-500 flex items-center justify-center text-sky-500 text-base font-medium hover:bg-sky-50 transition-all active:scale-[0.98]"
                >
                    Continue to Sign In
                </button>
            </div>

            <div className="w-full flex flex-col items-center mt-20">
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
