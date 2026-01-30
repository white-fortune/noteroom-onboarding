"use client"

import { StateController } from "@/types/global";
import { useRef } from "react";

interface IOTPInputProps {
    otpValue: StateController<string[]>
    length: number;
}

export default function OTPInput({ length, otpValue: [otpValue, setOtpValue] }: IOTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    function setInputRef(index: number, element: HTMLInputElement) {
        inputRefs.current[index] = element;
    }

    function handleOTPValueChange(index: number, value: string) {
        setOtpValue((prev) => prev.map((v, i) => (i === index ? value : v)));
        inputRefs.current[index < length ? index + 1 : index]?.focus();
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const pastedData = e.clipboardData.getData("text");
        const arrayedData = Array.from(pastedData);
        if (arrayedData.length === length) {
            setOtpValue(arrayedData);
        }
    }

    return (
        <div className={`grid grid-cols-6 gap-3 w-full`}>
            {Array.from({ length }, (_, idx) => idx).map(i => (
                <input
                    key={i}
                    maxLength={1}
                    ref={(el) => setInputRef(i, el!)}
                    value={otpValue[i]}
                    onChange={(e) => handleOTPValueChange(i, e.target.value)}
                    onPaste={handlePaste}
                    className={`
						caret-sky-600 
						aspect-square w-full
						text-center text-xl text-slate-900 font-semibold
						rounded-[10px] border 
						bg-white border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 
						outline-none transition-all
					`}
                    aria-label={`OTP digit ${i + 1}`}
                />
            ))}
        </div>
    )
}