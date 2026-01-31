import { $ZodIssue } from "zod/v4/core";

/**
* @param {string} defaultField - When using a single field schema, the `defaultField` will contain the error message of that field. Otherwise the field will be `undefined`
*/
export default function emitErrors<T extends Record<string, string>>(issues: $ZodIssue[], defaultField?: string): Required<T> {
    const errors: Partial<T> = {}
    issues.forEach(issue => {
        const field = (issue.path[0] || defaultField) as keyof T
        const message = issue.message as T[keyof T]
        //NOTE: only storing the first captured error on a field
        if (!errors[field]) {
            errors[field] = message
        }
    })
    return errors as Required<T>
}
