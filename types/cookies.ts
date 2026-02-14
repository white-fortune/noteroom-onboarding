import { TJWTUser, TOnboardingUser } from "./auth_user"

export type TEmailVerificationCookie = {
   email: string,
   tokenID: string
}
export type TOnboardingUserCookie = TOnboardingUser
export type TAuthTokenCookie = TJWTUser

