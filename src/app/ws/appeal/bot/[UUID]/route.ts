import { sendAndAwait } from '@/utils/conn';
import crypto from 'crypto';
import { writeFileSync } from 'fs';
declare const global: ICOMGlobal;

export function SOCKET(
    client: import('ws').WebSocket,
    request: import('http').IncomingMessage,
    server: import('ws').WebSocketServer,
  ) {


    if (!request.headers.host?.startsWith('api.')) return client.close(3008, 'This server is only accessible through the "api" subdomain.');


    //! UUID regex match from request.url
    const uuid = request.url?.match(/\/bot\/(.*)/)?.[1];

    const botConfig = Object.values(global.botConfig).find(bot => bot.connection.type == "ws" && bot.connection.uuid == uuid);

    if (!botConfig) return client.close(3008, 'Bot not found.');

    if (global.connections[botConfig.id]) {
        console.log(`Multiple connections for bot ${botConfig.name} (${botConfig.id}) detected.`);
        return client.close(3008, 'This bot already has an active connection.');
    }

    console.log(`${botConfig.name} (${botConfig.id}) connected, awaiting verification...`);

    const challengeCode = crypto.randomBytes(16).toString('hex');
    client.send(JSON.stringify({ type: "verification", challengeCode: challengeCode }));
    global.connections[botConfig.id] = { type: "ws", connection: client, verified: false };



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
            console.log(`${botConfig.name} (${botConfig.id}) verified itself`);
            global.connections[botConfig.id].verified = true;
            client.send(JSON.stringify({ type: "connected", name: botConfig.name, id: botConfig.id }));
            
            sendAndAwait(client, { type: "query", query: "server-info" }).then((data) => {
                global.servers[data.result?.id] = {
                    id: data.result?.id,
                    name: data.result?.name,
                    iconURL: data.result?.iconURL,
                    managingBot: botConfig.id
                };

            }).catch((e) => {
                console.warn("Query timed out when fetching server info from", botConfig.name + ".");
            })

            sendAndAwait(client, { type: "query", query: "bot-info" }).then(async (data) => {
                global.botConfig[botConfig.id].name = data.result?.name;
                if (process.env.NEXT_RUNTIME === 'nodejs') {
            
                    const botConfPath = process.platform == "win32" ? process.env.USERPROFILE + "\\Documents\\inimicalpart.com\\3p-botConfig.jsonc" : "/srv/inimicalpart.com/3p-botConfig.jsonc"

                    writeFileSync(botConfPath, JSON.stringify(global.botConfig, null, 2));
                }
            
            }).catch((e) => {
                console.warn("Query timed out when fetching server info from", botConfig.name + ".");
            })

            return;
        } else if (!global.connections[botConfig.id].verified) {
            console.log(`${botConfig.name} (${botConfig.id}) sent a message before verification`);
            return client.send(JSON.stringify({ type: "error", message: "You must verify yourself before sending messages.", challengeCode: challengeCode }));
        }

        //! Bot is verified
    });
  
    client.on('close', () => {
        console.log(`${botConfig.name} (${botConfig.id}) disconnected`);
        delete global.connections[botConfig.id];
    });

    function validateChallengeCode(original: string, response: string) {
        try {
            if (!botConfig || !original || !response) return false;
            return crypto.publicDecrypt(botConfig.verificationKey, Buffer.from(response, "base64")).toString() == original;
        } catch (e) {
            return false;
        }
    }

}
