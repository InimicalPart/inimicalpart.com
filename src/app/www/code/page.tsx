import GrantCode from "@/components/grant";
import { notFound } from "next/navigation";

type CodePageProps = {
    searchParams?: {
        code?: string | string[];
        state?: string | string[];
    };
};

function decodeFirstValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export default function IRISGrant({ searchParams }: CodePageProps) {
    const state = decodeFirstValue(searchParams?.state);
    const code = decodeFirstValue(searchParams?.code);

    if (!code) {
        notFound();
    }

    let app = "";
    if (state) {
        try {
            app = atob(state).split(":")[0] || "";
        } catch {
            app = "";
        }
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl border border-black/10 bg-white/60 px-6 py-10 text-center shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/35 sm:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {app ? `${app} ` : ""}Authorization
            </h1>
            <p className="mt-6 text-lg font-semibold">
                Thank you for authorizing{app ? ` ${app}` : ""}!
            </p>
            <p className="mt-2 text-lg text-neutral-700 dark:text-neutral-300">
                Please send the following message to {app || "the app"} to complete the authorization process:
            </p>
            <div className="mt-6">
                <GrantCode code={code} />
            </div>
        </div>
    );
}