"use client"

import GoogleLogin from "./GoogleLogin"

export default function ThirdPartyAuthProviderSection({ setApiError, setLoadingSubmit }: { setApiError: React.Dispatch<React.SetStateAction<string>>, setLoadingSubmit: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className="flex flex-col gap-3 mb-8 w-full max-w-md px-6">
            <GoogleLogin setApiError={setApiError} setLoadingSubmit={setLoadingSubmit} />
            
            <button
                type="button"
                className="w-full h-12 bg-slate-900 rounded-md flex items-center justify-center gap-3 hover:bg-black transition-colors"
            >
                <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.92 11.4C16.92 8.42 19.38 6.9 19.5 6.84C18.1 4.79 15.93 4.5 15.16 4.47C13.3 4.29 11.49 5.58 10.54 5.58C9.59 5.58 8.13 4.51 6.57 4.54C4.54 4.57 2.68 5.72 1.63 7.55C-0.5 11.23 1.09 16.65 3.16 19.64C4.17 21.09 5.37 22.73 6.94 22.67C8.45 22.61 9.02 21.7 10.84 21.7C12.65 21.7 13.18 22.67 14.77 22.64C16.42 22.61 17.44 21.15 18.45 19.67C19.61 17.98 20.1 16.34 20.12 16.25C20.08 16.23 16.92 15.02 16.92 11.4ZM13.84 2.94C14.62 1.99 15.14 0.67 15 0C13.87 0.05 12.5 0.76 11.69 1.7C10.97 2.53 10.33 3.89 10.51 5.52C11.77 5.62 13.06 3.9 13.84 2.94Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <span className="text-white text-base font-medium leading-6 font-inter">
                    Sign in with Apple
                </span>
            </button>
        </div>
    )
}