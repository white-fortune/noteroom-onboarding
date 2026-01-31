"use client"

import { useEffect, useState } from "react";
import AuthButton from "../AuthButton";
import AuthInput from "../AuthInput";
import { useRouter } from "next/navigation";

export default function PasswordReset() {
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [apiMessage, setApiMessage] = useState<{ type: "error" | "success" | null, message: string }>({ type: null, message: "" })
    const router = useRouter()

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)

            const response = await fetch("/api/password-reset/reset", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ password })
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
        setDisabled(password.trim().length === 0 || confirmPassword.trim().length === 0 || password.trim() !== confirmPassword.trim())
    }, [password, confirmPassword])

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <AuthInput 
                    name="confirm-password" 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {apiMessage.message && (
                    <p className={`${apiMessage.type === "error" ? "text-red-500" : "text-green-500"} text-sm text-center`}>{apiMessage.message}</p>
                )}

                <AuthButton label={loadingSubmit ? "Reseting..." : "Reset"} disabled={disabled || loadingSubmit} />
            </div>
        </form>
    )
}