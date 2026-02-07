import { nanoid } from "nanoid";
import redisClient from "./redis";
import PASETO from "./paseto";

//NOTE: hash = ev:email { tokenID, otp }
export class EmailVerificationTokenService {
    private static TOKEN_EXPIRY_SECONDS = 3600;

    static async createToken(email: string) {
        try {
            const tokenID = nanoid(20);
            const otp = EmailVerificationTokenService.createOTP();

            await redisClient
                .multi()
                .hset(`ev:${email}`, "tokenID", tokenID, "otp", otp)
                .expire(`ev:${email}`, this.TOKEN_EXPIRY_SECONDS)
                .exec();

            return { ok: true, token: { tokenID, email, otp } };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async deleteTokenByEmail(email: string) {
        try {
            await redisClient.hdel(`ev:${email}`, "tokenID", "otp");
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async getTokenByEmail(email: string) {
        try {
            const token = (await redisClient.hgetall(`ev:${email}`)) as { tokenID: string; otp: string };

            if (!token.tokenID) {
                return { ok: true, token: null };
            }
            return { ok: true, token: { ...token, email } };
        } catch (error) {
            return { ok: false, error };
        }
    }

    private static createOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}


//NOTE: variable = pr:email 1
export class PasswordResetTokenService {
    private static TOKEN_EXPIRY_SECONDS = 3600;

    static async createToken(email: string) {
        try {
            const token = {
                e: email,
            };
            const encrypted = await PASETO.encrypt(token, true);
            await redisClient.setex(`pr:${email}`, this.TOKEN_EXPIRY_SECONDS, 1)

            return { ok: true, token: encrypted };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async verifyToken(token: string) {
        try {
            const decrypted = (await PASETO.decrypt(token, true)) as { e: string };
            const response = await redisClient.exists(`pr:${decrypted.e}`)
            return { ok: true, valid: response === 1 }
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async deleteTokenByEmail(email: string) {
        try {
            const response = await redisClient.del(`pr:${email}`)
            return { ok: true, deleted: response === 1 }
        } catch (error) {
            return { ok: false, error }
        }
    }

    static async getEmailFromToken(token: string) {
        try {
            const payload = await PASETO.decrypt(token, true);
            return { ok: true, email: payload.e as string };
        } catch (error) {
            return { ok: false, error };
        }
    }
}
