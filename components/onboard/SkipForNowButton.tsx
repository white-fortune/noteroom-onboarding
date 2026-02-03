export default function SkipForNowButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="w-full text-center text-gray-800/70 text-sm font-normal font-['Inter'] underline hover:text-gray-900 transition-colors"
            {...props}
        >
            Skip for now
        </button>
    )
}