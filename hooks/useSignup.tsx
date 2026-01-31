import { StateController } from "@/types/global"
import emitErrors from "@/zschema/error"
import SignupSchema, { TSignupForm } from "@/zschema/signup"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type TFocusedField = { [K in keyof TSignupForm]: boolean }

export default function useSignup(): {
    form: [TSignupForm, (field: keyof TSignupForm, value: string) => void],
    fieldError: StateController<TSignupForm>,
    focusedField: [TFocusedField, (field: keyof TFocusedField, state: boolean) => void]
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
    const [fieldError, setFieldError] = useState<TSignupForm>({ email: "", password: "", name: "" })
    const [focusedField, _setFocusedField] = useState<TFocusedField>({ email: false, password: false, name: false })
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const router = useRouter()

    function setFocusedField(field: keyof TFocusedField, state: boolean) {
        _setFocusedField(prev => ({...prev, [field]: state}))
    }

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
        const parsedFormData = SignupSchema.safeParse(form)
        setDisabled(!parsedFormData.success)

        if (!parsedFormData.success) {
            const issues = parsedFormData.error.issues
            const errors = emitErrors<TSignupForm>(issues)
            setFieldError(errors)
        } else {
            setFieldError({ email: "", password: "", name: "" })
        }
    }, [form])

    return {
        form: [form, setForm],
        fieldError: [fieldError, setFieldError],
        focusedField: [focusedField, setFocusedField],
        apiError: [apiError, setApiError],
        loadingSubmit: [loadingSubmit, setLoadingSubmit],
        disabled,
        handleSubmit
    }
}
