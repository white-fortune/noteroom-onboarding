"use client"

import { useEffect, useState } from "react"
import AuthButton from "../AuthButton"
import AuthInput from "../AuthInput"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { EmailSchema } from "@/zschema/partial"
import emitErrors from "@/zschema/error"

export default function EmailStageForm() {
    const [email, setEmail] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [apiMessage, setApiMessage] = useState<{ type: "error" | "success" | null, message: string }>({ type: null, message: "" })
    const [fieldError, setFieldError] = useState<string>("")
    const [focusedInput, setFocusedInput] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

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
                return setApiMessage({
                    type: "error",
                    message: "Unexpected error occurded. Please try again a bit later"
                });
            }

            const data = await response.json()
            if (!data.ok) {
                return setApiMessage(data.message)
            }

            setApiMessage({
                type: "success",
                message: "If an account with this email exists, you will receive a password reset email shortly."
            })
        } catch (error) {
            setLoadingSubmit(false)
            setApiMessage({
                type: "error",
                message: "Unexpected error occurded. Please try again a bit later"
            });
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

    useEffect(() => {
        const errorCode = searchParams.get("code")
        if (errorCode) {
            if (errorCode === "INVALID_CODE") {
                setApiMessage({
                    type: "error",
                    message: "Invalid reset token. Please request again to get a new one"
                })
            }
        }
    }, [searchParams])

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
                        setApiMessage({ type: null, message: "" })
                        router.replace(pathname)
                    }}
                    onBlur={() => setFocusedInput(false)}
                />
            </div>

            {apiMessage.message && (
                <p className={`${apiMessage.type === "error" ? "text-red-500" : "text-green-500"} text-sm text-center mb-4`}>{apiMessage.message}</p>
            )}

            <AuthButton label={loadingSubmit ? "Submiting..." : "Submit"} disabled={loadingSubmit || disabled} />
        </form>
    )
}
