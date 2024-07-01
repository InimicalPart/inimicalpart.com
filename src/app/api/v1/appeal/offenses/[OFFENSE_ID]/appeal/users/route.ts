import { auth } from "@/utils/next-auth/auth"
import { appealOffense, getAppeal, getInvolvedUsers, getOffense, getOffenses } from "@/utils/iris"
import { NextApiRequest } from "next"
import { NextAuthRequest } from "next-auth/lib"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextAuthRequest, {params}: {params: {OFFENSE_ID: string}}) {

    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })

    const userID = session.user.user_id


    const users = await getInvolvedUsers(userID, params.OFFENSE_ID).catch(e=>e) as any

    if (users == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (users == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    if (users?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
    if (!users?.users) return NextResponse.json({ error: "OFFENSE_NOT_FOUND", message: "OFFENSE_NOT_FOUND" }, { status: 404 })


    return NextResponse.json(users, { status: 200 })
}