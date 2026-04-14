import { nanoid } from "nanoid";
import { emailVerificationTokenModel, passwordResetTokenModel } from "@/models/auth_tokens";
import { TEmailVerificationTokenType, TPasswordResetTokenType } from "@/types/tokens";

export class EmailVerificationTokenService {
    static async createToken(email: string) {
        try {
            const tokenID = nanoid(20);
            const otp = EmailVerificationTokenService.createOTP();

            const document = await emailVerificationTokenModel.findOneAndUpdate(
                { email },
                {
                    $setOnInsert: {
                        tokenID,
                        email,
                        otp
                    }
                },
                {
                    upsert: true,
                    returnDocument: "after"
                }
            ).lean<TEmailVerificationTokenType>()
            if (!document) {
                return { ok: false, error: new Error("Couldn't create/get token") }
            }
            
            return { ok: true, token: { tokenID: document.tokenID, email, otp } };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async deleteTokenByEmail(email: string) {
        try {
            await emailVerificationTokenModel.deleteOne({ email })

            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async getTokenByEmail(email: string) {
        try {
            const token = await emailVerificationTokenModel.findOne({ email }).lean()

            if (!token?.tokenID) {
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


export class PasswordResetTokenService {
    static async createToken(email: string) {
        try {
            const tokenID = nanoid(20)

            const document = await passwordResetTokenModel.findOneAndUpdate(
                { email },
                {
                    $setOnInsert: {
                        tokenID,
                        email
                    }
                },
                {
                    upsert: true,
                    returnDocument: "after"
                }
            ).lean<TPasswordResetTokenType>()
            if (!document) {
                return { ok: false, error: new Error("Couldn't create/get token") }
            }

            return { ok: true, token: document.tokenID };
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async verifyToken(tokenID: string) {
        try {
            const document = await passwordResetTokenModel.exists({ tokenID })
            const response = document ? true : false

            return { ok: true, valid: response }
        } catch (error) {
            return { ok: false, error };
        }
    }

    static async deleteTokenByEmail(email: string) {
        try {
            const deletedResult = await passwordResetTokenModel.deleteOne({ email })
            const response = deletedResult.deletedCount > 0

            return { ok: true, deleted: response }
        } catch (error) {
            return { ok: false, error }
        }
    }

    static async getEmailFromToken(tokenID: string) {
        try {
            const document = await passwordResetTokenModel.findOne({ tokenID }).lean<TPasswordResetTokenType>()
            if (!document) {
                return { ok: false }
            }

            return { ok: true, email: document.email };
        } catch (error) {
            return { ok: false, error };
        }
    }
}

