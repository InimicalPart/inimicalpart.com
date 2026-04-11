"use client"

import { useEffect, useState } from "react"
import ProjectCard from "@/components/main/projectCard"

type GitHubRepo = {
  id: number
  name: string
  description: string | null
  pushed_at: string
  owner: {
    login: string
  }
}

type GitHubCommit = {
  message: string
  date: string
  url: string
}

type GitHubCommitApiResponse = {
  html_url?: string
  commit?: {
    message?: string
    author?: {
      date?: string
    }
  }
}

type RepoWithCommit = {
  repo: GitHubRepo
  latestCommit: GitHubCommit | null
}

async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "force-cache",
  })

  if (!response.ok) {
    return []
  }

  const data: unknown = await response.json()
  return Array.isArray(data) ? (data as GitHubRepo[]) : []
}

async function fetchLatestCommit(owner: string, repo: string): Promise<GitHubCommit | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
    {
      headers: { Accept: "application/vnd.github+json" },
      cache: "force-cache",
    },
  )

  if (!response.ok) {
    return null
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data) || data.length === 0) {
    return null
  }

  const [latest] = data as GitHubCommitApiResponse[]
  const message = latest.commit?.message?.split("\n")[0]?.trim()
  const date = latest.commit?.author?.date
  const url = latest.html_url

  if (!message || !date || !url) {
    return null
  }

  return { message, date, url }
}

export default function LatestProjects() {
  const [projects, setProjects] = useState<RepoWithCommit[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const [incoverseRepos, inimicalpartRepos] = await Promise.all([
          fetchRepos("incoverse"),
          fetchRepos("inimicalpart"),
        ])

        const allRepositories = [...incoverseRepos, ...inimicalpartRepos]
        const sortedRepositories = allRepositories.sort(
          (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
        )

        const top3Repositories = sortedRepositories.slice(0, 3)
        const top3WithCommits = await Promise.all(
          top3Repositories.map(async (repo) => ({
            repo,
            latestCommit: await fetchLatestCommit(repo.owner.login, repo.name),
          })),
        )

        if (mounted) {
          setProjects(top3WithCommits)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="mt-5 text-center italic text-gray-700 dark:text-gray-300">
        Loading latest projects...
      </div>
    )
  }

  if (!projects?.length || projects.some(({ latestCommit }) => latestCommit === null)) {
    return (
      <div className="mt-5 flex w-full justify-center italic text-gray-700 dark:text-gray-300">
        <span className="text-center">
          GitHub API rate limit exceeded. Project information may not be available at the moment. Please check back later!
        </span>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-6 grid w-full max-w-280 grid-cols-1 gap-4 justify-items-center sm:grid-cols-2 xl:grid-cols-3">
      {projects.map(({ repo, latestCommit }) => (
        <ProjectCard
          key={repo.id}
          repo={repo.name}
          description={repo.description}
          owner={repo.owner.login}
          title={repo.name}
          lastUpdated={new Date(repo.pushed_at)}
          latestCommit={latestCommit}
        />
      ))}
    </div>
  )
}
