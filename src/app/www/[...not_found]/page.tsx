"use client"

import { Button } from "@nextui-org/button";
import { Code } from "@nextui-org/code";
import NextLink from "next/link";
import { usePathname } from "next/navigation";


export default function NotFound() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
            {/* editorial header */}
            <div className="flex flex-col items-center mb-10">
                <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
                    error
                </span>
                <h1 className="font-serif text-3xl md:text-[2.8rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
                    <span className="text-neutral-400 dark:text-neutral-500">404</span>
                    <em className="italic text-neutral-500 dark:text-neutral-400"> not found</em>
                </h1>
            </div>

            <p className="text-md mt-4 text-neutral-600 dark:text-neutral-400 text-center max-w-md">
                Whoops! The page at <br/>
                <Code className="mt-2">{pathname.length > 50 ? pathname.substring(0,20) + "..." + pathname.substring(pathname.length-20, pathname.length) : pathname}</Code><br/>
                could not be found.
            </p>
            <br/>
            <Button
                href="/"
                as={NextLink}
                className="bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90"
                >
                Go back home
            </Button>
        </div>
    )
}
