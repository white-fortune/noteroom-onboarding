import { authTokenModel } from "@/models/auth_token";

export default class AuthTokenService {
    static async createToken(type: "email" | "reset", email: string) {
        try {
            let token = null
            
            const existingToken = await authTokenModel.findOne({ email, type })
            if (existingToken) {
                token = existingToken
            } else {
                token = await authTokenModel.create({ type, email })
            }
            return { ok: true, token: { ...token.toObject() } }
        } catch (error) {
            return { ok: false, error }
        }
    }

    static async getTokenByTokenID(tokenID: string) {
        try {
            const token = await authTokenModel.findOne({ tokenID })
            if (!token) {
                return { ok: true, token: null }
            }
            return { ok: true, token: { ...token.toObject() }}
        } catch (error) {
            return { ok: false, error }
        }
    }

    static createOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }
}
