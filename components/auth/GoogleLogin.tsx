"use client"

import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleLogin({ setApiError, setLoadingSubmit }: { setApiError: React.Dispatch<React.SetStateAction<string>>, setLoadingSubmit: React.Dispatch<React.SetStateAction<boolean>> }) {
    const GOOGLE_CLIENT_ID = "325870811550-gro5cn5gr2hojv4uuo2isdk4uoqskqi1.apps.googleusercontent.com";
    const router = useRouter()
    const id = `google-signin-${useId()}`

    async function handleCredentialResponse(gresponse: any) {
        //FIXME: loading and api-error states aren't working
        try {
            setLoadingSubmit(true)

            const credential = gresponse.credential as string;
            const response = await fetch("/api/auth/google", {
                method: "post",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ credential }),
            });
            setLoadingSubmit(false)

            if (!response.ok) {
				return setApiError("Unexpected error occurded. Please try again a bit later");
            }

            const data = await response.json()
            if (!data.ok) {
                if (data.needOnboarding) {
                    return router.replace("/onboard")
                }
                return setApiError(data.message)
            }

            //go to app
        } catch (error) {
            setLoadingSubmit(false)
        }
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (!window["google"]) return;

            window["google"].accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse
            });

            window["google"].accounts.id.renderButton(
                document.getElementById(id),
                {
                    theme: "outline",
                    size: "large",
                },
            );

            window["google"].accounts.id.prompt();
        };
    }, []);

    return (
        <div className="flex w-full justify-center">
            <div id={id}></div>
        </div>
    )
}