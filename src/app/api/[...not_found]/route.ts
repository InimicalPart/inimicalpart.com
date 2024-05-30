import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    return new NextResponse(JSON.stringify({
        error: "NOT_FOUND",
        message: "Whoops! This endpoint does not exist.",
        status: 404,
    }), {
        status: 404,
        headers: {
            "Content-Type": "application/json",
        },
    });
}