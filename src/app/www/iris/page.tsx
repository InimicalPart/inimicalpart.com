import dayjs from "dayjs";
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
            alt: 'Inimi\'s logo',
          }
        ],      
      }
    }
  }
  

export default function IRISGrant() {

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-extrabold">IRIS Authorization</h1>
            <p className="text-lg mt-6 font-semibold">Thank you for authorizing IRIS!</p>
            <p className="text-lg mt-2">Please send the following message to IRIS to complete the authorization process:</p>
            <br/>
            <Suspense fallback={<Skeleton className="mx-1 rounded-lg h-[50px] w-[415px]" />}>
              <IRISGrantCode/>
            </Suspense>
        </div>
    )


}