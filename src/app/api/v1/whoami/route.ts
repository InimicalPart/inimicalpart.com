import { auth } from "@/utils/next-auth/auth"
import { getOffense, getOffenses } from "@/utils/iris"
import { NextApiRequest } from "next"
import { NextAuthRequest } from "next-auth/lib"
import { NextRequest, NextResponse } from "next/server"
 

export async function GET(req: NextRequest) {
    const session = await auth() as any
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Not authenticated" }, { status: 401 })
    
    return NextResponse.json(session, { status: 200 })
}