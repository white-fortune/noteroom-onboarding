"use client"

import AuthButton from "@/components/AuthButton"
import AuthInput from "@/components/AuthInput"
import MobileHeader from "@/components/auth/MobileHeader"
import ThirdPartyAuthProviderSection from "@/components/auth/ThirdPartyAuthProvider"
import MobileSessionUserProfile from "@/components/signin/MobileSessionUserProfile"
import useSignin from "@/hooks/useSignin"
import { AnimatePresence, motion } from "framer-motion"
import { JwtPayload } from "jsonwebtoken"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function MobileSignIn({ user, nextURL }: { user: JwtPayload | null, nextURL: string | undefined }) {
    const {
        form: [form, setForm], 
        fieldError: [fieldError], 
        apiError: [apiError, setApiError], 
        loadingSubmit: [loadingSubmit, setLoadingSubmit], 
        focusedField: [focusedField, setFocusedField],
        handleSubmit, 
        disabled
    } = useSignin()

    const [showSessionUser, setShowSessionUser] = useState<boolean>(!!user)

    useEffect(() => {
        if (nextURL) {
            sessionStorage.setItem("next", nextURL)
        } else {
            sessionStorage.removeItem("next")
        }
    }, [nextURL])

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col pt-0"
            >
                {/* Header */}
                <MobileHeader title="Sign In" />

                {/* Form Content */}
                {showSessionUser && user ? (
                    <MobileSessionUserProfile
                        user={user!}
                        setShowSessionUser={setShowSessionUser}
                        setApiError={setApiError}
                        setLoadingSubmit={setLoadingSubmit}
                    />
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 flex flex-col items-center pt-8 gap-8 overflow-y-auto relative z-40 pb-4"
                    >
                        <div className="flex flex-col gap-4 px-6 w-full items-center">
                            <div className="w-full max-w-md group">
                                <AuthInput 
                                    name="email" 
                                    type="email" 
                                    placeholder="Email Address" 
                                    value={form.email} 
                                    onChange={(e) => setForm("email", e.target.value)} 
                                    error={focusedField.email ? fieldError.email : ""}
                                    onFocus={() => setFocusedField("email", true)}
                                    onBlur={() => setFocusedField("email", false)}
                                />
                            </div>

                            <div className="w-full max-w-md group">
                                <AuthInput 
                                    name="password" 
                                    type="password" 
                                    placeholder="Password" 
                                    value={form.password}
                                    onChange={(e) => setForm("password", e.target.value)}
                                    error={focusedField.password ? fieldError.password : ""}
                                    onFocus={() => setFocusedField("password", true)}
                                    onBlur={() => setFocusedField("password", false)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 items-center w-full px-6">
                            <AuthButton label={loadingSubmit ? "Sign In..." : "Sign In"} disabled={loadingSubmit || disabled} />
                            <Link
                                href="/password-reset"
                                className="text-sky-500 text-sm font-semibold hover:underline"
                            >
                                Forgotten Password?
                            </Link>
                        </div>

                        {apiError && (
                            <p className="text-red-500 text-xs text-center -mt-4 bg-red-50 px-4 py-2 rounded-md border border-red-100 w-full max-w-md mx-6">
                                {apiError}
                            </p>
                        )}

                        <div className="w-full max-w-md px-6 h-6 relative flex justify-center items-center">
                            <div className="w-full h-px bg-slate-200 absolute"></div>
                            <div className="bg-white px-3.5 py-1 rounded-3xl relative z-10">
                                <span className="text-slate-500 text-[10px] font-semibold uppercase leading-4 tracking-wider">
                                    or
                                </span>
                            </div>
                        </div>

                        <ThirdPartyAuthProviderSection setApiError={setApiError} setLoadingSubmit={setLoadingSubmit} />

                        <div className="w-full flex flex-col items-center gap-6 mt-auto">
                            <div className="flex flex-col items-center gap-1 mb-4">
                                <img
                                    src="/noteroom.png"
                                    alt="NoteRoom Logo"
                                    className="w-36 h-12 object-contain"
                                />
                                <div className="text-center">
                                    <span className="text-zinc-600 text-sm font-medium">
                                        New here?{" "}
                                    </span>
                                    <Link
                                        href="/sign-up"
                                        className="text-sky-500 text-sm font-semibold hover:underline"
                                    >
                                        Create an account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                ) }

            </motion.div>
        </AnimatePresence>
    )
}
