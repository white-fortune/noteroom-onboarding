import Link from "next/link";

export default function NotFound() {
    return (
        <div className="relative min-h-screen bg-[#F4F4F2] flex flex-col items-center justify-between overflow-hidden">
            <div className="flex flex-1 items-center justify-center px-6 font-space-grotesk">
                <div className="flex flex-col items-center md:flex-row md:gap-12 lg:gap-20">
                    <h1
                        className="text-[120px] font-medium leading-none tracking-tighter sm:text-[200px] md:text-[280px] lg:text-[352px]"
                        style={{
                            backgroundImage: 'url("/404.jpg")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        404
                    </h1>

                    <div className="hidden h-50 w-px bg-[#C9D5DD] md:block md:h-75 lg:h-87.5" />


                    <p className="mt-6 max-w-[320px] text-center text-xl leading-tight text-black/50 sm:text-2xl md:mt-0 md:text-left lg:text-[36px]">
                        This pause isn&apos;t empty,
                        <br className="hidden sm:block" />
                        it&apos;s space making room for you
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-md px-6 pb-10 flex flex-col gap-4 font-inter">
                <Link
                    href="/sign-up"
                    replace
                    className="w-full max-w-md h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white text-base font-medium hover:bg-sky-700 transition-all active:scale-[0.98]"
                >
                    Create an account
                </Link>

                <Link
                    href="/sign-in"
                    replace
                    className="w-full max-w-md h-12 bg-white rounded-lg outline-1 -outline-offset-1 outline-sky-500 flex items-center justify-center text-sky-500 text-base font-medium hover:bg-sky-50 transition-all active:scale-[0.98]"
                >
                    Continue to Sign In
                </Link>
            </div>

            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#CC2E2E]/5 blur-3xl" />
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#C9D5DD]/20 blur-3xl" />
        </div>

    );
}
