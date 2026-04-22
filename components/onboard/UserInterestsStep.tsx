"use client"

import { motion } from "framer-motion"
import ContinueButton from "./ContinueButton"
import BackButton from "./BackButton"
import SkipForNowButton from "./SkipForNowButton"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Step, useOnboardingContext } from "./OnboardingClient"

type TInterest = {
    id: string,
    label: string
    category?: string
}

export default function UserInterestsStep() {
    const { onboardingData: [onboardingData, setOnboardingData], step: [, setStep] } = useOnboardingContext()!
    const [apiError, setApiError] = useState<string>("")
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [interests, setInterests] = useState<TInterest[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const router = useRouter()

    const toggleInterest = (interestId: string) => {
        setOnboardingData(prev => {
            const hasInterest = prev.interests.includes(interestId)
            return {
                ...prev,
                interests: hasInterest
                    ? prev.interests.filter((id) => id !== interestId)
                    : [...prev.interests, interestId]
            }
        })
    }

    async function handleSubmit(clearInterests: boolean = false) {
        let data = onboardingData

        if (clearInterests) {
            setOnboardingData(prev => ({ ...prev, interests: [] }))
            data = { ...onboardingData, interests: [] }
        }

        const nextURL = sessionStorage.getItem("next")

        try {
            setLoadingSubmit(true)
            const response = await fetch("/api/onboard", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
            setLoadingSubmit(false)

            if (!response.ok) {
                return setApiError("Unexpected error occurded. Please try again a bit later");
            }

            const respData = await response.json()
            if (!respData.ok) {
                return setApiError(respData.message)
            }

            router.replace(nextURL ? nextURL : "https://social.noteroom.co")
        } catch (error) {
            setLoadingSubmit(false)
            return setApiError("Unexpected error occurded. Please try again a bit later");
        }
    }

    useEffect(() => {
        setApiError("")
    }, [onboardingData])

    useEffect(() => {
        async function fetchInterests() {
            try {
                const response = await fetch("/interests.json")
                const data = await response.json()
                setInterests(data)
            } catch (error) {
                setInterests([])
            }
        }

        fetchInterests()
    }, [])

    const categories = [
        "All",
        ...Array.from(new Set(interests.map((interest) => interest.category).filter(Boolean) as string[]))
    ]
    const visibleInterests = selectedCategory === "All"
        ? interests
        : interests.filter((interest) => interest.category === selectedCategory)
    const rows = createTopicRows(visibleInterests)

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-155 flex flex-col gap-6 md:gap-8 relative"
        >
            <BackButton onClick={() => setStep(Step.UserIdentity)} />

            <div className="w-full space-y-3.5 text-center">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-bold font-['Inter'] text-zinc-800">Select topics that interests you</h1>
                    <p className="text-neutral-400 text-lg md:text-xl font-medium font-['Inter']">Select as many as you want</p>
                </div>
            </div>

            <div className="w-full flex flex-col gap-8 md:gap-10">
                <div className="flex flex-col gap-5 md:gap-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1 rounded-sm border text-xs md:text-sm transition-colors ${
                                    category === selectedCategory
                                        ? "bg-sky-100 border-sky-300 text-sky-700"
                                        : "bg-white border-zinc-300 text-zinc-600 hover:border-zinc-400"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-2 md:gap-2.5 min-h-56">
                        {rows.map((row, index) => (
                            <div key={`row-${index}`} className="flex flex-wrap justify-center gap-2 md:gap-2.5">
                                {row.map(({ id, label }) => (
                                    <InterestPill
                                        key={id}
                                        topic={label}
                                        selected={onboardingData.interests.includes(id)}
                                        onClick={() => toggleInterest(id)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
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
                h-7 md:h-8 px-4 min-w-22 rounded-sm border transition-all flex items-center justify-center text-xs md:text-sm font-medium font-['Inter']
                ${selected
                    ? 'border-transparent text-[#42ACDE] bg-[#E1F2FA]'
                    : 'border-zinc-200 text-zinc-600 bg-white hover:border-[#42ACDE]'
                }
                active:scale-[0.97]
            `}
        >
            {topic}
        </button>
    )
}

function createTopicRows(topics: TInterest[]) {
    if (topics.length === 0) return []

    const rows: TInterest[][] = []
    const maxRowSize = Math.min(7, Math.max(4, Math.ceil(Math.sqrt(topics.length))))
    let cursor = 0
    let rowSize = maxRowSize
    let decrementing = true

    while (cursor < topics.length) {
        rows.push(topics.slice(cursor, cursor + rowSize))
        cursor += rowSize

        if (decrementing) {
            rowSize -= 1
            if (rowSize <= 2) decrementing = false
        } else {
            rowSize += 1
            if (rowSize >= maxRowSize) decrementing = true
        }
    }

    return rows
}
