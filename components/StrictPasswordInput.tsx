"use client"

import AuthInput from "./AuthInput"

export default function StrictPasswordInput() {
    return (
        <>
            <div className="relative">
                <div className="relative w-full">
                    <AuthInput name="password" type="password" placeholder="Password" />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                    </button>
                </div>
            </div>

            {/* {isPasswordFocused && (
                <div className="mt-3 flex flex-col gap-1.5 px-1">
                    {[
                        { key: "minLength", label: "Minimum 6 characters" },
                        { key: "upperCase", label: "At least 1 uppercase letter" },
                        { key: "lowerCase", label: "At least 1 lowercase letter" },
                        { key: "number", label: "At least 1 number" },
                    ].map((item) => (
                        <div
                            key={item.key}
                            className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${passwordCriteria[item.key as keyof typeof passwordCriteria]
                                    ? "text-sky-600"
                                    : "text-slate-400"
                                }`}
                        >
                            <div
                                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${passwordCriteria[item.key as keyof typeof passwordCriteria]
                                        ? "bg-sky-600 border-sky-600"
                                        : "bg-transparent border-slate-300"
                                    }`}
                            >
                                {passwordCriteria[
                                    item.key as keyof typeof passwordCriteria
                                ] && (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-2.5 h-2.5 text-white stroke-[4px] stroke-current"
                                        >
                                            <path
                                                d="M20 6L9 17L4 12"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                            </div>
                            {item.label}
                        </div>
                    ))}
                </div>
            )} */}
        </>
    )
}