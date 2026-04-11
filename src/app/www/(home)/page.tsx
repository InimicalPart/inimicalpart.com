import Confetti from "@/components/main/confetti";
import RealtimeYears from "@/components/main/years";
import LatestProjects from "@/components/main/latest-projects";
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@heroui/react/tooltip";
import { Metadata } from "next";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
import { chooseArticle } from "@/utils/misc";

export const revalidate = 3600


export async function generateMetadata(): Promise<Metadata> {
  const years = dayjs().diff(dayjs.utc(1163623320000), "year", true).toString().split(".")[0]

  return {
    title: "Inimi",
    description: 'The homepage of inimi.dev',
    openGraph: {
      title: "Inimi",
      description: `The official website of Inimi, ${chooseArticle(years)} ${years}-year-old full-stack developer.`,
      type: 'website',
      url: 'https://inimi.dev',
    },
    twitter: {
      card: "summary",
      images: [
        {
          url: 'https://inimi.dev/logo.png',
          width: 64,
          height: 64,
          alt: 'Inimi\'s logo',
        }
      ],      
    }
  }
}
 

export default async function Home() {

  return <>
      <Confetti/>
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="rounded-3xl border border-black/10 bg-white/65 px-6 py-8 text-center shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/35 sm:px-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hi there! 👋</h1>
          <div className="mt-5 text-lg md:mt-4">
            <div className="flex items-center justify-center flex-col md:flex-row">
              <span>I&apos;m <b>Inimi</b>,</span>
              <Tooltip delay={0} closeDelay={100} >
                <TooltipTrigger>
                  <RealtimeYears cutAt={8} boldYears={true} addArticle={true}/>
                </TooltipTrigger>
                <TooltipContent showArrow placement="bottom">
                  <TooltipArrow/>
                  <RealtimeYears boldYears={true} className="text-lg"/>
                </TooltipContent>
              </Tooltip>
              <span>year-old full-stack developer based in Sweden.</span>
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            I&apos;m very passionate about building software and I love challenging myself to keep learning new things.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/55 px-4 py-6 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/30 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Latest Projects
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Recently shipped work
          </h2>

          <LatestProjects />
        </section>
      </div>
    </>
}