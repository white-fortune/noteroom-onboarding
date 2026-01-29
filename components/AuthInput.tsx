export default function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full h-12 px-4 rounded-[10px] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-zinc-700 text-sm`}
            {...props}
        />
    )
}
