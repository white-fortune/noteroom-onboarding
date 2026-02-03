"use client"

import { createContext, useContext, useState } from "react"
import { AnimatePresence } from "framer-motion"
import DOBStep from "@/components/onboard/DOBStep"
import UserIdentityStep from "@/components/onboard/UserIdentityStep"
import UserInterestsStep from "@/components/onboard/UserInterestsStep"
import { StateController } from "@/types/global"

export enum Step { DOB, UserIdentity, UserInterests }
type TOnboardingData = {
    dob: string,
    identity: string | null,
    interests: string[]
}
type TOnboardingContext = {
    onboardingData: StateController<TOnboardingData>
    step: StateController<Step>
}

const OnboardingContext = createContext<TOnboardingContext | null>(null)
export function useOnboardingContext() {
    return useContext(OnboardingContext)
}

export default function OnboardPage() {
    const [step, setStep] = useState<Step>(Step.DOB)
    const [onboardingData, setOnboardingData] = useState<TOnboardingData>({ dob: "", identity: null, interests: [] })

    return (
        <OnboardingContext value={{
            step: [step, setStep],
            onboardingData: [onboardingData, setOnboardingData]
        }}>
            <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 md:p-8">
                <AnimatePresence mode="wait">
                    {step === Step.DOB && <DOBStep />}
                    {step === Step.UserIdentity && <UserIdentityStep />}
                    {step === Step.UserInterests && <UserInterestsStep />}
                </AnimatePresence>
            </div>
        </OnboardingContext>
    )
}
