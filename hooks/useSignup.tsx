import { StateController } from "@/types/global"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export type TSignupForm = {
    name: string,
    email: string,
    password: string
}
export default function useSignup(): {
    form: [TSignupForm, (field: keyof TSignupForm, value: string) => void],
    apiError: StateController<string>,
    loadingSubmit: StateController<boolean>,
    disabled: boolean,
    handleSubmit: (e: React.SubmitEvent) => void
} {
    const [form, _setForm] = useState<TSignupForm>({
        name: "",
        email: "",
        password: ""
    })
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)

    const router = useRouter()

    async function handleSubmit(e: React.SubmitEvent) {
        try {
            e.preventDefault()
            setLoadingSubmit(true)

            const response = await fetch("/api/auth/signup", {
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
                return setApiError(data.message)
            }

            const redirect = data.redirect
            router.replace(redirect)
        } catch (error) {
            setLoadingSubmit(false)
            console.error(error)
        }
    }

    function setForm(field: keyof TSignupForm, value: string) {
        _setForm(prev => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        setDisabled(!form.name || !form.password || !form.email)
    }, [form])

    return {
        form: [form, setForm],
        apiError: [apiError, setApiError],
        loadingSubmit: [loadingSubmit, setLoadingSubmit],
        disabled,
        handleSubmit
    }
}
