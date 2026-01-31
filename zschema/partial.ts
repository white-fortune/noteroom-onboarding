import z from "zod";

const EmailSchema = z.email("Please provide a valid email address")
const PasswordSchema = z.string().regex(/\S+/g, "Please provide a non-empty password")
const StrictPasswordSchema = PasswordSchema.min(8, "Password must be at least 8 characters long")

export { EmailSchema, PasswordSchema, StrictPasswordSchema }
