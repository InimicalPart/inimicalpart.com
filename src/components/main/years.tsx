"use client"

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
import { Skeleton } from "@nextui-org/react";
import { chooseArticle } from "@/utils/misc";

export default function RealtimeYears({
    birthUnix = 1163623320000, // November 15, 2006,
    cutAt = 15,
    className = "",
    addArticle = false,
    boldYears = false
}: {
    birthUnix?: number,
    cutAt?: number,
    className?: string,
    addArticle?: boolean,
    boldYears?: boolean
}) {
    const [years, setYears] = useState("00." + "0".repeat(cutAt));
    const [previousYears, setPreviousYears] = useState("00");
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState(addArticle ? "a" : "");

    useEffect(() => {
        const interval = setInterval(() => {
            const currentYears = dayjs().diff(dayjs.utc(birthUnix), "year", true).toString();
            const currentYearsSplit = currentYears.split(".");
            currentYearsSplit[1] = currentYearsSplit[1].padEnd(cutAt, "0").substring(0, cutAt);
            setYears(currentYearsSplit.join("."));
            if (currentYearsSplit[0] !== previousYears) {
                setPreviousYears(currentYearsSplit[0]);
                if (addArticle) {
                    setArticle(chooseArticle(parseInt(currentYearsSplit[0])));
                }
            }
            if (loading) setLoading(false);
        }, Math.floor(Math.random() * 25) + 15);

        return () => {
            clearInterval(interval);
        };
    }, [birthUnix, cutAt, loading, addArticle, previousYears]);
    return <Skeleton className={("mx-1 rounded-md " + className).trim()} isLoaded={!loading}>{article} {boldYears ? <b>{years}</b> : years}</Skeleton>;
}