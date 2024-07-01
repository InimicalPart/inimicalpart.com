import { auth } from "@/utils/next-auth/auth"
import { getOffenses, getUser, getUserInfo, getUsers, saveEmail, toggleAppealment } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
 
export async function GET(req: NextRequest, {params}: {params: {USER_ID: string, OFFENSE_ID: string}}) {
  
    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = session.user.user_id

    const sessionUser = await getUserInfo(userID).catch(e=>e) as any

    if (sessionUser == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (sessionUser == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    if (!sessionUser.admin) return NextResponse.json({ error: "UNAUTHORIZED", message: "You are not authorized to view this page." }, { status: 401 })

    const response = await toggleAppealment(params.USER_ID, params.OFFENSE_ID).catch(e=>e) as any

    if (response == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (response == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    if (response?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })

    return NextResponse.json(response, { status: 200 })


}


