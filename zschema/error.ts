import { $ZodIssue } from "zod/v4/core";

export default function emitErrors<T extends Record<string, string>>(issues: $ZodIssue[], defaultField?: string): Required<T> {
    const errors: Partial<T> = {}
    issues.forEach(issue => {
        const field = (issue.path[0] || defaultField) as keyof T
        const message = issue.message as T[keyof T]
        errors[field] = message
    })
    return errors as Required<T>
}
