"use client"

import { motion } from "framer-motion"
import { JwtPayload } from "jsonwebtoken"
import WelcomeActions from "../../../components/welcome/WelcomeActions"

export default function MobileWelcome({ user }: { user: JwtPayload | null }) {
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

            <WelcomeActions user={user} />
        </motion.div>
    )
}
