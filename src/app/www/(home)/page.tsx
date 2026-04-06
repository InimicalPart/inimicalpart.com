import Confetti from "@/components/main/confetti";
import RealtimeYears from "@/components/main/years";
import ProjectCard from "@/components/main/projectCard";
import { Tooltip } from "@nextui-org/tooltip";
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
    description: 'The homepage of inimicalpart.com',
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

function DividerWithLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-neutral-300/60 dark:bg-neutral-700/60" />
      <span className="text-[0.6rem] uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500 font-medium whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-neutral-300/60 dark:bg-neutral-700/60" />
    </div>
  )
}
 
export default async function Home() {

  const allRepositories = [
    ...(await fetch("https://api.github.com/users/incoverse/repos",    { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 3600 }}).then(res => res.json())),
    ...(await fetch("https://api.github.com/users/inimicalpart/repos", { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 3600 }}).then(res => res.json()))
  ]

  const sortedRepositories = allRepositories.sort((a: any, b:any) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
  const top3Repositories = sortedRepositories.slice(0, 3)

  return <>
      <Confetti/>
      <div className="text-center -mt-2 flex flex-col">

        {/* editorial headline */}
        <div className="flex flex-col items-center mb-10">
          <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
            inimicalpart.com
          </span>
          <h1 className="font-serif text-3xl md:text-[2.8rem] font-semibold leading-[1.15] tracking-tight max-w-2xl text-neutral-900 dark:text-neutral-100">
            hi, I&apos;m Inimi
          </h1>
          <p className="text-base md:text-lg mt-5 max-w-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            a full-stack developer building things on the internet
          </p>
        </div>

        {/* age counter - editorial spotlight */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-neutral-100/80 dark:bg-neutral-800/50 backdrop-blur-sm rounded-2xl px-10 py-6 border border-neutral-200/60 dark:border-neutral-700/40">
            <div className="text-neutral-500 dark:text-neutral-400 text-[0.6rem] uppercase tracking-[0.4em] mb-2 font-medium">
              time alive
            </div>
            <Tooltip showArrow content={<RealtimeYears /> cutAt={12} placement="bottom" closeDelay={100} delay={0}>
              <div className="inline-flex cursor-default">
                <RealtimeYears cutAt={10} boldYears={true} addArticle={true} />
              </div>
            </Tooltip>
            <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-1">
              full-stack developer
            </p>
          </div>
        </div>

        <p className="text-md mt-4 max-w-md mx-auto leading-relaxed text-neutral-600 dark:text-neutral-400">
          I&apos;m very passionate about developing software, and I love to challenge myself in pursuit of learning new things.
        </p>

        <DividerWithLabel label="latest projects" />

        <div className="flex flex-row mt-5 flex-wrap justify-center gap-4">
          {top3Repositories.map((repo: any) => <ProjectCard key={repo.id} repo={repo.name} description={repo.description} owner={repo.owner.login} title={repo.name} lastUpdated={new Date(repo.pushed_at)}/>)}
        </div>
      </div>
    </>
}
