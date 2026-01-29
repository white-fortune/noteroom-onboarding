import { StateController } from "@/types/global"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

export type TSigninForm = {
    email: string,
    password: string
}
export default function useSignin(): {
    form: [TSigninForm, (field: keyof TSigninForm, value: string) => void],
    apiError: StateController<string>,
    loadingSubmit: StateController<boolean>,
    disabled: boolean,
    handleSubmit: (e: React.SubmitEvent) => void
} {
    const [form, _setForm] = useState<TSigninForm>({ email: "", password: "" })
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const router = useRouter()

    function setForm(field: keyof TSigninForm, value: string) {
        _setForm(prev => ({...prev, [field]: value}))
    }

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)

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
                }

                return setApiError(data.message)
            }

            console.log(data)
        } catch (error) {
            setLoadingSubmit(false)
            return setApiError("Unexpected error occurded. Please try again a bit later");
        }
    }

    useEffect(() => {
        setDisabled(!form.email || !form.password)
    }, [form])

    return {
        form: [form, setForm],
        apiError: [apiError, setApiError],
        loadingSubmit: [loadingSubmit, setLoadingSubmit],
        disabled,
        handleSubmit
    }
}
