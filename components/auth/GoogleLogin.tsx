import GoogleLoginProvider from "./GoogleLoginProvider";

export default function GoogleLogin({ setApiError, setLoadingSubmit }: { setApiError: React.Dispatch<React.SetStateAction<string>>, setLoadingSubmit: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className="relative w-full h-12">
            {/* Custom Button from Design */}
            <div className="absolute inset-0 bg-white rounded-md outline -outline-offset-1 outline-slate-200 flex items-center justify-center gap-3 pointer-events-none">
                <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                    <img
                        src="https://app.noteroom.co/google.png"
                        alt="Google Logo"
                        className="w-5.5 h-5.5 object-contain"
                    />
                </div>
                <span className="text-slate-600 text-base font-medium font-inter leading-6">
                    Sign in with Google
                </span>
            </div>

            <GoogleLoginProvider setApiError={setApiError} setLoadingSubmit={setLoadingSubmit} />
        </div>
    )
 }

