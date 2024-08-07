import { getOffense } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
 
export async function GET(req: NextRequest, {params}: {params: {OFFENSE_ID: string}}) {
       
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId


    const offense = await getOffense(userID, params.OFFENSE_ID).catch(e=>e) as any

    if (offense == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (offense == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    
    if (offense?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })
    if (!offense.offense) return NextResponse.json({ error: "OFFENSE_NOT_FOUND", message: "Offense not found" }, { status: 404 })

    return NextResponse.json({ id: userID, offense: offense.offense }, { status: 200 })

}