"use client"

import OTPInput from "@/components/OTPInput"
import AuthButton from "../AuthButton"
import { useEffect, useState } from "react"

export default function OTPForm({ primaryText, secondaryText }: { primaryText: string, secondaryText: string }) {
    const RESEND_TIMEOUT = 20

    const [_otpValue, setOtpValue] = useState<Array<string>>(Array.from({ length: 6 }, () => ""),);
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const [timer, setTimer] = useState<number>(RESEND_TIMEOUT)
    const [loadingResend, setLoadingResend] = useState<boolean>(false)

    function __resendCodeInterval() {
        const id = setInterval(() => {
            setTimer(prev => {
                if (prev >= 1) {
                    return prev - 1
                }
                clearInterval(id)
                return prev
            })
        }, 1000)

        return id
    }

    useEffect(() => {
        const id = __resendCodeInterval()

        return () => clearInterval(id)
    })

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)

            const otpValue = _otpValue.join("")
            const response = await fetch("/api/token/verify", {
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

            console.log(data)
        } catch (error) {
            setLoadingSubmit(false)
            console.error(error)
        }
    }

    async function handleResendCode() {
        try {
            setLoadingResend(true)
        
            const response = await fetch("/api/token/resend", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                }
            })
            setLoadingResend(false)

            if (!response.ok) {
				return setApiError("Unexpected error occurded. Please try again a bit later");
            }

            const data = await response.json()
            if (!data.ok) {
                return setApiError(data.message)
            }

            setTimer(20)
            __resendCodeInterval()
        } catch (error) {
            setLoadingResend(false)
            setApiError("Unexpected error occurded. Please try again a bit later");
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

                <div className="text-center">
                    {timer > 0 ? (
                        <span className="text-slate-400 text-sm font-medium">
                            Resend in {timer}s
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="text-sky-600 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
                            onClick={handleResendCode}
                            disabled={loadingResend}
                        >
                            {loadingResend ? "Resending..." : "Resend Code"}
                        </button>
                    )}
                </div>

                {apiError && (
                    <p className="text-red-500 text-sm text-center">{apiError}</p>
                )}

                <AuthButton label={loadingSubmit ? "Verifing Email..." : "Verify Email"} disabled={loadingSubmit || disabled} />
            </div>
        </form>
    )
}