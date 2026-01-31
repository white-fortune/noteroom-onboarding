import MobileWelcome from "@/components/auth/MobileWelcome";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Welcome"
}

export default function WelcomePage() {
    return (
        <div className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-inter">
            <div className="lg:hidden w-full min-h-screen bg-white flex flex-col">
                <MobileWelcome />
            </div>
        </div>
    )
}
