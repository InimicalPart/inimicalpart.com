import "@/styles/globals.css";
import { Viewport } from "next";
import { Providers } from "./providers";
import InimiNavbar from "@/components/navbar";

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
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className="dark:bg-neutral-900 bg-white">
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col min-h-screen">
						<InimiNavbar/>
						<main className="container mx-auto max-w-7xl pt-16 pb-16 px-6 flex-grow mb-5">
							{children}
						</main>
						<footer className="w-full flex items-center justify-center py-3  bg-neutral-100 text-default-900 dark:bg-black dark:text-dark-100 border-t border-divider absolute bottom-0">
							<div className="text-sm dark:text-gray-400">&copy; {currentYear} - <span className="font-bold">Inimi</span> - All rights reserved.</div>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
