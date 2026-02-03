"use client"
import Link from "next/link"
import { useState } from "react"
import DatePicker from "@/components/DatePicker"
import { motion, AnimatePresence } from "framer-motion"

type Step = 1 | 2 | 3

interface IdentityOption {
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
        description: "I’m here to explore ideas, learn independently, or engage in discussions"
    }
]

export default function OnboardPage() {
    const [step, setStep] = useState<Step>(1)
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
    const [identity, setIdentity] = useState<IdentityOption["id"] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleBack = () => {
        if (step > 1) {
            setStep((prev) => (prev - 1) as Step)
            setError(null)
        }
    }

    const saveOnboardingData = async (data: any) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/onboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const result = await response.json()
            if (result.ok) {
                return true
            } else {
                setError(result.message || "Failed to save data")
                return false
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleDOBContinue = async () => {
        if (!dateOfBirth) return
        const success = await saveOnboardingData({ birthDate: dateOfBirth })
        if (success) setStep(2)
    }

    const handleIdentityContinue = async () => {
        if (!identity) return
        const success = await saveOnboardingData({ identity })
        if (success) {
            alert("Identity saved!")
            // setStep(3) // Move to Interests step when implemented
        }
    }

    const handleSkipIdentity = () => {
        setStep(3)
    }

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 md:p-8">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full max-w-[589px] flex flex-col gap-8 md:gap-11"
                    >
                        {/* Header Step 1 */}
                        <div className="flex flex-col gap-4 md:gap-6 w-full">
                            <Link href="/signup" className="group flex items-end gap-1 cursor-pointer w-fit">
                                <BackIcon />
                                <div className="text-zinc-600 text-lg md:text-xl font-normal font-['Inter']">Back</div>
                            </Link>
                            <div className="w-full">
                                <span className="text-neutral-400 text-lg md:text-xl font-bold font-['Inter']">Nice to meet you, </span>
                                <span className="text-black text-lg md:text-xl font-bold font-['Inter']">Jalal!</span>
                                <span className="text-neutral-400 text-lg md:text-xl font-bold font-['Inter']"> 👋 Let’s set things up.</span>
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
                                <DatePicker value={dateOfBirth} onChange={setDateOfBirth} />
                                {error && <ErrorMsg message={error} />}
                                <ContinueButton 
                                    onClick={handleDOBContinue} 
                                    disabled={!dateOfBirth || loading} 
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-[620px] flex flex-col gap-6 md:gap-8 relative"
                    >
                        {/* Back Button */}
                        <button onClick={handleBack} className="group flex items-end gap-1 cursor-pointer w-fit mb-2">
                            <BackIcon />
                            <div className="text-zinc-600 text-base md:text-xl font-normal font-['Inter']">Back</div>
                        </button>

                        <div className="w-full">
                            <h1 className="text-xl md:text-4xl font-bold font-['Inter'] leading-tight text-zinc-800">
                                How would you like to introduce yourself?
                            </h1>
                        </div>

                        <div className="flex flex-col gap-6 md:gap-10">
                            <div className="flex flex-col gap-4 md:gap-6">
                                <div className="grid grid-cols-2 gap-3 md:gap-6">
                                    {IDENTITY_OPTIONS.slice(0, 4).map((opt) => (
                                        <IdentityCard 
                                            key={opt.id} 
                                            option={opt} 
                                            selected={identity === opt.id} 
                                            onClick={() => setIdentity(opt.id)} 
                                        />
                                    ))}
                                    <IdentityCard 
                                        option={IDENTITY_OPTIONS[4]} 
                                        selected={identity === "other"} 
                                        onClick={() => setIdentity("other")} 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <ContinueButton 
                                    onClick={handleIdentityContinue} 
                                    disabled={!identity || loading} 
                                    loading={loading}
                                />
                                <button 
                                    onClick={handleSkipIdentity}
                                    className="w-full text-center text-gray-800/70 text-sm font-normal font-['Inter'] underline hover:text-gray-900 transition-colors"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-8 bg-white rounded-2xl shadow-sm"
                    >
                        <h1 className="text-2xl font-bold mb-4">Interests Step Coming Soon</h1>
                        <p className="text-gray-500 mb-6">We're building the best experience for you.</p>
                        <button onClick={handleBack} className="text-sky-600 font-semibold hover:underline">Go Back</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function IdentityCard({ option, selected, onClick }: { option: IdentityOption, selected: boolean, onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            className={`
                w-full h-auto min-h-[110px] md:min-h-[144px] px-3 py-3 md:px-4 md:py-4 bg-white rounded-xl md:rounded-2xl cursor-pointer transition-all duration-200
                shadow-[0px_0px_2.4697303771972656px_0px_rgba(0,0,0,0.25)]
                flex flex-col justify-start items-start gap-1 md:gap-2.5
                border-2 ${selected ? 'border-sky-600' : 'border-transparent'}
                hover:shadow-md hover:translate-y-[-2px]
                active:scale-[0.98]
            `}
        >
            <div className={`self-stretch text-base md:text-xl font-bold font-['Inter'] ${selected ? 'text-sky-600' : 'text-gray-800'}`}>
                {option.title}
            </div>
            <div className="self-stretch text-zinc-700 text-xs md:text-base font-normal font-['Inter'] leading-tight md:leading-snug">
                {option.description}
            </div>
        </div>
    )
}

function ContinueButton({ onClick, disabled, loading }: { onClick: () => void, disabled: boolean, loading: boolean }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={!disabled ? { scale: 1.01 } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
            disabled={disabled}
            className={`
                w-full h-14 rounded-md flex items-center justify-center transition-all duration-300
                ${!disabled ? 'bg-sky-600 shadow-lg cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}
            `}
        >
            <span className="text-white text-lg md:text-xl font-medium font-['Inter']">
                {loading ? "Saving..." : "Continue"}
            </span>
        </motion.button>
    )
}

function BackIcon() {
    return (
        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:-translate-x-1 transition-transform">
                <path d="M11.6666 7H2.33331" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.99998 12.8333L1.16665 6.99998L6.99998 1.16665" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

function ErrorMsg({ message }: { message: string }) {
    return <p className="text-red-500 text-sm font-medium">{message}</p>
}