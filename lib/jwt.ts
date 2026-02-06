import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET!

export default class JWT {
    static createToken(payload: any, secret: string = process.env.JWT_SECRET!) {
        return jwt.sign(payload, secret)
    }

    static verifyToken(token: string, secret: string = process.env.JWT_SECRET!) {
        try {
            return jwt.verify(token, secret)
        } catch (error) {
            return null
        }
    }
}
