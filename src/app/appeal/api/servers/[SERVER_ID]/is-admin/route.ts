import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { isAdminCheck } from "@/utils/conn"

declare const global: ICOMGlobal
 
export async function GET(req: NextRequest, {params}: {params: {SERVER_ID: string}}) {
  
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const server = global.servers[params.SERVER_ID]
    if (!server) return NextResponse.json({ error: "NOT_FOUND", message: "Server not found" }, { status: 404 })
    
    const botConnection = global.connections[server.managingBot]
    if (!botConnection || !botConnection.verified) return NextResponse.json({ error: "UNAVAILABLE", message: "This server is currently unavailable. Please try again later." }, { status: 503 })


    const isAdmin = await isAdminCheck(botConnection.connection, userID).catch(e=>e)

    if (isAdmin == "TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    return NextResponse.json({ admin: isAdmin.result }, { status: 200 })


}

