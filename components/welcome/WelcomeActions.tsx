"use client"

import { JwtPayload } from "jsonwebtoken"
import Link from "next/link"

export default function WelcomeActions({ user }: { user: JwtPayload | null }) {
    return (
        <div className="px-6 pb-8 flex flex-col gap-3 items-center relative z-40">
            <div className="w-full max-w-md text-center mb-2">
                <span className="text-slate-500 text-[11px] font-normal leading-4">
                    By selecting one or the other, you are agreeing to the{" "}
                </span>
                <p className="inline">
                    <a
                        href="https://www.noteroom.co/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 text-[11px] font-semibold leading-4 cursor-pointer hover:underline"
                    >
                        Terms of Services
                    </a>
                    <span className="text-slate-500 text-[11px] font-normal leading-4">
                        {" "}
                        &{" "}
                    </span>
                    <a
                        href="https://www.noteroom.co/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 text-[11px] font-semibold leading-4 cursor-pointer hover:underline"
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>

            {user && (
                <>
                    <Link
                        href={"https://app.noteroom.co"}
                        className="flex items-center justify-center max-w-md rounded-3xl bg-white border border-sky-500 px-7 py-2.5 text-sky-500 text-base font-medium w-full hover:bg-sky-50 transition-all active:scale-[0.98]"

                    >
                        Continue as {user.name}
                    </Link>

                    <div className="w-full max-w-md px-6 h-6 relative flex justify-center items-center">
                        <div className="w-full h-px bg-slate-200 absolute"></div>
                        <div className="bg-white px-3.5 py-1 rounded-3xl relative z-10">
                            <span className="text-slate-500 text-[10px] font-semibold uppercase leading-4 tracking-wider">
                                or
                            </span>
                        </div>
                    </div>
                </>
            )}

            <Link
                href={"/signup"}
                className="w-full max-w-md h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white text-base font-medium hover:bg-sky-700 transition-all active:scale-[0.98]"
            >
                Create an account
            </Link>

            <Link
                href={"/signin"}
                className="w-full max-w-md h-12 bg-white rounded-lg outline-1 -outline-offset-1 outline-sky-500 flex items-center justify-center text-sky-500 text-base font-medium hover:bg-sky-50 transition-all active:scale-[0.98]"
            >
                Sign In
            </Link>
        </div>
    )
}