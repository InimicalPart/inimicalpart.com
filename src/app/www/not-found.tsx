"use client"

import NextLink from "next/link";
import { usePathname } from "next/navigation";


export default function NotFound() {
    const pathname = usePathname();

    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl border border-black/10 bg-white/60 px-6 py-10 text-center shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/35 sm:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404: <span className="font-normal">Not Found</span></h1>
            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">Whoops! The page at <code className="rounded-xl bg-default/40 p-2 text-sm text-default-700">{pathname.length > 50 ? pathname.substring(0,20) + "..." + pathname.substring(pathname.length-20, pathname.length) : pathname}</code> could not be found.</p>
            <div className="mt-6">
                <NextLink
                    href="/"
                    className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
                >
                    Go back home
                </NextLink>
            </div>
        </div>
    )
}