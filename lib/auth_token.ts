import { nanoid } from "nanoid";
import redisClient from "./redis";


//NOTE: hash = ev:email { tokenID, otp }
export class EmailVerificationTokenService {
    static async createToken(email: string) {
        try {
            const tokenID = nanoid(20);
            const otp = EmailVerificationTokenService.createOTP();

            await redisClient.multi()
                .hset(`ev:${email}`, "tokenID", tokenID, "otp", otp)
                .expire(`ev:${email}`, 3600)
                .exec()

            return { ok: true, token: { tokenID, email, otp } }
        } catch (error) {
            return { ok: false, error }
        }
    }

    static async deleteTokenByEmail(email: string) {
        try {
            await redisClient.hdel(`ev:${email}`, "tokenID", "otp");
            return { ok: true }
        } catch (error) {
            return { ok: false, error }
        }
    }

    static async getTokenByEmail(email: string) {
        try {
            const token = (await redisClient.hgetall(`ev:${email}`)) as { tokenID: string, otp: string };

            if (!token.tokenID) {
                return { ok: true, token: null };
            }
            return { ok: true, token: { ...token, email } };
        } catch (error) {
            return { ok: false, error }
        }
    }

    private static createOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}


//NOTE: variable = pr:tokenID email
export class PasswordResetTokenService {
    static async createToken(email: string) {
        try {
            const tokenID = nanoid(20);

            await redisClient.setex(`pr:${tokenID}`, 3600, email);

            return { ok: true, token: { tokenID, email } };
        } catch (error) {
            return { ok: false, error }
        }
    }

    static async verifyTokenByTokenID(tokenID: string) {
        try {
            const response = await redisClient.exists(`pr:${tokenID}`);
            return { ok: response === 1 };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async deleteTokenByTokenID(tokenID: string) {
        try {
            const response = await redisClient.del(`pr:${tokenID}`)
            return { ok: response === 1 }
        } catch (error) {
            return { ok: false, error }
        }
    }

    static async getEmailByTokenID(tokenID: string) {
        try {
            const email = await redisClient.get(`pr:${tokenID}`);
            return { ok: true, email };
        } catch (error) {
            return { ok: false, error };
        }
    }
}
