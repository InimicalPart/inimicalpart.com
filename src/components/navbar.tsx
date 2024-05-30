"use client"

import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import InimiLogo from "./icons/inimi";
import React, { useEffect, useMemo } from "react";
import NextLink from "next/link";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import { ThemeSwitch } from "./theme-switch";
import { usePathname } from "next/navigation";

export default function InimiNavbar() {
  const pathname = usePathname()

  
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

    const [tabs, setTabs] = React.useState(
    pages.map((page, index) => (
        <NavbarItem key={index}>
        <NextLink
          className={clsx(
            linkStyles({ color: "foreground" }),
            "data-[active=true]:text-primary data-[active=true]:font-medium",
          )}
          href={page.href}
          >
          {page.name}
        </NextLink>
      </NavbarItem>
      ))
    )


    useEffect(() => {
      setTabs(
        pages.map((page, index) => (
          <NavbarItem key={index} isActive={pathname == page.href}>
          <NextLink
            className={clsx(
              linkStyles({ color: (pathname == page.href) ? "primary" : "foreground" }),
              "data-[active=true]:text-primary data-[active=true]:font-medium",
            )}
            href={page.href}
            >
            {page.name}
          </NextLink>
        </NavbarItem>
        ))
      )
    }, [pathname])


    return (
        <Navbar position="static" isBordered className="dark:bg-black bg-neutral-100">
      <NavbarContent>
        <NextLink href="/">
          <NavbarBrand>
            <InimiLogo size={{width: 36, height: 36}}/>
            <p className="font-bold text-inherit">Inimi</p>
          </NavbarBrand>
        </NextLink>
      </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {
            tabs
          }
        </NavbarContent>
        <NavbarContent justify="end">
          <ThemeSwitch/>
        </NavbarContent>
      </Navbar>
    )
}