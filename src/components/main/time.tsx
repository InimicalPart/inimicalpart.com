"use client"
import { Skeleton } from "@heroui/react/skeleton";
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

export default function TimeForInimi({
    format = "h:mm:ss A",
    bold = true,
}: {
    format?: string,
    bold?: boolean
}) {
    const [time, setTime] = useState("12:00:00?"); // "?" is a placeholder, to make it smoother when the time is loaded
    const [loading, setLoading] = useState(true);
    const [useFormat, setUseFormat] = useState(format);

    useEffect(() => {
        const locale = navigator.language
        const wants12H = Intl.DateTimeFormat(locale,  { hour: 'numeric' }).resolvedOptions().hour12
        if (wants12H) {
            if (useFormat !== "h:mm:ss A") setUseFormat("h:mm:ss A")
        } else {
            if (useFormat !== "HH:mm:ss") setUseFormat("HH:mm:ss")
        }

        setTime(moment().tz("Europe/Stockholm").format(useFormat));
        if (loading) setLoading(false);

        const interval = setInterval(() => {
            setTime(moment().tz("Europe/Stockholm").format(useFormat));
        }, 500);

        return () => clearInterval(interval);
    },[useFormat, loading]);

    return loading ? <Skeleton className="mx-1 h-4.5 w-22 rounded-lg" /> : <span className="mx-1 font-mono">{bold ? <b>{time}</b> : time}</span>

}