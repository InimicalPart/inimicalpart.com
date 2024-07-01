import { auth } from "@/utils/next-auth/auth"
import { getOffenses, getUserInfo, getUsers, getUsersOffenses, saveEmail } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
 
export async function GET(req: NextRequest, {params}: {params: {USER_ID: string}}) {
  
    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = session.user.user_id

    const user = await getUserInfo(userID).catch(e=>e) as any

    if (user == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (user == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    if (!user.admin) return NextResponse.json({ error: "UNAUTHORIZED", message: "You are not authorized to view this page." }, { status: 401 })

    const offenses = await getUsersOffenses(params.USER_ID).catch(e=>e) as any

    if (offenses == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (offenses == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    if (offenses?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })

    return NextResponse.json({ offenses: offenses.offenses }, { status: 200 })


}


