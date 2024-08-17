import { getServerInfo } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { sendAndAwait } from "@/utils/conn"
 
declare const global: ICOMGlobal

export async function GET(req: NextRequest) {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const uID = user.externalAccounts[0].externalId;

    const serverInfo = await getServerStatus(uID).catch(e=>e) as any ?? []

    return NextResponse.json({ servers: [...serverInfo,
        // {
        //     id: "1234567890123456789",
        //     name: "SoulThread's Server (Dummy)",
        //     iconURL: "https://cdn.discordapp.com/avatars/514961805517258772/884551acd255d585ae29eb19f1a52741.png"   
        // },
        // {
        //     id: "1234567890123456789",
        //     name: "Kennevo's Chaos Crew (Dummy)",
        //     iconURL: "https://cdn.discordapp.com/icons/786013884216639509/a_34edc0a799b9392fdafd48c5ea0803b8.png"   
        // }
        ]}, { status: 200 })
}

function getServerStatus(uID: string): Promise<{ id: string; name: string; iconURL: string }[]> {
    let serversToShow: { id: string; name: string; iconURL: string }[] = [];
    let allRequests = [];
    return new Promise<any>((resolve, reject) => {
        for (let serverID in global.servers) {
            const server = global.servers[serverID];
            if (Object.keys(global.connections).includes(server.managingBot)) {
                allRequests.push(sendAndAwait(global.connections[server.managingBot].connection, { type: "query", query: "member", data: { user_id: uID } }, 5000).then((data) => {
                    if (data.result) {

                        const serverCopy: {
                            id: string;
                            name: string;
                            iconURL: string;
                            managingBot?: string;
                        } = { ...server };

                        delete serverCopy.managingBot;
                        serversToShow.push(serverCopy)
                    }
                }).catch(e => {}))
            }
        }

        Promise.all(allRequests).then(() => {
            resolve(serversToShow.toSorted((a, b) => a.name.localeCompare(b.name)));
        })
    })
}