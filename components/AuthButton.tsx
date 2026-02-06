"use client"


interface IAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string
}
export default function AuthButton({ label, ...props }: IAuthButtonProps) {
    return (
        <button
            type="submit"
            className={`w-full max-w-md h-12 bg-sky-600 rounded-[10px] text-white text-sm font-medium transition-colors hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]`}
            {...props}
        >
            { label }
        </button>
    )
}
