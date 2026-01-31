"use client"

import AuthButton from "@/components/AuthButton"
import AuthInput from "@/components/AuthInput"
import { DesktopFooterContent } from "@/components/auth/FooterContent"
import ThirdPartyAuthProviderSection from "@/components/auth/ThirdPartyAuthProvider"
import useSignin from "@/hooks/useSignin"
import Link from "next/link"

export default function DesktopSigninForm() {
    const {
        form: [form, setForm], 
        fieldError: [fieldError], 
        apiError: [apiError, setApiError], 
        loadingSubmit: [loadingSubmit, setLoadingSubmit], 
        focusedField: [focusedField, setFocusedField],
        handleSubmit, 
        disabled
    } = useSignin()

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="text-neutral-800 text-2xl font-bold font-space leading-8 mb-8">
                Sign in
            </div>

            <div className="relative mb-6">
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

            <div className="relative mb-6">
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

            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/password-reset"
                    className="text-zinc-700 text-sm hover:underline cursor-pointer"
                >
                    Forgot password?
                </Link>
                <div className="flex items-center gap-1.5">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        className="w-4 h-4 text-sky-400 rounded focus:ring-sky-500 cursor-pointer"
                    />
                    <label
                        htmlFor="rememberMe"
                        className="text-gray-800 text-sm cursor-pointer select-none"
                    >
                        Remember me
                    </label>
                </div>
            </div>

            {apiError && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {apiError}
                </p>
            )}

            <AuthButton label={loadingSubmit ? "Sign In..." : "Sign In"} disabled={loadingSubmit || disabled} />

            <div className="flex items-center justify-center my-8 gap-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    or
                </div>
                <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <ThirdPartyAuthProviderSection setApiError={setApiError} setLoadingSubmit={setLoadingSubmit} />

            <div className="text-center mb-8">
                <span className="text-neutral-800 text-sm font-normal">
                    New here?{" "}
                </span>
                <Link
                    href="/signup"
                    className="text-sky-500 text-sm font-semibold hover:underline"
                >
                    Sign Up
                </Link>
            </div>

            <DesktopFooterContent />
        </form>
    )
}
