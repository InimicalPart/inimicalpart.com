import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
import { chooseArticle } from "@/utils/misc";
import { Metadata } from "next";
import IRISGrantCode from "@/components/iris-grant";
import { Suspense } from "react";
import { Skeleton } from "@nextui-org/react";

export async function generateMetadata(): Promise<Metadata> {
    const years = dayjs().diff(dayjs.utc(1163623320000), "year", true).toString().split(".")[0]
  
    return {
      title: "IRIS Authorization",
      description: 'This page simplifies the IRIS authorization process through DMs.',
      openGraph: {
        title: "Inimi",
        description: `The official website of Inimi, ${chooseArticle(years)} ${years}-year-old full-stack developer.`,
        type: 'website',
        url: 'https://inimicalpart.com',
      },
      twitter: {
        card: "summary",
        images: [
          {
            url: 'https://inimicalpart.com/logo.png',
            width: 64,
            height: 64,
            alt: "Inimi's logo",
          }
        ],      
      }
    }
  }
  

export default function IRISGrant() {

    return (
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
            {/* editorial header */}
            <div className="flex flex-col items-center mb-10">
                <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
                    authorization
                </span>
                <h1 className="font-serif text-3xl md:text-[2.8rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
                    IRIS <em className="italic text-neutral-500 dark:text-neutral-400">auth</em>
                </h1>
            </div>

            <div className="bg-neutral-100/80 dark:bg-neutral-800/50 backdrop-blur-sm rounded-2xl px-10 py-8 border border-neutral-200/60 dark:border-neutral-700/40 text-center w-full">
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Thank you for authorizing IRIS!
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                    Please send the following message to IRIS to complete the authorization process:
                </p>
                <br/>
                <Suspense fallback={<Skeleton className="mx-1 rounded-lg h-[50px] w-full" />}>
                  <IRISGrantCode/>
                </Suspense>
            </div>
        </div>
    )


}
