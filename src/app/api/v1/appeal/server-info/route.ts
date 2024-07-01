import { auth } from "@/utils/next-auth/auth"
import { getOffenses, getServerInfo } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
 

export async function GET(req: NextRequest) {
    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const serverInfo = await getServerInfo().catch(e=>e) as any

    if (serverInfo == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (serverInfo == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    
    return NextResponse.json({serverInfo}, { status: 200 })


}