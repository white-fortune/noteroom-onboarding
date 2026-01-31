import z from "zod";
import { EmailSchema, PasswordSchema } from "./partial";

const SigninSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema
})

export type TSigninForm = z.infer<typeof SigninSchema>
export default SigninSchema
