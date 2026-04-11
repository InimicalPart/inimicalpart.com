import { NextRequest, NextResponse } from "next/server";

declare const global: ICOMGlobal;

const callbackPath = process.env.NODE_ENV === "development" ? "http://api.localhost:3000/v1/oauth/callback" : "https://api.inimi.dev/v1/oauth/callback";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    const error = req.nextUrl.searchParams.get("error");
    const state = req.nextUrl.searchParams.get("state");

    if (error && !state) {
        return NextResponse.json({
            status: 400,
            body: error
        })
    }

    const stateData = await decodeState(state as string);

    const bot = stateData.bot;

    if (!global.connections[bot] || !global.connections[bot].oauth) {
        return NextResponse.json({
            status: 400,
            body: "The bot that is managing this connection does not exist or is not connected."
        })
    }

    if (error) {
        global.connections[bot].connection.send(JSON.stringify({
            type: "oauth",
            error: error,
            identifier: stateData.identifier
        }));
        return NextResponse.json({
            status: 400,
            body: error
        })
    }

    const cID = global.connections[bot].oauth.client_id;
    const cSecret = global.connections[bot].oauth.client_secret;

    if (!code) {
        return NextResponse.json({
            status: 400,
            body: "No code provided"
        })
    }

    const token = await getToken(code);

    if (token.error) {
        global.connections[bot].connection.send(JSON.stringify({
            type: "oauth",
            error: token.error,
            identifier: stateData.identifier
        }));
        return NextResponse.json({
            status: 400,
            body: token.error
        })
    } else {
        global.connections[bot].connection.send(JSON.stringify({
            type: "oauth",
            oauth: {
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                expires_in: token.expires_in,
                redirect_uri: callbackPath
            },
            identifier: stateData.identifier
        }));
        return NextResponse.json({
            status: 200,
            body: "Successfully authenticated"
        })
    }



    

    async function getToken(code: string) {
        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: cID,
                client_secret: cSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: callbackPath
            })
        });

        return await response.json();
    }


    async function decodeState(state: string) {
        const data = Buffer.from(state, 'base64').toString('utf-8');
        return JSON.parse(data);
    }

}