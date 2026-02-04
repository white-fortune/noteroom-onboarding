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
}

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
    }
})
authUserSchema.pre("save", function () {
    if (!this.isNew) return

    if (this.authProvider) {
        this.isVerified = true
    }
})
const authUserModel = models.users || model("users", authUserSchema)

export { authUserModel }
