"use client"

import { motion } from "framer-motion"
import ContinueButton from "./ContinueButton"
import BackButton from "./BackButton"
import SkipForNowButton from "./SkipForNowButton"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Step, useOnboardingContext } from "./OnboardingClient"

const INTERESTS = [
    "Travelling", "Music", "Science", "Technology", "Art", "Sports",
    "Cooking", "Photography", "Business", "Fashion", "Gaming",
    "History", "Movies", "Reading", "Health", "Nature", "Finance",
    "Design", "Marketing", "Psychology", "Politics", "Writing",
    "Productivity", "Journaling"
]


export default function UserInterestsStep() {
    const { onboardingData: [onboardingData, setOnboardingData], step: [, setStep] } = useOnboardingContext()!
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const router = useRouter()

    async function handleSubmit(clearInterests: boolean = false) {
        let data = onboardingData

        if (clearInterests) {
            setOnboardingData(prev => ({ ...prev, interests: [] }))
            data = { ...onboardingData, interests: [] }
        }

        try {
            setLoadingSubmit(true)
            const response = await fetch("/api/onboard", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(onboardingData)
            })
            setLoadingSubmit(false)

            if (!response.ok) {
                return setApiError("Unexpected error occurded. Please try again a bit later");
            }

            const respData = await response.json()
            if (!respData.ok) {
                return setApiError(respData.message)
            }

            router.replace("https://app.noteroom.co")
        } catch (error) {
            setLoadingSubmit(true)
            return setApiError("Unexpected error occurded. Please try again a bit later");
        }
    }

    useEffect(() => {
        setApiError("")
    }, [onboardingData])

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-155 flex flex-col gap-6 md:gap-8 relative"
        >
            <BackButton onClick={() => setStep(Step.UserIdentity)} />

            <div className="w-full space-y-3.5">
                <div className="text-neutral-400 text-lg md:text-xl font-bold font-['Inter']">Personalize your feed</div>
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-bold font-['Inter'] text-zinc-800">What topics interest you?</h1>
                    <p className="text-neutral-400 text-lg md:text-xl font-medium font-['Inter']">Select as many as you want</p>
                </div>
            </div>

            <div className="flex flex-col gap-8 md:gap-10">
                <div className="flex flex-wrap gap-2 md:gap-3 justify-start items-center overflow-x-hidden">
                    {INTERESTS.map((topic) => (
                        <InterestPill
                            key={topic}
                            topic={topic}
                            selected={onboardingData.interests.includes(topic)}
                            onClick={() => setOnboardingData(prev => ({ ...prev, interests: [...new Set([...prev.interests, topic])] }))}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    {apiError && (
                        <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
                    )}
                    <ContinueButton onClick={() => handleSubmit()} loading={loadingSubmit} disabled={loadingSubmit || onboardingData.interests.length === 0} />
                    <SkipForNowButton onClick={() => {
                        //NOTE: even if the user selects something, skiping will remove it
                        handleSubmit(true)
                    }} />
                </div>
            </div>
        </motion.div>
    )
}

function InterestPill({ topic, selected, onClick }: { topic: string, selected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`
                h-11 px-8 min-w-30 bg-white rounded-md border-[1.23px] transition-all flex items-center justify-center text-base font-medium font-['Inter']
                ${selected
                    ? 'border-sky-600 text-sky-600'
                    : 'border-black/10 text-zinc-500 hover:border-black/30'
                }
                active:scale-[0.97]
            `}
        >
            {topic}
        </button>
    )
}
