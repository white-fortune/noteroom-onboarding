export default function BackButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className="group flex items-center gap-1 cursor-pointer w-fit" {...props}>
            <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:-translate-x-1 transition-transform">
                    <path d="M11.6666 7H2.33331" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.99998 12.8333L1.16665 6.99998L6.99998 1.16665" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <div className="text-zinc-600 text-lg md:text-xl font-normal font-['Inter']">Back</div>
        </button>
    )
}