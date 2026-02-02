"use client"

import { useEffect, useState } from "react"
import AuthButton from "../AuthButton"
import AuthInput from "../AuthInput"
import { useRouter } from "next/navigation"
import { EmailSchema } from "@/zschema/partial"
import emitErrors from "@/zschema/error"

export default function EmailStageForm() {
    const [email, setEmail] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [apiError, setApiError] = useState<string>("")
    const [fieldError, setFieldError] = useState<string>("")
    const [focusedInput, setFocusedInput] = useState<boolean>(false)
    const router = useRouter()

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)

            const response = await fetch("/api/password-reset/request", {
                method: "post",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            setLoadingSubmit(false)

            if (!response.ok) {
                return setApiError("Unexpected error occurded. Please try again a bit later");
            }

            const data = await response.json()
            if (!data.ok) {
                return setApiError(data.message)
            }

            const redirect = data.redirect
            router.push(redirect)
        } catch (error) {
            setLoadingSubmit(false)
            setApiError("Unexpected error occurded. Please try again a bit later");
        }
    }

    useEffect(() => {
        const parsedFormData = EmailSchema.safeParse(email)
        setDisabled(!parsedFormData.success)

        if (!parsedFormData.success) {
            const issues = parsedFormData.error.issues
            const errors = emitErrors<{ email: string }>(issues, "email")
            setFieldError(errors.email)
        } else {
            setFieldError("")
        }
    }, [email])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full items-center">
            <div className="text-neutral-800 text-2xl font-bold font-space leading-8 mb-2 text-center lg:text-left">
                Forgot Password
            </div>
            <p className="text-sm text-slate-500 mb-8 font-normal font-inter leading-relaxed text-center lg:text-left">
                Enter your email to reset your password. We will send you a verification
                code.
            </p>

            <div className="w-full group mb-6">
                <AuthInput
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={focusedInput ? fieldError : ""}
                    onFocus={() => {
                        setFocusedInput(true)
                        setApiError("")
                    }}
                    onBlur={() => setFocusedInput(false)}
                />
            </div>

            {apiError && (
                <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
            )}

            <AuthButton label={loadingSubmit ? "Submiting..." : "Submit"} disabled={loadingSubmit || disabled} />
        </form>
    )
}
