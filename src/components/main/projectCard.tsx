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
          <Card
            className="w-[350px] h-[300px] border border-white/[0.18] dark:border-white/[0.12]"
            style={{
              backdropFilter: "blur(16px) saturate(1.8)",
              WebkitBackdropFilter: "blur(16px) saturate(1.8)",
              background: "rgba(255,255,255,0.06)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
            isPressable
            onPress={() => window.open(`https://github.com/${owner}/${repo}`, "_blank")}
          >
          <CardHeader className="flex flex-row">
              <GithubIcon/>
              <Tooltip showArrow delay={0} closeDelay={100} content={`https://github.com/${owner}/${repo}`}>
                <p className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 text-ellipsis truncate">github.com/{owner}/{repo}</p>
              </Tooltip>
          </CardHeader>
          <Divider className="opacity-50 -mt-1 mb-1"/>
          <CardBody>
            <p className="font-serif text-lg font-semibold text-center text-ellipsis truncate text-neutral-900 dark:text-neutral-100">{title}</p>
            <Divider className="my-2"/>
            <p className="text-md text-center line-clamp-5 min-[389px]:line-clamp-6 text-neutral-600 dark:text-neutral-300">{description}</p>
          </CardBody>

          <Divider className="opacity-50"/>
          <CardFooter className="text-center text-sm text-neutral-500 dark:text-neutral-400 w-full justify-center">
            {lastUpdated ? <>
              <Tooltip showArrow delay={0} closeDelay={100} content={new Date(lastUpdated).toString()}><span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span></Tooltip>
            <Divider orientation="vertical" className="mx-2"/></> : null}
            Click to view on GitHub
          </CardFooter>
        </Card>
    )
}
