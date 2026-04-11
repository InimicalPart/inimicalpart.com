"use client";

import { FC, useEffect, useState } from "react";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons/misc";

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
}) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      root.classList.toggle("dark", storedTheme === "dark");
      setTheme(storedTheme);
      return;
    }

    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    root.classList.toggle("dark", initialTheme === "dark");
    setTheme(initialTheme);
  }, []);

  const onChange = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={onChange}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-2 py-2 text-default-500 transition-opacity hover:opacity-80 cursor-pointer",
        className,
      )}
    >
      {theme === "dark" ? (
        <MoonFilledIcon size={22} />
      ) : (
        <SunFilledIcon size={22} />
      )}
    </button>
  );
};
