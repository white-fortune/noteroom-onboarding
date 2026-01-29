"use client"

import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import MobileHeader from "@/components/auth/MobileHeader";
import ThirdPartyAuthProviderSection from "@/components/auth/ThirdPartyAuthProvider";
import useSignup from "@/hooks/useSignup";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function MobileSignUp() {
    const { form: [form, setForm], handleSubmit, apiError: [apiError, setApiError], loadingSubmit: [loadingSubmit, setLoadingSubmit], disabled} = useSignup()

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
                <MobileHeader title="Sign Up" />

                {/* Form Content */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 flex flex-col items-center pt-8 gap-8 overflow-y-auto relative z-40 pb-4"
                >
                    <div className="flex flex-col gap-4 px-6 w-full items-center">
                        <div className="w-full max-w-md group">
                            <AuthInput
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={(e) => setForm("name", e.target.value)}
                            />
                        </div>

                        <div className="w-full max-w-md group">
                            <AuthInput
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={(e) => setForm("email", e.target.value)}
                            />
                        </div>

                        <div className="w-full max-w-md group">
                            <AuthInput
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm("password", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 items-center w-full px-6">
                        <AuthButton label={loadingSubmit ? "Sign Up..." : "Sign Up"} disabled={loadingSubmit || disabled} />

                        <div className="text-center">
                            <span className="text-zinc-600 text-sm font-medium">
                                Already have an account?{" "}
                            </span>
                            <Link
                                href="/signin"
                                className="text-sky-500 text-sm font-semibold hover:underline"
                            >
                                Sign In
                            </Link>
                        </div>
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

                    {/* Footer Content */}
                    <div className="w-full flex flex-col items-center gap-6 mt-auto">
                        <div className="flex flex-col items-center gap-1 mb-4">
                            <img
                                src="https://app.noteroom.co/noteroom.png"
                                alt="NoteRoom Logo"
                                className="w-36 h-12 object-contain"
                            />
                        </div>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    )
}
