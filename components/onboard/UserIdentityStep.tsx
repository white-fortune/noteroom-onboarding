"use client"

import { motion } from "framer-motion"
import ContinueButton from "./ContinueButton"
import BackButton from "./BackButton"
import SkipForNowButton from "./SkipForNowButton"
import { Step, useOnboardingContext } from "./OnboardingClient"

type IdentityOption = {
    id: "teacher" | "student" | "researcher" | "creator" | "other"
    title: string
    description: string
}


const IDENTITY_OPTIONS: IdentityOption[] = [
    {
        id: "teacher",
        title: "Teacher",
        description: "I teach students at a public or private school, college or university"
    },
    {
        id: "student",
        title: "Student",
        description: "I study at a public or private school, college, or university"
    },
    {
        id: "researcher",
        title: "Researcher",
        description: "I research, experiment, and share knowledge through papers and studies"
    },
    {
        id: "creator",
        title: "Creator",
        description: "I create educational content, explain ideas through writing, videos, or courses"
    },
    {
        id: "other",
        title: "Other",
        description: "I'm here to explore ideas, learn independently, or engage in discussions"
    }
]


export default function UserIdentityStep() {
    const { onboardingData: [onboardingData, setOnboardingData ], step: [, setStep] } = useOnboardingContext()!

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-155 flex flex-col gap-6 md:gap-8 relative"
        >
            <BackButton onClick={() => setStep(Step.DOB)} />

            <div className="w-full">
                <h1 className="text-xl md:text-4xl font-bold font-['Inter'] leading-tight text-zinc-800">
                    How would you like to introduce yourself?
                </h1>
            </div>

            <div className="flex flex-col gap-6 md:gap-10">
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                        {IDENTITY_OPTIONS.map((opt) => (
                            <IdentityCard
                                key={opt.id}
                                option={opt}
                                selected={onboardingData.identity === opt.id}
                                onClick={() => setOnboardingData(prev => ({ ...prev, identity: opt.id })) }
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <ContinueButton onClick={() => setStep(Step.UserInterests)} disabled={!onboardingData.identity} />
                    <SkipForNowButton onClick={() => {
                        //NOTE: even if the user selects something, skiping will remove it
                        setOnboardingData(prev => ({ ...prev, identity: null }))
                        setStep(Step.UserInterests)
                    } } />
                </div>
            </div>
        </motion.div>
    )
}

function IdentityCard({ option, selected, onClick }: { option: IdentityOption, selected: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`
                w-full h-auto min-h-27.5 md:min-h-36 px-3 py-3 md:px-4 md:py-4 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-200
                shadow-[0px_0px_2.4697303771972656px_0px_rgba(0,0,0,0.25)]
                flex flex-col justify-start items-start gap-1 md:gap-2.5
                border-2 border-transparent ${selected ? 'bg-[#E1F2FA]' : 'bg-white'}
                hover:shadow-md hover:-translate-y-0.5 hover:border-[#42ACDE]
                active:scale-[0.98]
            `}
        >
            <div className="self-stretch flex items-center gap-2 md:gap-3">
                {selected && (
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="11" fill="#42ACDE" />
                        <path
                            d="M16.2 7.8L9.7 14.3C9.57 14.43 9.41 14.5 9.23 14.5C9.05 14.5 8.89 14.43 8.76 14.3L5.8 11.34C5.53 11.07 5.53 10.63 5.8 10.36C6.07 10.09 6.5 10.09 6.77 10.36L9.23 12.82L15.23 6.82C15.5 6.55 15.93 6.55 16.2 6.82C16.47 7.09 16.47 7.53 16.2 7.8Z"
                            fill="white"
                        />
                    </svg>
                )}
                <div className={`text-base md:text-xl font-bold font-['Inter'] ${selected ? 'text-[#42ACDE]' : 'text-gray-800'}`}>
                    {option.title}
                </div>
            </div>
            <div className="self-stretch text-zinc-700 text-xs md:text-base font-normal font-['Inter'] leading-tight md:leading-snug">
                {option.description}
            </div>
        </div>
    )
}
