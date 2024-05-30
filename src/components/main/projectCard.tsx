"use client"
import { Card, CardHeader, CardBody, Divider, CardFooter, Tooltip } from "@nextui-org/react"
import { GithubIcon } from "@/components/icons/misc"

export default function ProjectCard({
    owner,
    repo,
    title,
    description,
    lastUpdated
}: {
    owner: string,
    repo: string,
    title: string,
    description: string | JSX.Element,
    lastUpdated?: Date
}) {
    return (
          <Card className="w-[350px] h-[300px] dark:bg-neutral-800 bg-neutral-100" isPressable onPress={() => window.open(`https://github.com/${owner}/${repo}`, "_blank")}>
          <CardHeader className="flex flex-row">
              <GithubIcon/>
              <p className="ml-2 text-sm dark:text-neutral-400 text-neutral-500 text-ellipsis truncate">github.com/{owner}/{repo}</p>
          </CardHeader>
          <CardBody>
            <p className="text-lg font-bold text-center text-ellipsis truncate">{title}</p>
            <Divider className="my-2"/>
            <p className="text-md text-center line-clamp-5">{description}</p>
          </CardBody>

          <CardFooter className="text-center text-sm dark:text-neutral-500 text-neutral-800 w-full justify-center">
            {lastUpdated ? <>
              <Tooltip delay={0} closeDelay={100} content={new Date(lastUpdated).toString()}><span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span></Tooltip>
            <Divider orientation="vertical" className="mx-2"/></> : null}
            Click to view on GitHub
          </CardFooter>
        </Card>
    )
}