export function DesktopFooterContent() {
    return (
        <div className="w-full text-center mt-auto">
            <p className="text-slate-500 text-xs font-normal leading-4">
                By selecting one or the other, you are agreeing to the{" "}
                <a
                    href="https://www.noteroom.co/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 font-semibold hover:underline"
                >
                    Terms of Services
                </a>{" "}
                &{" "}
                <a
                    href="https://www.noteroom.co/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 font-semibold hover:underline"
                >
                    Privacy Policy
                </a>
            </p>
        </div>
    )
}
