"use client"

import { JwtPayload } from "jsonwebtoken"
import AuthButton from "../AuthButton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import GoogleLogin from "@/components/auth/GoogleLogin"

type MobileSessionUserProfileProps = {
    user: JwtPayload
    setShowSessionUser: React.Dispatch<React.SetStateAction<boolean>>
    setApiError?: React.Dispatch<React.SetStateAction<string>>
    setLoadingSubmit?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MobileSessionUserProfile({ user, setShowSessionUser, setApiError, setLoadingSubmit }: MobileSessionUserProfileProps) {
    const router = useRouter()
    const [nextUrl, setNextUrl] = useState<string | null>(null)

    useEffect(() => {
        const url = sessionStorage.getItem("next")
        if (url) {
            setNextUrl(url)
        }
    }, [])

    async function handleRemoveAccount() {
        await fetch("/api/auth/logout", { method: "POST" })
        router.refresh()
    }

    return (
        <div className="w-full flex flex-col items-center gap-4 mt-10 px-6">
            {/* Profile */}
            <div className="session-user w-full flex flex-col items-center gap-3">
                <div className="profile-image overflow-hidden rounded-full w-40 h-40 border border-slate-200 shrink-0">
                    <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="user-fullname">
                    <span className="font-inter text-lg font-medium text-slate-800">{user.name}</span>
                </div>
            </div>

            {/* Continue */}
            <div className="w-full max-w-md flex justify-center">
                <AuthButton
                    type="button"
                    label="Continue"
                    onClick={() => router.push(nextUrl ?? "https://social.noteroom.co")}
                />
            </div>

            {/* Remove this account */}
            <button
                type="button"
                onClick={handleRemoveAccount}
                className="text-slate-500 text-sm font-medium underline hover:text-slate-600"
            >
                Remove this account
            </button>

            {/* OR */}
            <div className="w-full max-w-md h-6 relative flex justify-center items-center">
                <span className="bg-white px-3.5 py-1 text-slate-500 text-[12px] font-semibold uppercase tracking-wider relative z-10">
                    or
                </span>
            </div>

            {/* Sign in with */}
            <div className="w-full max-w-md flex flex-col items-center gap-3">
                <span className="text-slate-700 text-sm font-medium">Sign in with</span>
                <div className="flex items-center justify-center gap-8">
                    {/* Email */}
                    <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center text-black hover:opacity-70 transition-opacity"
                        aria-label="Sign in with email"
                    >
                        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.71484 2.71875L12.7773 9.1875L23.5586 2.71875M4.15234 18.2813C2.56453 18.2813 1.27734 16.9941 1.27734 15.4063V4.15625C1.27734 2.56843 2.56453 1.28125 4.15234 1.28125H21.4023C22.9902 1.28125 24.2773 2.56843 24.2773 4.15625V15.4063C24.2773 16.9941 22.9902 18.2813 21.4023 18.2813H4.15234Z" stroke="currentColor" strokeWidth="2.55556" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    {/* Google - SVG on top, compact GoogleLogin underneath for clicks */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        {setApiError && setLoadingSubmit && (
                            <div>
                                <GoogleLogin setApiError={setApiError} setLoadingSubmit={setLoadingSubmit} />
                            </div>
                        )}
                    </div>
                    {/* Apple */}
                    <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center text-black hover:opacity-70 transition-opacity"
                        aria-label="Sign in with Apple"
                    >
                        <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.8457 0.580078C12.8378 0.754152 12.8217 0.962676 12.7812 1.19238C12.6629 1.86366 12.3687 2.69471 11.6699 3.39355C10.9469 4.11652 10.2639 4.40057 9.78223 4.51074C9.6558 4.53964 9.54184 4.55566 9.44336 4.56543C9.44966 4.39531 9.46488 4.18521 9.50684 3.95117C9.61885 3.32671 9.89643 2.55104 10.5537 1.89355C11.2393 1.208 11.9523 0.859042 12.4883 0.681641C12.619 0.638384 12.7392 0.605321 12.8457 0.580078Z" fill="currentColor" stroke="currentColor"/>
                            <path d="M9.12452 6.33813C8.01885 6.33057 7.33965 5.37587 5.4566 5.37587C3.76225 5.37587 2.06373 6.46905 1.34151 7.52681C0.622641 8.57964 0 9.73436 0 12.0778C0 14.4211 1.12832 18.4513 3.90285 21.1796C4.378 21.6469 5.00698 21.9981 5.72454 22.0198C7.0151 22.0589 7.80756 21.0928 9.43774 21.0928C11.0679 21.0928 11.5585 22.0198 13.0302 22.0198C13.6994 22.0198 14.4626 21.715 15.2038 20.9268C16.1547 19.9155 17.3347 17.9894 17.9358 16.1419C17.9358 16.1419 14.9258 14.9794 14.9622 11.6287C14.9924 8.85134 17.3509 7.48529 17.3509 7.48529C17.3509 7.48529 15.9735 5.28906 13.0453 5.28906C11.0226 5.30419 10.1169 6.34493 9.12452 6.33813Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Logo + New here */}
            <div className="w-full flex flex-col items-center mt-auto pt-12 pb-4">
                <img
                    src="/noteroom.png"
                    alt="NoteRoom Logo"
                    className="w-36 h-12 object-contain mb-4"
                />
                <div className="text-center">
                    <span className="text-zinc-600 text-sm font-medium">New here? </span>
                    <Link href="/signup" className="text-sky-500 text-sm font-semibold hover:underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    )
}
