import mongoose, { model, models } from "mongoose"
import { userIdentities, TAuthUser } from "@/types/auth_user"

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
