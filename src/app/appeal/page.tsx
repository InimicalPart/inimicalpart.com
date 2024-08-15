"use client";

import Loading from "@/components/loading";
import { Accordion, AccordionItem, Avatar, Card, CardBody, Divider, Spacer } from "@nextui-org/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {

    const apiLoc = process.env.NODE_ENV == "development" ? "http://appeal.localhost:3000/api" : "https://appeal.inimicalpart.com/api"
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetch(`${apiLoc}/servers`).then(res => res.json()).then(data => {
            setServers(data.servers);
            if (data.servers.length == 1) router.replace(`/servers/${data.servers[0].id}/offenses`)
            else 
                setLoading(false);
        })
    }, [apiLoc, router])

    

    return (
        loading ? <Loading /> :
        <div className="flex flex-col justify-center items-center">
                <h1 className="font-bold text-2xl">Please select a server</h1>
                <Spacer y={5}/>
                <div className="flex gap-3 flex-col min-w-80 max-w-[500px] items-center">
                    {
                        servers.length > 0 ?
                            servers.map(server => (
                                <Card key={server.id} className="w-full h-20 bg-neutral-800" isPressable onClick={() => router.push(`/servers/${server.id}/offenses`)}>
                                    <CardBody className="py-0 justify-center">
                                        <div className="flex flex-row items-center gap-3">
                                            <Avatar src={server.icon} size="md" />
                                            <div className="flex flex-col justify-center">
                                                <h1 className="font-semibold text-ellipsis line-clamp-1">{server.name}</h1>
                                                <h1 className="text-gray-500 text-sm">{server.id}</h1>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                            : <div className="text-center"><p className="text-gray-500 italic decoration-wavy">No servers found.<br/><br/>If you&apos;re certain you are or have been a member of a server that supports the appeal system, it might be that the managing bot for that server is unavailable at this time.</p> </div>
                    }
                </div>
            </div>
    )

}