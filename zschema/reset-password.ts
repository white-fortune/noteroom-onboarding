import { z } from "zod";
import { PasswordSchema } from "./partial";

const ResetPasswordSchema = z.object({
    password: PasswordSchema,
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"]
})
export type TResetPasswordForm = z.infer<typeof ResetPasswordSchema>

export default ResetPasswordSchema
