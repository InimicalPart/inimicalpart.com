import { sendAndAwait } from '@/utils/conn';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { writeFileSync } from 'fs';
declare const global: ICOMGlobal;

let allowedIntentions = [
    "icom.appeal",
    "icom.oauth"
]

type wsType = import('ws').WebSocket 

export interface NoncedWebsocket extends Omit<wsType, 'send'> {
    send: (data: string | {[key:string]:any}, nonce?: string) => string | null;
}

export function UPGRADE(
    client: NoncedWebsocket,
    server: import('ws').WebSocketServer,
    request: import('next/server').NextRequest,
    context: import('next-ws/server').RouteContext<'/ws/bot/[UUID]'>
  ) {

    const params = context.params


    let callbackPath = process.env.NODE_ENV == "development" ? "http://api.localhost:3000/v1/oauth/callback" : "https://api.inimi.dev/v1/oauth/callback";
    const sendtoWS = client.send.bind(client);


    client.send = (data: string | {[key:string]:any}, nonce): string | null => {
        try {
            if (typeof data == "string") data = JSON.parse(data);  
        } catch (e) {
            console.error("clientSend can only accept object strings or objects");
            return null
        }

        data = data as Object;

        //! Generate a nonce used to identify the response, the client will send the same nonce back
        const messageNonce = nonce ?? crypto.randomBytes(16).toString('hex');
        data.nonce = messageNonce;
        const stringifiedMessage = JSON.stringify(data);

        sendtoWS(stringifiedMessage);
        return messageNonce;
    }

    if (!request.headers.get("host")?.startsWith('api.')) return client.close(3008, 'This server is only accessible through the "api" subdomain.');


    //! UUID regex match from request.url
    const uuid = params.UUID;

    const botConfig = Object.values(global.botConfig).find(bot => bot.connection.type == "ws" && bot.connection.uuid == uuid);

    if (!botConfig) return client.close(3008, 'Bot not found.');

    if (global.connections[botConfig.id]) {
        console.log(`Multiple connections for bot ${botConfig.name} (${botConfig.id}) detected.`);
        return client.close(3008, 'This bot already has an active connection.');
    }

    console.log(`${botConfig.name} (${botConfig.id}) connected, awaiting verification...`);

    const challengeCode = crypto.randomBytes(16).toString('hex');
    client.send({ type: "verification", challengeCode: challengeCode });
    global.connections[botConfig.id] = { type: "ws", connection: client, verified: false, intentions: [] };


    client.on('error', (err) => {
        console.error(`${botConfig.name} (${botConfig.id}) errored:`, err);
    });

    client.on("unexpected-response", (req, res) => {
        console.error(`${botConfig.name} (${botConfig.id}) unexpected response:`, res);
    })

    client.on('message', (message) => {
        let data = null;
        try {
            data = JSON.parse(message.toString());
        } catch (e) {
            console.error(`Error parsing message:`, e);
        }
        if (!data) return;

        if (data.type == "verification") {
            if (!validateChallengeCode(challengeCode, data.response)) {
                console.log(`${botConfig.name} (${botConfig.id}) failed to verify itself`);
                return client.close(3008, 'Invalid verification response.');
            }

            const intentions = data.intentions;

            if (!intentions) {
                console.log(`${botConfig.name} (${botConfig.id}) verified itself, but provided no intentions.`);
                return client.close(3008, 'No intentions provided.');
            } else if (!intentions.every((i: string) => allowedIntentions.includes(i))) {
                console.log(`${botConfig.name} (${botConfig.id}) verified itself, but provided invalid intentions.`);
                const invalidIntentions = intentions.filter((i: string) => !allowedIntentions.includes(i));

                return client.close(3008, `Invalid intentions provided: ${invalidIntentions.join(", ")}`);
            }

            console.log(`${botConfig.name} (${botConfig.id}) verified itself with intentions: ${intentions.join(", ")}`);
            global.connections[botConfig.id].verified = true;
            global.connections[botConfig.id].intentions = Array.from(new Set(intentions));
            client.send({
                type: "connected",
                name: botConfig.name,
                id: botConfig.id,
                intentions: Array.from(new Set(intentions))
            });
            
            if (intentions.includes("icom.oauth")) {
                sendAndAwait(client, { type: "query", query: "oauth-info" }, "query").then((data) => {
                    const encryptedCredentials = data.result;

                    if (!encryptedCredentials) {
                        console.warn("No credentials found when fetching oauth info from", botConfig.name + ".");
                        return;
                    } else {
                        const decrypted = crypto.publicDecrypt(botConfig.verificationKey, new Uint8Array(Buffer.from(encryptedCredentials, "base64"))).toString();
                        const [client_id, client_secret] = decrypted.split(":");

                        global.connections[botConfig.id].oauth = { client_id, client_secret };

                        console.log(`${botConfig.name} (${botConfig.id}) provided oauth credentials.`);

                        // confirm receipt
                        client.send({ type: "oauth-callback", callback: callbackPath });
                    }
                }).catch((e) => {
                    console.log(e)
                    console.warn("Query timed out when fetching oauth info from", botConfig.name + ".");
                })
            }

            sendAndAwait(client, { type: "query", query: "server-info" }, "query").then((data) => {
                global.servers[data.result?.id] = {
                    id: data.result?.id,
                    name: data.result?.name,
                    iconURL: data.result?.iconURL,
                    managingBot: botConfig.id
                };

            }).catch((e) => {
                console.warn("Query timed out when fetching server info from", botConfig.name + ".");
            })

            sendAndAwait(client, { type: "query", query: "bot-info" }, "query").then(async (data) => {
                global.botConfig[botConfig.id].name = data.result?.name;
                if (process.env.NEXT_RUNTIME === 'nodejs') {
            
                    const botConfPath = process.platform == "win32" ? process.env.USERPROFILE + "\\Documents\\inimi.dev\\3p-botConfig.jsonc" : "/srv/inimi.dev/3p-botConfig.jsonc"

                    writeFileSync(botConfPath, JSON.stringify(global.botConfig, null, 2));
                }
            
            }).catch((e) => {
                console.warn("Query timed out when fetching bot info from", botConfig.name + ".");
            })

            return;
        } else if (data.type == "ping") {
            client.send({ type: "pong" });
        } else if (!global.connections[botConfig.id].verified) {
            console.log(`${botConfig.name} (${botConfig.id}) sent a message before verification`);
            return client.send({ type: "error", message: "You must verify yourself before sending messages.", challengeCode: challengeCode });
        }

        //! Bot is verified

        if (data.type == "intentions-update") {
            let intentions = data.intentions;

            if (!intentions) {
                console.log(`${botConfig.name} (${botConfig.id}) wanted updated intentions, but provided no intentions.`);
                return client.close(3008, 'No intentions provided.');
            } else if (!intentions.every((i: string) => allowedIntentions.includes(i))) {
                console.log(`${botConfig.name} (${botConfig.id}) wanted updated intentions, but provided invalid intentions.`);
                const invalidIntentions = intentions.filter((i: string) => !allowedIntentions.includes(i));

                return client.close(3008, `Invalid intentions provided: ${invalidIntentions.join(", ")}`);
            }

            console.log(`${botConfig.name} (${botConfig.id}) updated intentions to: ${intentions.join(", ")}`);

            if ((!global.connections[botConfig.id].intentions.includes("icom.oauth") && intentions.includes("icom.oauth")) ||
                (global.connections[botConfig.id].intentions.includes("icom.oauth") || intentions.includes("icom.oauth")) && global.connections[botConfig.id].oauth == undefined
        ) {
                sendAndAwait(client, { type: "query", query: "oauth-info" }).then((data) => {
                    const encryptedCredentials = data.result;

                    if (!encryptedCredentials) {
                        console.warn("No credentials found when fetching oauth info from", botConfig.name + ".");
                        return;
                    } else {
                        const decrypted = crypto.publicDecrypt(botConfig.verificationKey, new Uint8Array(Buffer.from(encryptedCredentials, "base64"))).toString();
                        const [client_id, client_secret] = decrypted.split(":");

                        global.connections[botConfig.id].oauth = { client_id, client_secret };

                        console.log(`${botConfig.name} (${botConfig.id}) provided oauth credentials.`);

                        // confirm receipt
                        client.send({ type: "oauth-callback", callback: callbackPath });
                    }
                }).catch((e) => {
                    console.warn("Query timed out when fetching oauth info from", botConfig.name + ".");

                })
            }

            global.connections[botConfig.id].intentions = Array.from(new Set(intentions));
            return;
        }
    });
  
    client.on('close', (c,r) => {
        console.log(`${botConfig.name} (${botConfig.id}) disconnected: [${c}] -`, r.toString());
        delete global.connections[botConfig.id];
    });

    function validateChallengeCode(original: string, response: string) {
        try {
            if (!botConfig || !original || !response) return false;
            return crypto.publicDecrypt(botConfig.verificationKey, new Uint8Array(Buffer.from(response, "base64"))).toString() == original;
        } catch (e) {
            return false;
        }
    }

}
