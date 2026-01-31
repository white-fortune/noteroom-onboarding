import { z } from "zod";
import { StrictPasswordSchema } from "./partial";

const ResetPasswordSchema = z.object({
    password: StrictPasswordSchema,
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"]
})
export type TResetPasswordForm = z.infer<typeof ResetPasswordSchema>

export default ResetPasswordSchema
