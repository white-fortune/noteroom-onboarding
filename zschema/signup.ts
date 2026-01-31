import z from "zod";
import { EmailSchema, StrictPasswordSchema } from "./partial";

const SignupSchema = z.object({
    name: z.string().min(4, "Name must be more than 4 characters"),
    email: EmailSchema,
    password: StrictPasswordSchema
})

export type TSignupForm = z.infer<typeof SignupSchema>
export default SignupSchema
