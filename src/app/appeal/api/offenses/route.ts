import { getOffenses } from "@/utils/iris"
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
 
export async function GET(req: NextRequest) {
  
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    const userID = user.externalAccounts[0].externalId

    const offenses = await getOffenses(userID).catch(e=>e) as any


    if (offenses == "IRIS is not online.") return NextResponse.json({ error: "IRIS_UNAVAILABLE", message: "IRIS is currently unavailable. Please try again later." }, { status: 503 })
    if (offenses == "QUERY_TIMEOUT") return NextResponse.json({ error: "QUERY_TIMEOUT", message: "Query timed out" }, { status: 500 })
    if (offenses?.error == "INVALID_ACTION") return NextResponse.json({ error: "INVALID_ACTION", message: "This action is invalid for this offense." }, { status: 400 })

    return NextResponse.json({ id: userID, offenses: offenses.offenses }, { status: 200 })


}


