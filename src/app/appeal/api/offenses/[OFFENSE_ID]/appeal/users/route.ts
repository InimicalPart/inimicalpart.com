import { getInvolvedUsers } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(_req: NextRequest, {params}: {params: {OFFENSE_ID: string}}) {

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const users = await getInvolvedUsers(userID, params.OFFENSE_ID).catch(e=>e) as any

    if (users == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (users == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    if (users?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
    if (!users?.users) return NextResponse.json({ error: "OFFENSE_NOT_FOUND", message: "OFFENSE_NOT_FOUND" }, { status: 404 })


    return NextResponse.json(users, { status: 200 })
}