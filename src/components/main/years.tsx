"use client"

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Skeleton } from "@nextui-org/react";

export default function RealtimeYears({
    birthUnix = 1163622720000, // November 15, 2006,
    cutAt = 15
}: {
    birthUnix?: number,
    cutAt?: number,
}) {
    const [years, setYears] = useState("00." + "0".repeat(cutAt));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentYears = dayjs().diff(dayjs(birthUnix), "year", true).toString();
            const currentYearsSplit = currentYears.split(".");
            currentYearsSplit[1] = currentYearsSplit[1].padEnd(cutAt, "0").substring(0, cutAt);
            setYears(currentYearsSplit.join("."));
            if (loading) setLoading(false);
        }, Math.floor(Math.random() * 25) + 15);

        return () => {
            clearInterval(interval);
        };
    }, [birthUnix, cutAt, loading]);
    return <Skeleton className="mx-1 rounded-md" isLoaded={!loading}>{years}</Skeleton>;
}