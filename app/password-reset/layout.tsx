import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Password Reset"
}

export default function PasswordResetLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-inter">
            {/* Desktop Design */}
            <div className="hidden lg:grid w-full max-w-300 grid-cols-2 gap-20 items-center p-4">
                {/* Left Content */}
                <div className="flex flex-col justify-start items-start gap-5">
                    <img
                        className="w-auto h-12 object-contain"
                        src="/noteroom.png"
                        alt="NoteRoom Logo"
                    />
                    <div className="justify-start">
                        <span className="text-slate-900 text-5xl font-bold font-space leading-tight block">
                            Recover your
                        </span>
                        <span className="text-sky-500 text-5xl font-bold font-space leading-tight block">
                            Password
                        </span>
                    </div>
                    <div className="text-slate-500 text-xl font-normal leading-7 max-w-115.75">
                        Don't worry, happens to the best of us.
                    </div>
                </div>

                {/* Right Content - Form Card */}
                <div className="w-full max-w-121.75 bg-white rounded-[20px] shadow-sm p-10 mx-auto">
                    { children }
                </div>
            </div>

            {/* Mobile Design */}
            <div className="lg:hidden w-full min-h-screen bg-white flex flex-col p-6">
                <div className="w-full flex justify-center mb-8 mt-4">
                    <img
                        className="w-auto h-10 object-contain"
                        src="/noteroom.png"
                        alt="NoteRoom Logo"
                    />
                </div>
                { children }
            </div>
        </div>
    )
}
