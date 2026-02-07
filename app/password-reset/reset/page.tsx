import PasswordReset from "@/components/password-reset/PasswordReset"
import { PasswordResetTokenService } from "@/lib/auth_token"
import { redirect } from "next/navigation"

type PageProps = {
    searchParams: Promise<{
        token: string
    }>
}

export default async function ResetStage({ searchParams }: PageProps) {
    const params = await searchParams
    const token = params.token

    const response = await PasswordResetTokenService.verifyToken(token)
    if (!response.ok || !response.valid) {
        redirect("/password-reset?code=INVALID_CODE")
    }

    return (
        <PasswordReset token={token} />
    )
}
