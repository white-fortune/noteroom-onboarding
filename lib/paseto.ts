import { V1 } from "paseto"

const secret = Buffer.from(process.env.PASETO_SECRET!, "base64")


export default class PASETO {
    static async encrypt(payload: Record<string, any>, trimmed: boolean = false) {
        const token = await V1.encrypt(payload, secret, {
            iat: false
        })
        if (!trimmed) {
            return token
        }
        return token.split(".")[2]
    }

    static async decrypt(token: string, trimmed: boolean = false) {
        if (!trimmed) {
            return await V1.decrypt(token, secret)
        }

        return await V1.decrypt(`v1.local.${token}`, secret)
    }
}
