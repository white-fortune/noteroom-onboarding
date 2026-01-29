import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
	preload: true,
});


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
