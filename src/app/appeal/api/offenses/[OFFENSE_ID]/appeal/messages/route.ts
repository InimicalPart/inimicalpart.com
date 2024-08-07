import { sendMessage } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
import DOMPurify from "dompurify"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: NextRequest, {params}: {params: {OFFENSE_ID: string}}) {

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const message = (await req.json()).message

    const window = new JSDOM("''").window
    const purify = DOMPurify(window)



    const status = await sendMessage({
        user_id: userID,
        offense_id: params.OFFENSE_ID,
        message: purify.sanitize(message.trim())
    }).catch(e=>e) as any 

    
    if (status == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (status == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
        
    if (status?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
    if (status.error) return NextResponse.json({ error: "MESSAGE_FAILED", message: status.error }, { status: 400 })

    return NextResponse.json(status, { status: 200 })

}