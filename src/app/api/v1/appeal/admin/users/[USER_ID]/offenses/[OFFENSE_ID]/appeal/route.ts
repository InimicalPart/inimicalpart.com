import { auth } from "@/utils/next-auth/auth"
import { appealOffense, getAppeal, getOffense, getOffenses, getUserInfo } from "@/utils/iris"
import DOMPurify from "dompurify"
import { JSDOM } from "jsdom"
import { NextApiRequest } from "next"
import { NextAuthRequest } from "next-auth/lib"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextAuthRequest, {params}: {params: {USER_ID: string, OFFENSE_ID: string}}) {

    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })

    const userID = session.user.user_id


    const user = await getUserInfo(userID).catch(e=>e) as any

    if (user == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (user == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    if (!user.admin) return NextResponse.json({ error: "UNAUTHORIZED", message: "You are not authorized to view this page." }, { status: 401 })


    const offense = await getAppeal(params.USER_ID, params.OFFENSE_ID).catch(e=>e) as any

    if (offense == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (offense == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })

    if (offense?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })

    return NextResponse.json({ id: userID, appeal: offense }, { status: 200 })
}