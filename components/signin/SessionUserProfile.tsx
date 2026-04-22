"use client"

import { motion } from "framer-motion"
import { JwtPayload } from "jsonwebtoken"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { useRouter } from "next/navigation"
import { forwardRef, useEffect, useState } from "react"
import Popup from "../Popup"
import removeAccountPopupText from "./__RemoveAccountPopupText"

//NOTE: Wrapper so Tippy’s ref attaches to a DOM element (avoids React 19 ref warning). Uses real layout so tooltip position is correct.
const TippyRefWrapper = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
    function TippyRefWrapper({ children, className }, ref) {
        return <div ref={ref} className={className}>{children}</div>
    }
)

export default function SessionUserProfile({ user }: { user: JwtPayload }) {
    const router = useRouter()
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [openPopup, setOpenPopup] = useState<boolean>(false)

    useEffect(() => {
        const url = sessionStorage.getItem("next")
        if (url) setNextUrl(url)
    }, [])

    async function handleRemoveAccount() {
        await fetch("/api/auth/logout", { method: "POST" })
        router.refresh()
    }

    return (
        <div className="flex flex-col items-center rounded-[10px] bg-white mb-10 relative">
            <Tippy content={`Continue as ${user.name}`}>
                <TippyRefWrapper className="flex flex-col items-center w-full">
                    <motion.div
                        whileHover={{ scale: 0.99 }}
                        className="flex flex-col items-center w-full cursor-pointer rounded-[10px]"
                        onClick={() => router.push(nextUrl ? nextUrl : "https://social.noteroom.co")}
                    >
                        <div className="profile-image overflow-hidden rounded-[10px_10px_0_0] w-50 h-50 relative">
                            <img
                                src={user.profileImageUrl}
                                alt="Name"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="user-fullname p-3 w-full text-center">
                            <span className="font-inter text-lg">{user.name}</span>
                        </div>
                    </motion.div>
                </TippyRefWrapper>
            </Tippy>
            <Tippy content="Remove account">
                <TippyRefWrapper className="absolute top-2 left-2 w-8 h-8 z-10 flex">
                    <button
                        type="button"
                        onClick={() => setOpenPopup(true)}
                        className="w-full h-full rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                        aria-label="Remove account"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </TippyRefWrapper>
            </Tippy>

            <Popup 
                texts={removeAccountPopupText}
                open={[openPopup, setOpenPopup]} 
                action={() => handleRemoveAccount()} 
            />
        </div>
    )
}
