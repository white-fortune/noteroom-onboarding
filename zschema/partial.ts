import z from "zod";

const EmailSchema = z.email("Please provide a valid email address")
const PasswordSchema = z.string().regex(/\S+/g, "Please provide a non-empty password")

export { EmailSchema, PasswordSchema }
