"use client"

import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function RealtimeYears({
    birthUnix = 1163622720000, // November 15, 2006,
    cutAt = 15,
    onReady = () => {}
}: {
    birthUnix?: number,
    cutAt?: number,
    onReady?: () => void
}) {
    const [years, setYears] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const currentYears = dayjs().diff(dayjs(birthUnix), "year", true).toString();
            const currentYearsSplit = currentYears.split(".");
            currentYearsSplit[1] = currentYearsSplit[1].padEnd(cutAt, "0").substring(0, cutAt);
            setYears(currentYearsSplit.join("."));
        }, Math.floor(Math.random() * 25) + 15);

        return () => {
            clearInterval(interval);
        };
    }, [birthUnix, cutAt]);

    useEffect(() => {
        onReady();
    }, [onReady]);

    return <>{years}</>;
}