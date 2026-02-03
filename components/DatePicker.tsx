"use client"
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DatePickerProps {
    value?: Date | null
    onChange: (date: Date) => void
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export default function DatePicker({ value, onChange }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [viewDate, setViewDate] = useState(value || new Date(2000, 0, 1)) // Default to year 2000 for DOB
    const containerRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

    const currentYear = viewDate.getFullYear()
    const currentMonth = viewDate.getMonth()
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day)
        onChange(newDate)
        setIsOpen(false)
    }

    const changeMonth = (offset: number) => {
        setViewDate(new Date(currentYear, currentMonth + offset, 1))
    }

    const changeYear = (year: number) => {
        setViewDate(new Date(year, currentMonth, 1))
    }
    
    // Generate years for dropdown (1900 - current year)
    const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse()

    const formattedValue = value 
        ? `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
        : ""

    return (
        <div className="relative w-full" ref={containerRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-14 bg-white rounded border border-neutral-400 flex items-center justify-center px-4 cursor-pointer hover:border-zinc-600 transition-colors"
            >
                <div className="flex items-center gap-3.5">
                    <div className="w-5 h-5 flex justify-center items-center">
                       <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5 8.33333H2.5" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.3333 1.66667V5" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6.66667 1.66667V5" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5Z" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="text-zinc-600 text-base font-semibold font-['Inter']">
                        Date picker: <span className="font-normal text-black ml-1">{formattedValue}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-16 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-[320px]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded">&lt;</button>
                            <div className="font-semibold text-sm flex gap-2">
                                <span>{MONTH_NAMES[currentMonth]}</span>
                                <select 
                                    className="bg-transparent text-black cursor-pointer outline-none"
                                    value={currentYear}
                                    onChange={(e) => changeYear(parseInt(e.target.value))}
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded">&gt;</button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                                <div key={d} className="text-xs text-gray-400 font-medium">{d}</div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const isSelected = value?.getDate() === day && value?.getMonth() === currentMonth && value?.getFullYear() === currentYear
                                const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear

                                return (
                                    <button 
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`
                                            h-9 w-9 text-sm rounded-full flex items-center justify-center transition-colors
                                            ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100 text-zinc-700'}
                                            ${isToday && !isSelected ? 'text-sky-600 font-bold' : ''}
                                        `}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
