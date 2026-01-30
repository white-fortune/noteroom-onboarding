"use client"

import OTPInput from "@/components/OTPInput"
import AuthButton from "../AuthButton"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function OTPForm({ primaryText, secondaryText }: { primaryText: string, secondaryText: string }) {
    const [_otpValue, setOtpValue] = useState<Array<string>>(Array.from({ length: 6 }, () => ""),);
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const router = useRouter()

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)

            const otpValue = _otpValue.join("")
            const response = await fetch("/api/password-reset/verify", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ otp: otpValue })
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
            console.error(error)
        }
    }

    useEffect(() => {
        setDisabled(_otpValue.join("").length !== 6)
    }, [_otpValue])

    return (
        <form className="flex flex-col h-full" onSubmit={handleSubmit}>
            <h1 className="text-neutral-800 text-2xl font-bold font-space leading-8 mb-2 max-lg:text-center">
                {primaryText}
            </h1>
            <p className="text-sm text-slate-500 mb-8 font-normal font-inter leading-relaxed max-lg:text-center">
                {secondaryText}
            </p>

            <div className="flex-1 flex flex-col gap-8 items-center">
                <OTPInput
                    length={6}
                    otpValue={[_otpValue, setOtpValue]}
                />

                {apiError && (
                    <p className="text-red-500 text-sm text-center">{apiError}</p>
                )}

                <AuthButton label={loadingSubmit ? "Verifing Email..." : "Verify Email"} disabled={loadingSubmit || disabled} />
            </div>
        </form>
    )
}