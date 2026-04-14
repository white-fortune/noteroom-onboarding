import { TEmailVerificationTokenType, TPasswordResetTokenType } from "@/types/tokens"
import { model, models, Schema } from "mongoose"

const discriminatorOptions = {
    discriminatorKey: "tokenType"
} 

const tokenSchema = new Schema({
    tokenID: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    assignedAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
}, discriminatorOptions)
tokenSchema.index({ email: 1, tokenType: 1 }, { unique: true })
const tokenModel = models.auth_tokens || model("auth_tokens", tokenSchema)

const emailVerificationTokenSchema = new Schema<TEmailVerificationTokenType>({
    otp: {
        type: String,
        required: true
    }
})
const emailVerificationTokenModel = tokenModel.discriminators?.email || tokenModel.discriminator("email", emailVerificationTokenSchema)

const passwordResetTokenSchema = new Schema<TPasswordResetTokenType>({})
const passwordResetTokenModel = tokenModel.discriminators?.password_reset || tokenModel.discriminator("password_reset", passwordResetTokenSchema)

export { tokenModel, emailVerificationTokenModel, passwordResetTokenModel }

