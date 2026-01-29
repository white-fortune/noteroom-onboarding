"use client"

import AuthButton from "@/components/AuthButton"
import AuthInput from "@/components/AuthInput"
import { DesktopFooterContent } from "@/components/auth/FooterContent"
import ThirdPartyAuthProviderSection from "@/components/auth/ThirdPartyAuthProvider"
import useSignup from "@/hooks/useSignup"
import Link from "next/link"

export default function DesktopSignUpForm() {
    const { form: [form, setForm], handleSubmit, apiError: [apiError, setApiError], loadingSubmit: [loadingSubmit, setLoadingSubmit], disabled} = useSignup()

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="text-neutral-800 text-2xl font-bold font-space leading-8 mb-8">
                Create account
            </div>

            <div className="w-full group mb-6">
                <AuthInput
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm("name", e.target.value)}
                />
            </div>

            <div className="w-full group mb-6">
                <AuthInput
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm("email", e.target.value)}
                />
            </div>

            <div className="w-full group mb-6">
                <AuthInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm("password", e.target.value)}
                />
            </div>

            {apiError && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {apiError}
                </p>
            )}

            <AuthButton label={loadingSubmit ? "Sign Up..." : "Sign Up"} disabled={loadingSubmit || disabled} />

            <div className="flex items-center justify-center my-8 gap-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    or
                </div>
                <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <ThirdPartyAuthProviderSection setApiError={setApiError} setLoadingSubmit={setLoadingSubmit} />

            <div className="text-center mb-8">
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

            <DesktopFooterContent />
        </form>
    )
}