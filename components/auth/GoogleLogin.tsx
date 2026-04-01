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
    const googleSigninButtonID = `google-signin-${useId()}`

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

            router.push("https://social.noteroom.co")
        } catch (error) {
            setLoadingSubmit(false)
            return setApiError("Unexpected error occurded. Please try again a bit later");
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
                document.getElementById(googleSigninButtonID),
                {
                    theme: "outline",
                    size: "large",
                    width: 384, // This should match the w-96 (24rem = 384px) parent
                },
            );
        };
    }, []);

    return (
        <div className="relative w-full h-12">
            {/* Custom Button from Design */}
            <div className="absolute inset-0 bg-white rounded-md outline -outline-offset-1 outline-slate-200 flex items-center justify-center gap-3 pointer-events-none">
                <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                    <img
                        src="/google.png"
                        alt="Google Logo"
                        className="w-5.5 h-5.5 object-contain"
                    />
                </div>
                <span className="text-slate-600 text-base font-medium font-inter leading-6">
                    Sign in with Google
                </span>
            </div>

            {/* Invisible Standard GSI Button Overlay */}
            <div
                id={googleSigninButtonID}
                className="google-signin-btn opacity-0 absolute inset-0 [&>div]:w-full [&>div]:h-full [&_iframe]:w-full [&_iframe]:h-full overflow-hidden"
            ></div>
        </div>
    )
}