import { getOffenses } from "@/utils/conn"
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
 
declare const global: ICOMGlobal

export async function GET(req: NextRequest, {params}: {params: {SERVER_ID: string}}) {
  
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const server = global.servers[params.SERVER_ID]
    if (!server) return NextResponse.json({ error: "NOT_FOUND", message: "Server not found" }, { status: 404 })
    
    const botConnection = global.connections[server.managingBot]

    const offenses = await getOffenses(botConnection.connection, userID).catch(e=>e) as any

    if (offenses == "TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    if (offenses?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })

    return NextResponse.json({ id: userID, offenses: offenses.result.offenses }, { status: 200 })


}


