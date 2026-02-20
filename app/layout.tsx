import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css"
import { Metadata } from "next";

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

export const metadata: Metadata = {
	metadataBase: new URL("https://onboarding.noteroom.co"),
	title: {
		default: "NoteRoom | Be Where Ideas Are",
		template: "%s | NoteRoom",
	},
	description:
		"NoteRoom is a knowledge first social media platform built for thinkers to learn, explore ideas, and grow through meaningful content.",
	keywords: [
		"Login to NoteRoom",
        "NoteRoom Access",
        "NoteRoom Login",
        "NoteRoom Signin"
	],
	authors: [{ name: "NoteRoom Team" }],
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		title: "NoteRoom | Be Where Ideas Are",
		description:
			"NoteRoom is a knowledge first social media platform built for thinkers to learn, explore ideas, and grow through meaningful content.",
		url: "https://onboarding.noteroom.co",
		siteName: "NoteRoom",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "NoteRoom | Be Where Ideas Are",
		description:
			"NoteRoom is a knowledge first social media platform built for thinkers to learn, explore ideas, and grow through meaningful content.",
	},
    icons: {
		icon: [
			{ url: "/favicon.ico" },
            { url: '/icon.png', type: 'image/png' }
		],
		apple: "/apple-icon.png",
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
	},
};



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
