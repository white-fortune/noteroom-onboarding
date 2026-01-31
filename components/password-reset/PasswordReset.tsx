"use client"

import { useEffect, useState } from "react";
import AuthButton from "../AuthButton";
import AuthInput from "../AuthInput";
import { useRouter } from "next/navigation";
import ResetPasswordSchema, { TResetPasswordForm } from "@/zschema/reset-password";
import emitErrors from "@/zschema/error";

type TFocusedField = { [K in keyof TResetPasswordForm]: boolean }

export default function PasswordReset() {
    const [form, _setForm] = useState<TResetPasswordForm>({ password: "", confirmPassword: "" })
    const [fieldError, setFieldError] = useState<TResetPasswordForm>({ password: "", confirmPassword: "" })
    const [focusedField, _setFocusedField] = useState<TFocusedField>({ password: false, confirmPassword: false })
    const [disabled, setDisabled] = useState<boolean>(false)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [apiMessage, setApiMessage] = useState<{ type: "error" | "success" | null, message: string }>({ type: null, message: "" })
    const router = useRouter()

    function setForm(field: keyof TResetPasswordForm, value: string) {
        _setForm(prev => ({ ...prev, [field]: value }))
    }

    function setFocusedField(field: keyof TFocusedField, state: boolean) {
        _setFocusedField(prev => ({...prev, [field]: state}))
    }

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)

            const response = await fetch("/api/password-reset/reset", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ password: form.password })
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
                return setApiMessage({
                    type: "error",
                    message: data.message
                })
            }

            setApiMessage({
                type: "success",
                message: "Password was reset successfully. Redirecting to login in 3 seconds..."
            })
            setDisabled(true)
            setTimeout(() => {
                router.replace("/signin")
            }, 3000)
        } catch (error) {
            setLoadingSubmit(false)
            setApiMessage({
                type: "error",
                message: "Unexpected error occurded. Please try again a bit later"
            });
        }
    }

    useEffect(() => {
        const parsedFormData = ResetPasswordSchema.safeParse(form)
        setDisabled(!parsedFormData.success)

        if (!parsedFormData.success) {
            const issues = parsedFormData.error.issues
            const errors = emitErrors<TResetPasswordForm>(issues)
            setFieldError(errors)
        } else {
            setFieldError({ password: "", confirmPassword: "" })
        }
    }, [form])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <h1 className="text-neutral-800 text-2xl font-bold font-space leading-8 mb-2 text-center lg:text-left">
                Set a new password
            </h1>
            <p className="text-sm text-slate-500 mb-8 font-normal font-inter leading-relaxed text-center lg:text-left">
                Enter your new password to complete the reset process
            </p>

            <div className="flex-1 flex flex-col gap-8">
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

                <AuthInput 
                    name="confirm-password" 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={form.confirmPassword}
                    onChange={(e) => setForm("confirmPassword", e.target.value)}
                    error={focusedField.confirmPassword ? fieldError.confirmPassword : ""}
                    onFocus={() => setFocusedField("confirmPassword", true)}
                    onBlur={() => setFocusedField("confirmPassword", false)}
                />

                {apiMessage.message && (
                    <p className={`${apiMessage.type === "error" ? "text-red-500" : "text-green-500"} text-sm text-center`}>{apiMessage.message}</p>
                )}

                <AuthButton label={loadingSubmit ? "Reseting..." : "Reset"} disabled={disabled || loadingSubmit} />
            </div>
        </form>
    )
}