import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
import DOMPurify from "dompurify"
import { currentUser } from "@clerk/nextjs/server"
import { sendMessage } from "@/utils/conn"

declare const global: ICOMGlobal

export async function POST(req: NextRequest, {params}: {params: {OFFENSE_ID: string, SERVER_ID: string}}) {

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const server = global.servers[params.SERVER_ID]
    if (!server) return NextResponse.json({ error: "NOT_FOUND", message: "Server not found" }, { status: 404 })
    
    const botConnection = global.connections[server.managingBot]

    const message = (await req.json()).message

    const window = new JSDOM("''").window
    const purify = DOMPurify(window)



    const status = await sendMessage(botConnection.connection, {
        user_id: userID,
        offense_id: params.OFFENSE_ID,
        message: purify.sanitize(message.trim()),
        admin: false,
    }).catch(e=>e) as any 

    
    if (status == "TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
        
    if (status?.result.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
    if (status.result.error) return NextResponse.json({ error: "MESSAGE_FAILED", message: status.result.error }, { status: 400 })

    return NextResponse.json(status.result, { status: 200 })

}