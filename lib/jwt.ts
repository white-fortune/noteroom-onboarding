import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET!

export default class JWT {
    static createToken(payload: any, secret_: string = secret) {
        return jwt.sign(payload, secret_)
    }

    static verifyToken(token: string, secret_: string = secret) {
        try {
            return jwt.verify(token, secret_)
        } catch (error) {
            return null
        }
    }
}
