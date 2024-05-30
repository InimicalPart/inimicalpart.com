"use client"

import { Button } from "@nextui-org/button";
import { Code } from "@nextui-org/code";
import NextLink from "next/link";
import { usePathname } from "next/navigation";


export default function NotFound() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-extrabold">404: <span className="font-normal">Not Found</span></h1>
            <p className="text-lg mt-4">Whoops! The page at <Code>{pathname.length > 50 ? pathname.substring(0,20) + "..." + pathname.substring(pathname.length-20, pathname.length) : pathname}</Code> could not be found.</p>
            <br/>
            <Button
                href="/"
                as={NextLink}
                color="primary"
                variant="solid"
                >
                Go back home
            </Button>
        </div>
    )
}