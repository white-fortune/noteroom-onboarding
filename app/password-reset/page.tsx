import EmailStageForm from "@/components/password-reset/EmailStageForm";
import { Suspense } from "react";

export default function PasswordResetPage() {
    return (
        <Suspense>
            <EmailStageForm />
        </Suspense>
    )
}
