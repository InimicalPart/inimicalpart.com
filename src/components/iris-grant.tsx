"use client"
import { Snippet } from "@nextui-org/snippet";
import { notFound, useSearchParams } from "next/navigation";

export default function IRISGrantCode() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    if (!code) {
        notFound()
    }

    return <Snippet hideSymbol variant="bordered"><span>grant-code {code as string}</span></Snippet>

}