import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
 

export async function GET(req: NextRequest) {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    return NextResponse.json({id: user.externalAccounts[0].externalId }, { status: 200 })
}