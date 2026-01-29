import mongoose, { model, models } from "mongoose"

export type TAuthUser = {
    name: string,
    email: string,
    password: string,
    username: string,
    authProvider: string | null,
    isVerified: boolean
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
    authProvider: {
        type: String,
        default: null
    }
})
authUserSchema.pre("save", function() {
    if (!this.isNew) return

    if (this.authProvider) {
        this.isVerified = true
    }
})
const authUserModel = models.users || model("users", authUserSchema)

export { authUserModel }
