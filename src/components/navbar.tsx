"use client"

import InimiLogo from "./icons/inimi";
import React, { useEffect } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "./theme-switch";
import { usePathname } from "next/navigation";

const pages = [
  {
    name: "Home",
    href: "/"
  },
  {
    name: "Contact",
    href: "/contact"
  },
  {
    name: "About",
    href: "/about"
  }
]

export default function InimiNavbar({
  noItems = false
}: {
  noItems?: boolean
}) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  useEffect(() => {
    if (noItems) {
      setIsMenuOpen(false)
    }
  }, [noItems])

  const isActive = (href: string) => pathname === href

  const renderLink = (page: typeof pages[number], className: string) => (
    <NextLink
      href={page.href}
      aria-current={isActive(page.href) ? "page" : undefined}
      className={clsx(
        "transition-colors hover:text-accent",
        isActive(page.href) ? "text-accent font-medium" : "text-foreground",
        className,
      )}
    >
      {page.name}
    </NextLink>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/55">
      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NextLink href="/" className="group flex items-center gap-2 text-inherit">
          <InimiLogo size={{ width: 36, height: 36 }} />
          <p className="text-lg font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-accent dark:text-neutral-100">Inimi</p>
        </NextLink>

        {!noItems ? (
          <>
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 rounded-full border border-black/10 bg-white/70 px-5 py-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 sm:flex">
              {pages.map((page) => (
                <span key={page.href}>{renderLink(page, "text-sm")}</span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ThemeSwitch />
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="inline-flex items-center rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 sm:hidden"
              >
                Menu
              </button>
            </div>
          </>
        ) : (
          <ThemeSwitch />
        )}
      </nav>

      {!noItems && isMenuOpen ? (
        <div className="border-t border-black/5 px-4 py-3 dark:border-white/10 sm:hidden">
          <div className="flex flex-col items-center gap-3">
            {pages.map((page) => (
              <span key={page.href}>{renderLink(page, "text-lg")}</span>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}