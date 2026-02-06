import PasswordReset from "@/components/password-reset/PasswordReset"
import AuthTokenService from "@/lib/auth_token"
import { redirect } from "next/navigation"

type PageProps = {
    searchParams: Promise<{
        tokenID: string
    }>
}

export default async function ResetStage({ searchParams }: PageProps) {
    const params = await searchParams
    const tokenID = params.tokenID

    const response = await AuthTokenService.verifyTokenByTokenID(tokenID)
    if (!response.ok) {
        redirect("/password-reset?code=INVALID_CODE")
    }

    return (
        <PasswordReset tokenID={tokenID} />
    )
}
