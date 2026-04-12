"use client"
import { Card } from "@heroui/react/card"
import { Separator } from "@heroui/react/separator"
import { Tooltip } from "@heroui/react/tooltip"
import { GithubIcon } from "@/components/icons/misc"
import { JSX } from "react"

type LatestCommit = {
  message: string
  date: string
  url: string
}

export default function ProjectCard({
    owner,
    repo,
    title,
    description,
  lastUpdated,
  latestCommit,
  featured = false,
}: {
    owner: string,
    repo: string,
    title: string,
  description: string | JSX.Element | null,
  lastUpdated?: Date,
  latestCommit?: LatestCommit | null,
  featured?: boolean,
}) {
  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noreferrer"
      className="group block h-full"
    >
      <Card className={`glass relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl ${featured ? "min-h-80 w-full max-w-3xl" : "min-h-72 w-88"}`}>
        <div className={`absolute inset-x-0 top-0 ${featured ? "h-1.5" : "h-1"} bg-linear-to-r from-cyan-500/80 via-sky-500/80 to-indigo-500/80`} />

        {featured ? (
          <span className="absolute right-4 top-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            Most Recent
          </span>
        ) : null}

        <Card.Header className="mt-1 flex flex-row items-center gap-2 whitespace-nowrap truncate pb-2">
          <span className="rounded-lg bg-black/5 p-1.5 text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            <GithubIcon size={featured ? 20 : 18} />
          </span>
          <p className={`${featured ? "text-sm" : "text-xs"} truncate text-neutral-500 dark:text-neutral-400`}>
            github.com/{owner}/{repo}
          </p>
        </Card.Header>

        <Separator className="opacity-40" />

        <Card.Content className="flex flex-1 flex-col py-4">
          <p className={`${featured ? "text-3xl" : "text-xl"} truncate text-left font-bold text-neutral-900 dark:text-neutral-50`}>
            {title}
          </p>
          <p className={`${featured ? "text-base" : "text-sm"} text-left leading-relaxed text-neutral-700 dark:text-neutral-300`}>
            {description || "No description provided for this project yet."}
          </p>
          {latestCommit ? (
            <>
              <Separator className="my-4 opacity-40" />
              <div className={`${featured ? "text-sm" : "text-xs"} mt-auto rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-left dark:border-white/10 dark:bg-white/5`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Latest commit
                </p>
                <p className="truncate font-medium text-neutral-800 dark:text-neutral-100">
                  {latestCommit.message}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(latestCommit.date).toLocaleString()}
                </p>
              </div>
            </>
          ) : null}
        </Card.Content>

        <Card.Footer className={`${featured ? "text-sm" : "text-xs"} flex w-full items-center justify-between gap-3 text-neutral-700 dark:text-neutral-300`}>
          {lastUpdated ? (
            <Tooltip.Root delay={0} closeDelay={100}>
              <Tooltip.Trigger>
                <span className="rounded-full bg-black/5 px-2.5 py-1 dark:bg-white/10">
                  Updated {new Date(lastUpdated).toLocaleDateString()}
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content showArrow>
                {new Date(lastUpdated).toString()}
              </Tooltip.Content>
            </Tooltip.Root>
          ) : (
            <span className="rounded-full bg-black/5 px-2.5 py-1 dark:bg-white/10">
              Project snapshot
            </span>
          )}

          <span className="font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
            Open on GitHub {"->"}
          </span>
        </Card.Footer>
      </Card>
    </a>
  )
}