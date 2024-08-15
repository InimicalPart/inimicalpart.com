import { getServerInfo } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
 
declare const global: ICOMGlobal

export async function GET(req: NextRequest, {params}: {params: {SERVER_ID: string}}) {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const server = global.servers[params.SERVER_ID]
        
    if (!server) return NextResponse.json({ error: "NOT_FOUND", message: "Server not found" }, { status: 404 })
    
    return NextResponse.json({
        serverInfo: {
            id: server.id,
            name: server.name,
            icon: server.iconURL
        }
    }, { status: 200 })


}