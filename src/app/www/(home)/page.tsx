import Confetti from "@/components/main/confetti";
import RealtimeYears from "@/components/main/years";
import ProjectCard from "@/components/main/projectCard";
import { Tooltip } from "@nextui-org/tooltip";
import { Metadata } from "next";
import dayjs from "dayjs";
import { chooseArticle } from "@/utils/misc";

export const revalidate = 3600




export async function generateMetadata(): Promise<Metadata> {
  const years = dayjs().diff(dayjs(1163622720000), "year", true).toString().split(".")[0]

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
          alt: 'Inimi\'s logo',
        }
      ],      
    }
  }
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
      <div className="text-center -mt-4 flex flex-col">
        <h1 className="text-4xl font-bold">Hi there! 👋</h1>
        <div className="text-lg mt-5 md:mt-4">
          <div>I&apos;m <span className="font-bold">Inimi</span>,<br className="hidden"/>
            <Tooltip showArrow content={<RealtimeYears/>} placement="bottom" closeDelay={100} delay={0}>
              <div className="inline-flex">{<RealtimeYears cutAt={8} boldYears={true} addArticle={true}/>}</div>
            </Tooltip>
            year-old <br className="hidden"/>full-stack developer.
        </div>
        </div>

        <p className="text-md mt-4">
          I&apos;m very passionate about developing software, and I love to challenge myself in pursuit of learning new things.
        </p>
        <br/>

        <p className="text-md mt-4">
          My latest projects:
        </p>
        <div className="flex flex-row mt-5 flex-wrap justify-center gap-4">
          {top3Repositories.map((repo: any) => <ProjectCard key={repo.id} repo={repo.name} description={repo.description} owner={repo.owner.login} title={repo.name} lastUpdated={new Date(repo.pushed_at)}/>)}
        </div>
      </div>
    </>
}