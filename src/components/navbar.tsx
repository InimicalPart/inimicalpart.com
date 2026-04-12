"use client"

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from "@nextui-org/navbar";
import React, { useEffect, useMemo } from "react";
import NextLink from "next/link";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import { ThemeSwitch } from "./theme-switch";
import { usePathname } from "next/navigation";
import InimiLogo from "./icons/inimi";

export default function InimiNavbar({
  noItems = false
}: {
  noItems?: boolean
}) {
  const pathname = usePathname()

  
  const pages = useMemo(()=>[
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
  ],[])


  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const [tabs, setTabs] = React.useState(
      noItems ? null :
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
    const [menuItems, setMenuItems] = React.useState(
      noItems ? null :
        pages.map((page, index) => (
          <NavbarMenuItem key={index}>
          <NextLink
            className={clsx(
              linkStyles({ color: "foreground" }),
              "data-[active=true]:text-primary data-[active=true]:font-medium",
            )}
            href={page.href}
            >
            {page.name}
          </NextLink>
        </NavbarMenuItem>
        ))
    )


    useEffect(() => {
        if (!noItems) {
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
          setMenuItems(
            pages.map((page, index) => (
              <NavbarMenuItem key={index} isActive={pathname == page.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: (pathname == page.href) ? "primary" : "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                ) + " text-xl"}
                href={page.href}
                >
                {page.name}
              </NextLink>
            </NavbarMenuItem>
            ))
          )
        }
      }, [pathname, pages, noItems])


    return (
        <Navbar position="static" isBordered className="border-neutral-200/40 dark:border-neutral-800/40 navbar-glass" onMenuOpenChange={noItems ? undefined : setIsMenuOpen}>
      <NavbarContent>
      <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
          hidden={noItems}
        />
        <NextLink href="/">
          <NavbarBrand>
            <InimiLogo size={{width: 36, height: 36}}/>
            <p className="font-serif font-bold text-inherit">Inimi</p>
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
        <NavbarMenu className="text-center" hidden={noItems}>
          {menuItems}
      </NavbarMenu>
      </Navbar>
    )
}
