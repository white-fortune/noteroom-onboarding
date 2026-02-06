import { authTokenModel, TAuthToken } from "@/models/auth_token";
import { nanoid } from "nanoid";
import redisClient from "./redis";

export default class AuthTokenService {
    static async createToken(type: "email" | "reset", email: string) {
        try {
            const hashKey = `${type === "email" ? "email_verification" : "password_reset"}:${email}`;
            const token: Omit<TAuthToken, "type"> = {
                email,
                tokenID: nanoid(20),
                otp: AuthTokenService.createOTP()
            };

            await redisClient.hset(hashKey, "token", token.tokenID, "otp", token.otp);

            return { ok: true, token };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async getTokenByEmailAndType(type: "email" | "reset", email: string) {
        try {
            const hashKey = `${type === "email" ? "email_verification" : "password_reset"}:${email}`;
            const token = await redisClient.hgetall(hashKey) as { tokenID: string, otp: string }

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
            await redisClient.hdel(hashKey, "token", "otp")

            return { ok: true }
        } catch (error) {
            return { ok: false, error };
        }
    }

    static createOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
