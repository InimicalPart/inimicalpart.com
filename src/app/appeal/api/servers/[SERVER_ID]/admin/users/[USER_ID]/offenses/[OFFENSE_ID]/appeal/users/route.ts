import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { isAdminCheck, getInvolvedUsers } from "@/utils/conn"

declare const global: ICOMGlobal

export async function GET(_req: NextRequest, {params}: {params: {USER_ID: string, OFFENSE_ID: string, SERVER_ID: string}}) {
  
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const server = global.servers[params.SERVER_ID]
    if (!server) return NextResponse.json({ error: "NOT_FOUND", message: "Server not found" }, { status: 404 })
    
    const botConnection = global.connections[server.managingBot]
    if (!botConnection || !botConnection.verified) return NextResponse.json({ error: "UNAVAILABLE", message: "This server is currently unavailable. Please try again later." }, { status: 503 })


    const isAdmin = await isAdminCheck(botConnection.connection, userID).catch(e=>e)
    if (isAdmin == "TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    if (!isAdmin.result) return NextResponse.json({ error: "UNAUTHORIZED", message: "You are not authorized to view this page." }, { status: 401 })



    const users = await getInvolvedUsers(botConnection.connection, params.USER_ID, params.OFFENSE_ID, true).catch(e=>e) as any

    if (users == "TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    if (users?.result.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
    if (!users?.result.users) return NextResponse.json({ error: "OFFENSE_NOT_FOUND", message: "OFFENSE_NOT_FOUND" }, { status: 404 })


    return NextResponse.json(users.result, { status: 200 })
}