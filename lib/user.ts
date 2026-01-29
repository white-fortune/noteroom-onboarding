import { authUserModel } from "@/models/user";
import connectToDatabase from "./mongodb";
import { OAuth2Client, TokenPayload } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!

export default class UserService {
    static async getAuthenticatedUser(email: string, password: string): Promise<{
        ok: boolean;
        code?: "NOT_VALID_AUTH" | "SERVER_ERROR" | "NOT_VERIFIED";
        user?: any;
        error?: any;
    }> {
        try {
            await connectToDatabase();

            const user = await authUserModel.findOne({ email, password });
            if (!user) {
                return { ok: false, code: "NOT_VALID_AUTH" };
            }
            
            if (!user.isVerified) {
                return { ok: false, code: "NOT_VERIFIED" };
            }

            const userObject = { ...user.toObject() };
            return { ok: true, user: userObject };
        } catch (error) {
            return { ok: false, code: "SERVER_ERROR", error };
        }
    }

    static async verifyGoogleCredential(credential: string): Promise<{
        ok: boolean;
        code?: "NOT_VALID_AUTH" | "SERVER_ERROR";
        payload?: Required<TokenPayload>;
        error?: any;
    }> {
        try {
            const client = new OAuth2Client();
            const token = await client.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID
            });
            const payload = token.getPayload();
            if (!payload) {
                return { ok: false, code: "NOT_VALID_AUTH" };
            }

            return { ok: true, payload: token.getPayload()! as Required<TokenPayload> };
        } catch (error) {
            return { ok: false, code: "SERVER_ERROR", error };
        }
    }

    static generateUsernameFromEmail(email: string) {
        const base = email.split("@")[0].trim().toLowerCase().replace(/[*+~.()'"!:@]/g, "_")
        const suffix_number = Math.floor(1000 + Math.random() * 9000)
        const username = `${base}_${suffix_number}`

        return username
    }
}
