"use client"

import ContinueButton from "./ContinueButton"
import BackButton from "./BackButton"
import { useRouter } from "next/navigation"
import { Step, useOnboardingContext } from "@/components/onboard/OnboardingClient"
import { JwtPayload } from "jsonwebtoken"
import { motion } from "framer-motion"
import Popup from "../Popup"
import { useState } from "react"

export default function DOBStep({ user }: { user: JwtPayload }) {
    const [openPopup, setOpenPopup] = useState<boolean>(false)
    const { onboardingData: [onboardingData, setOnboardingData], step: [, setStep] } = useOnboardingContext()!
    const router = useRouter()

    function handleBack() {
        if (onboardingData.dob || onboardingData.identity || onboardingData.interests.length !== 0) {
            setOpenPopup(true)
        } else {
            router.replace("/sign-in")
        }
    }

    return (
        <>
            <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full max-w-147.25 flex flex-col gap-8 md:gap-11"
            >
                <BackButton onClick={handleBack} />

                <div className="flex flex-col gap-4 md:gap-6 w-full">
                    <div className="w-full">
                        <span className="text-neutral-400 text-lg md:text-xl font-bold font-['Inter']">Nice to meet you, </span>
                        <span className="text-black text-lg md:text-xl font-bold font-['Inter']">{user.name}</span>
                        <span className="text-neutral-400 text-lg md:text-xl font-bold font-['Inter']"> 👋 Let's set things up.</span>
                    </div>
                </div>

                {/* Content Step 1 */}
                <div className="w-full flex flex-col gap-6 md:gap-8">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-zinc-800 text-3xl md:text-4xl font-bold font-['Inter']">Date of birth</h1>
                        <p className="text-neutral-400 text-lg md:text-xl font-medium font-['Inter']">
                            Used only to personalize your experience. Not shown publicly.
                        </p>
                    </div>
                    <div className="flex flex-col gap-7">
                        <div className="flex justify-between items-center text-zinc-600 font-semibold font-['Inter'] border-b py-2 border-neutral-400">
                            <span className="text-xl max-lg:text-sm">Pick your date of birth:</span>
                            <div className="relative inset-0 cursor-pointer">
                                <input className="border p-2 px-4 outline-none rounded" type="date" value={onboardingData.dob} onChange={(e) => setOnboardingData(prev => ({ ...prev, dob: e.target.value }))} />
                            </div>
                        </div>
                        <ContinueButton onClick={() => setStep(Step.UserIdentity)} disabled={!onboardingData.dob} />
                    </div>
                </div>
            </motion.div>

            <Popup 
                texts={{
                    title: "Discard Onboarding Changes?",
                    description: "Your onboarding data will be discarded, you can signin anytime to continue.",
                    primaryActionLabel: "Discard"
                }}
                open={[openPopup, setOpenPopup]} 
                action={() => router.replace("/sign-in")} 
            />
        </>
    )
}

