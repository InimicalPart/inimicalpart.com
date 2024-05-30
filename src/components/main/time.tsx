"use client"
import { Skeleton } from '@nextui-org/react';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

export default function TimeForInimi({
    format = "h:mm:ss A"
}: {
    format?: string
}) {
    const [time, setTime] = useState("12:00:00 AM");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setTime(moment().tz("Europe/Stockholm").format(format));
        setLoading(false);

        const interval = setInterval(() => {
            setTime(moment().tz("Europe/Stockholm").format(format));
        }, 500);

        return () => clearInterval(interval);
    }, [format]);

    return <Skeleton className="mx-1 rounded-md" isLoaded={!loading}>{time}</Skeleton>

}