import Confetti from "@/components/confetti";
import RealtimeYears from "@/components/years";
import ProjectCard from "@/components/projectCard";
import { Tooltip } from "@nextui-org/tooltip";

export default async function Home() {

  const allRepositories = [
    ...(await fetch("https://api.github.com/users/incoverse/repos",    { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 3600 } }).then(res => res.json())),
    ...(await fetch("https://api.github.com/users/inimicalpart/repos", { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 3600 } }).then(res => res.json()))
  ]


  const sortedRepositories = allRepositories.sort((a: any, b:any) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

  const top3Repositories = sortedRepositories.slice(0, 3)


  return <>
      <Confetti/>
      <div className="text-center -mt-4 flex flex-col">
        <h1 className="text-4xl font-bold">Hi there! 👋</h1>
        <p className="text-lg mt-4">
          I&apos;m <b>Inimi</b>, a {' '}
            <Tooltip content={<RealtimeYears/>} placement="bottom" closeDelay={200} delay={0}>
              <b>{<RealtimeYears cutAt={8}/>}</b>
            </Tooltip>{' '} year-old full-stack developer.
        </p>

        <p className="text-md mt-4">
          I&apos;m very passionate about developing software, and I love to challenge myself in pursuit of learning new things.
        </p>
        <br/>

        <p className="text-md mt-4">
          My latest projects:
        </p>

        <div className="flex flex-row mt-10 flex-wrap justify-center gap-4">
          {top3Repositories.map((repo: any) => <ProjectCard key={repo.id} repo={repo.name} description={repo.description} owner={repo.owner.login} title={repo.name} lastUpdated={new Date(repo.pushed_at)}/>)}
        </div>
      </div>
    </>
}