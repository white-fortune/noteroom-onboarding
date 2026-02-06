import { nanoid } from "nanoid";
import redisClient from "./redis";

export default class AuthTokenService {
    //CRITICAL: create password reset record with the key `password_reset:tokenID`
    //CRITICAL: separate and clean implementation of email-verification and password-reset token CRUD
    
    static async createToken(type: "email" | "reset", email: string) {
        try {
            const tokenID = nanoid(20);

            if (type === "email") {
                const hashKey = `email_verification:${email}`;
                const otp = AuthTokenService.createOTP();

                await redisClient.hset(hashKey, "token", tokenID, "otp", otp);

                return { ok: true, token: { tokenID, email, otp } };
            }

            await redisClient.setex(tokenID, 3600, email);
            return { ok: true, token: { tokenID, email } };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async verifyTokenByTokenID(tokenID: string) {
        try {
            const response = await redisClient.exists(tokenID);
            return { ok: response === 1 };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async getEmailByResetTokenID(tokenID: string) {
        try {
            const email = await redisClient.get(tokenID);
            return { ok: true, email };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async getTokenByEmailAndType(type: "email" | "reset", email: string) {
        try {
            const hashKey = `${type === "email" ? "email_verification" : "password_reset"}:${email}`;
            const token = (await redisClient.hgetall(hashKey)) as { tokenID: string; otp: string };

            if (!token) {
                return { ok: true, token: null };
            }
            return { ok: true, token: { ...token, email } };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async deleteTokenByEmailAndType(type: "email" | "reset", email: string) {
        try {
            const hashKey = `${type === "email" ? "email_verification" : "password_reset"}:${email}`;
            await redisClient.hdel(hashKey, "token", "otp");

            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async deleteTokenByTokenID(tokenID: string) {
        try {
            const response = await redisClient.del(tokenID)
            return { ok: response === 1 }
        } catch (error) {
            return { ok: false, error }
        }
    }

    static createOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
