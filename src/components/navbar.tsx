
"use client"

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from "@nextui-org/navbar";
import InimiLogo from "./icons/inimi";
import React from "react";
import NextLink from "next/link";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import { ThemeSwitch } from "./theme-switch";

export default function InimiNavbar({
    activePage = ""
} : {
    activePage?: string
}) {


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


    return (
        <Navbar position="static" isBordered className="dark:bg-black bg-neutral-100">
      <NavbarContent>
        <NavbarBrand>
          <InimiLogo size={{width: 36, height: 36}}/>
          <p className="font-bold text-inherit">Inimi</p>
        </NavbarBrand>
      </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {
            pages.map((page, index) => (
              <NavbarItem key={index} isActive={activePage === page.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: activePage === page.href ? "primary" : "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  href={page.href}
                >
                  {page.name}
                </NextLink>
              </NavbarItem>
            ))
          }
        </NavbarContent>
        <NavbarContent justify="end">
          <ThemeSwitch/>
        </NavbarContent>
      </Navbar>
    )
}