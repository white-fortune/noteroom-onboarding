"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"

export default function DemoTrigger() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const overlayRef = useRef<HTMLDivElement>(null)

    async function handleConfirm() {
        router.refresh()
    }

    useEffect(() => {
        if (!open) return
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = ""
        }
    }, [open])

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-slate-400 hover:text-slate-600 text-xs underline"
            >
                Demo: Remove account
            </button>
            {open && createPortal(
                <div
                    ref={overlayRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="remove-account-title"
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
                    onClick={(e) => e.target === overlayRef.current && setOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="remove-account-title" className="text-lg font-semibold text-slate-900">
                            Remove account?
                        </h2>
                        <p className="text-slate-600 text-sm">
                            You will be signed out. You can sign in again anytime with this account.
                        </p>
                        <div className="flex gap-3 justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                            >
                                Remove account
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
