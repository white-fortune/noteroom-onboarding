"use client"

import { motion } from "framer-motion"

export default function ContinueButton({ onClick, disabled }: { onClick?: () => void, disabled: boolean }) {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.01 } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
            className={`
                w-full h-14 rounded-md flex items-center justify-center transition-all duration-300
                bg-sky-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
            `}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="text-white text-lg md:text-xl font-medium font-['Inter']">
                Continue
            </span>
        </motion.button>
    )
}
