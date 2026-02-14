export const userIdentities = ["teacher", "student", "researcher", "creator", "other"] as const
export type TUserIdentity = typeof userIdentities[number]

//NOTE: Core user type. Every type related to users must derive from this type
export type TAuthUser = {
    name: string,
    email: string,
    password: string,
    username: string,
    authProvider: string | null,
    isVerified: boolean,
    onboarded: boolean,
    identity: TUserIdentity | null,
    birthDate: Date | null,
    profileImageUrl: string,
    coverImageUrl: string,
    authTokenVersion: number
}

export type TJWTUser = Pick<TAuthUser, "email" | "name" | "username" | "authTokenVersion"> & { _id: string }
export type TOnboardingUser = Pick<TAuthUser, "email" | "name"> & { _id: string }

