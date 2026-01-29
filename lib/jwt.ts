import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET!

export default class JWT {
    static createToken(payload: any) {
        return jwt.sign(payload, secret)
    }

    static verifyToken(token: string) {
        try {
            return jwt.verify(token, secret)
        } catch (error) {
            return null
        }
    }
}
