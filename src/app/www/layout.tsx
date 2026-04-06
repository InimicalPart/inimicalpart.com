import "@/styles/globals.css";
import { Viewport } from "next";
import { Providers } from "@/components/providers";
import InimiNavbar from "@/components/navbar";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#faf8f4" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
	],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	const currentYear = new Date().getFullYear();
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={`${playfair.variable} ${inter.variable} dark:bg-[#0a0a0a] bg-[#FAF8F4] font-sans antialiased`}>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col min-h-screen">
						<InimiNavbar/>
						<main className="container mx-auto max-w-7xl pt-16 pb-16 px-6 flex-grow mb-5">
							{children}
						</main>
						<footer className="w-full flex items-center justify-center py-3 bg-[#f5f3ee] text-neutral-600 dark:bg-[#0a0a0a] dark:text-neutral-400 border-t border-neutral-200/40 dark:border-neutral-800/40 absolute bottom-0">
							<div className="text-sm">&copy; {currentYear} - <span className="font-bold">Inimi</span> - All rights reserved.</div>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
