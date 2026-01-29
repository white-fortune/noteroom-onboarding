"use client"

import useWindowSize from "@/hooks/useWindowSize"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MobileWelcome() {
    const { width } = useWindowSize()
    const router = useRouter()

    if (width > 1024) {
        router.replace("/signin")
    }

    return (
        <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col pt-0"
        >
            {/* Welcome Content */}
            <div className="flex-1 px-10 flex flex-col gap-8 items-center justify-center relative z-40">
                <div className="w-full max-w-md flex flex-col gap-6">
                    <div className="w-48 h-18 flex items-center justify-start">
                        <img
                            src="https://app.noteroom.co/phonelogo.png"
                            alt="NoteRoom Logo"
                            className="w-full h-18 object-contain object-left"
                        />
                    </div>
                    <div className="w-full">
                        <span className="text-slate-900 text-4xl font-bold font-space-grotesk leading-tight">
                            Welcome to{" "}
                        </span>
                        <span className="text-sky-500 text-4xl font-bold font-space-grotesk leading-tight">
                            NoteRoom
                        </span>
                    </div>
                    <div className="w-full max-w-xs text-slate-500 text-sm font-normal font-inter leading-relaxed -mt-5">
                        A knowledge based social platform reflecting your intellect
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
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
        </motion.div>
    )
}
