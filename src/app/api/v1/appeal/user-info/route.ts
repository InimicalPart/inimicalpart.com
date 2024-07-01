import { auth } from "@/utils/next-auth/auth"
import { getOffenses, getUserInfo, saveEmail } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
 
export async function GET(req: NextRequest) {
  
    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = session.user.user_id

    const uInfo = await getUserInfo(userID).catch(e=>e) as any


    if (uInfo == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (uInfo == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    return NextResponse.json({ admin: uInfo.admin }, { status: 200 })


}


