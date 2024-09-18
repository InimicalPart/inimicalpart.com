import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getOffense } from "@/utils/conn"
 
declare const global: ICOMGlobal

export async function GET(req: NextRequest, {params}: {params: {OFFENSE_ID: string, SERVER_ID: string}}) {
       
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const server = global.servers[params.SERVER_ID]
    if (!server) return NextResponse.json({ error: "NOT_FOUND", message: "Server not found" }, { status: 404 })
    
    const botConnection = global.connections[server.managingBot]

    const offense = await getOffense(botConnection.connection, userID, params.OFFENSE_ID).catch(e=>e) as any

    if (offense == "TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    
    if (offense?.result?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
    if (!offense.result.offense) return NextResponse.json({ error: "OFFENSE_NOT_FOUND", message: "Offense not found" }, { status: 404 })

    return NextResponse.json({ id: userID, offense: offense.result.offense }, { status: 200 })

}