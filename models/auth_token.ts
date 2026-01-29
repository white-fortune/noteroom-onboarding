import { model, models, Schema } from "mongoose"
import { nanoid } from "nanoid"

export type TAuthToken = {
    tokenID: string,
    email: string,
    otp: string,
    type: "email" | "reset"
}

const authTokenSchema = new Schema<TAuthToken>({
    tokenID: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(20)
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

const authTokenModel = models.auth_tokens || model("auth_tokens", authTokenSchema)

export { authTokenModel }
