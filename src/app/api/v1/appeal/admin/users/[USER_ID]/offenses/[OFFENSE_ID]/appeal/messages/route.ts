import { auth } from "@/utils/next-auth/auth"
import { sendMessage } from "@/utils/iris"
import { NextApiRequest } from "next"
import { NextAuthRequest } from "next-auth/lib"
import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
import DOMPurify from "dompurify"

export async function POST(req: NextRequest, {params}: {params: {USER_ID: string, OFFENSE_ID: string}}) {

    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })

    const userID = session.user.user_id

    const {message, anonymous} = (await req.json()) as {message: string, anonymous: boolean}

    const window = new JSDOM("''").window
    const purify = DOMPurify(window)



    const status = await sendMessage({
        user_id: params.USER_ID,
        offense_id: params.OFFENSE_ID,
        message: purify.sanitize(message.trim()),
        admin: true,
        send_as: userID,
        anonymous: !!anonymous ?? false

    }).catch(e=>e) as any 

    
    if (status == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (status == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    
    if (status?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
            
    if (status.error) return NextResponse.json({ error: "MESSAGE_FAILED", message: status.error }, { status: 400 })

    return NextResponse.json(status, { status: 200 })

}