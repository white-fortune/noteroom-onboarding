"use client"

import { motion } from "framer-motion"
import ContinueButton from "./ContinueButton"
import BackButton from "./BackButton"
import { Step, useOnboardingContext } from "@/app/onboard/page"
import { useRouter } from "next/navigation"

export default function DOBStep() {
    const { onboardingData: [onboardingData, setOnboardingData ], step: [, setStep]} = useOnboardingContext()!
    const router = useRouter()

    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-147.25 flex flex-col gap-8 md:gap-11"
        >
            <BackButton onClick={() => router.replace("/signup")} />

            <div className="flex flex-col gap-4 md:gap-6 w-full">
                <div className="w-full">
                    <span className="text-neutral-400 text-lg md:text-xl font-bold font-['Inter']">Nice to meet you, </span>
                    <span className="text-black text-lg md:text-xl font-bold font-['Inter']">Jalal!</span>
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
                    <input className="font-medium text-lg border p-4" type="date" value={onboardingData.dob} onChange={(e) => setOnboardingData(prev => ({ ...prev, dob: e.target.value }))} />
                    <ContinueButton onClick={() => setStep(Step.UserIdentity)} disabled={!onboardingData.dob} />
                </div>
            </div>
        </motion.div>
    )
}
