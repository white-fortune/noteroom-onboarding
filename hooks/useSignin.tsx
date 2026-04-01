import { StateController } from "@/types/global"
import emitErrors from "@/zschema/error"
import SigninSchema, { TSigninForm } from "@/zschema/signin"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

type TFocusedField = { [K in keyof TSigninForm]: boolean }
export default function useSignin(): {
    form: [TSigninForm, (field: keyof TSigninForm, value: string) => void],
    apiError: StateController<string>,
    fieldError: StateController<TSigninForm>,
    focusedField: [TFocusedField, (field: keyof TFocusedField, state: boolean) => void]
    loadingSubmit: StateController<boolean>,
    disabled: boolean,
    handleSubmit: (e: React.SubmitEvent) => void
} {
    const [form, _setForm] = useState<TSigninForm>({ email: "", password: "" })
    const [fieldError, setFieldError] = useState<TSigninForm>({ email: "", password: "" })
    const [focusedField, _setFocusedField] = useState<TFocusedField>({ email: false, password: false })
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const router = useRouter()

    function setForm(field: keyof TSigninForm, value: string) {
        _setForm(prev => ({...prev, [field]: value}))
    }

    function setFocusedField(field: keyof TFocusedField, state: boolean) {
        setApiError("")
        _setFocusedField(prev => ({...prev, [field]: state}))
    }

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)
            const nextURL = sessionStorage.getItem("next")

            const response = await fetch("/api/auth/signin", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(form)
            })
            setLoadingSubmit(false)

            if (!response.ok) {
                return setApiError("Unexpected error occurded. Please try again a bit later");
            }

            const data = await response.json()
            if (!data.ok) {
                if (data.needVerification) {
                    return router.push("/verify/email")
                } else if (data.needOnboarding) {
                    return router.push("/onboard")
                }

                return setApiError(data.message)
            }

            router.replace(nextURL ? nextURL : "https://social.noteroom.co")
        } catch (error) {
            setLoadingSubmit(false)
            return setApiError("Unexpected error occurded. Please try again a bit later");
        }
    }

    useEffect(() => {
        const parsedFormData = SigninSchema.safeParse(form)
        setDisabled(!parsedFormData.success)

        if (!parsedFormData.success) {
            const issues = parsedFormData.error.issues
            const errors = emitErrors<TSigninForm>(issues)
            setFieldError(errors)
        } else {
            setFieldError({ email: "", password: "" })
        }
    }, [form])

    return {
        form: [form, setForm],
        fieldError: [fieldError, setFieldError],
        apiError: [apiError, setApiError],
        focusedField: [focusedField, setFocusedField],
        loadingSubmit: [loadingSubmit, setLoadingSubmit],
        disabled,
        handleSubmit
    }
}
