import mongoose, { model, models } from "mongoose"


const userIdentities = ["teacher", "student", "researcher", "creator", "other"] as const
export type TUserIdentity = typeof userIdentities[number]

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

const authUserSchema = new mongoose.Schema<TAuthUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    onboarded: {
        type: Boolean,
        default: false
    },
    authProvider: {
        type: String,
        default: null
    },
    identity: {
        type: String,
        enum: userIdentities,
        default: null
    },
    birthDate: {
        type: Date,
        default: null
    },
    authTokenVersion: {
        type: Number, 
        default: 0
    },
    profileImageUrl: {
    	type: String,
     	required: false,
        default: () => {
            const randomAvatar = Math.floor(Math.random() * 4) + 1
            return `/avatars/avatar-${randomAvatar}.png`
        }
    },
    coverImageUrl: {
    	type: String,
     	required: false,
        default: () => {
            return `https://placehold.co/400x600?text=Cover Image`
        }
    }
})
authUserSchema.pre("save", function () {
    if (!this.isNew) return

    //NOTE: if a user signs up with a third-party auth provider, the email will be considered verified
    if (this.authProvider) {
        this.isVerified = true
    }
})
const authUserModel = models.users || model("users", authUserSchema)

export { authUserModel }
