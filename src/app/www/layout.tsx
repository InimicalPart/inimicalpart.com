import "@/styles/globals.css";
import { Viewport } from "next";
import { Providers } from "@/components/providers";
import InimiNavbar from "@/components/navbar";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	const currentYear = new Date().getFullYear();
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<head />
			<body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
				<Providers>
					<div className="relative flex min-h-screen flex-col overflow-x-clip">
						<InimiNavbar/>
						<main className="container mx-auto mb-6 w-full max-w-7xl grow px-5 pt-18 pb-20 sm:px-6">
							{children}
						</main>
						<footer className="sticky bottom-0 mt-auto border-t border-black/10 bg-white/70 py-3 backdrop-blur-md dark:border-white/10 dark:bg-black/50">
							<div className="mx-auto flex w-full max-w-7xl items-center justify-center px-6 text-center text-sm text-neutral-700 dark:text-neutral-300">
								&copy; {currentYear} - <span className="mx-1 font-semibold">Inimi</span> - All rights reserved.
							</div>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
