"use client"

import { useRouter } from "next/navigation"

interface IMobileHeaderProps {
    title: string 
}
export default function MobileHeader({ title }: IMobileHeaderProps) {
    const router = useRouter()

    return (
        <div className="w-full h-14 bg-white shadow-[inset_0px_-0.5px_0px_0px_rgba(226,232,240,1)] flex items-center relative z-40">
            <button
                onClick={() => router.push("/welcome")}
                className="w-16 h-full flex items-center justify-center -ml-2 hover:bg-slate-50 rounded-full transition-colors active:scale-90"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="#0F172A"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-slate-900 text-base font-medium font-space leading-6">
                    {title}
                </span>
            </div>
        </div>
    )
}
