import OTPForm from "@/components/verify-email/OTPForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up"
}

export default async function VerifyEmailPage() {
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
                            Verify your
                        </span>
                        <span className="text-sky-500 text-5xl font-bold font-space leading-tight block">
                            Email
                        </span>
                    </div>
                    <div className="text-slate-500 text-xl font-normal leading-7 max-w-115.75">
                        We've sent a 6-digit code to your email.
                    </div>
                </div>

                {/* Right Content - Card */}
                <div className="w-full max-w-121.75 bg-white rounded-[20px] shadow-sm p-10 mx-auto">
                    <OTPForm primaryText="Check your inbox" secondaryText="Enter the code below to complete your registration." />
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

                <OTPForm primaryText="Verify your Email" secondaryText="A 6 digit code has been sent to your email" />
            </div>
        </div>
    )
}
