import crypto from 'crypto';
import { WebSocket } from 'ws';

export function sendAndAwait(ws: WebSocket, message: any, timeout: number = 30000): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            if (typeof message == "string") message = JSON.parse(message);  
        } catch (e) {
            console.error("sendAndAwait can only accept object strings or objects");
            return reject(e);
        }

        //! Generate a nonce used to identify the response, the client will send the same nonce back
        const nonce = crypto.randomBytes(16).toString('hex');
        message.nonce = nonce;
        const stringifiedMessage = JSON.stringify(message);


        function onReceive(message: string) {
            let data = null;
            try {
                data = JSON.parse(message.toString());
            } catch (e) {
                console.error(`Error parsing message:`, e);
            }
            if (!data) return;

            if (data.nonce == nonce) {
                clearTimeout(timeouter);
                resolve(data);
            }
        }

        
        let timeouter = setTimeout(() => {
            console.log("Timeout reached for message", stringifiedMessage);
            ws.off('message', onReceive);
            reject("TIMEOUT");
        }, timeout);
        
        ws.on('message', onReceive)
        ws.send(stringifiedMessage);
    })
}

// ! ------------------------------------------------- ! //
// ! -- ASCP (Appeal System Communication Protocol) -- ! //
// ! ------------------------------------------------- ! //

export function isAdminCheck(ws: WebSocket, user_id: string, timeout?: number): Promise<{ admin: boolean }> {
    return sendAndAwait(ws, { type: "query", query: "admin", data: { user_id } }, timeout);
}

export function approveAppeal(ws: WebSocket, closer_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "approve-appeal", data: { closer_id, offense_id } }, timeout);
}

export function denyAppeal(ws: WebSocket, closer_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "deny-appeal", data: { closer_id, offense_id } }, timeout);
}

export async function sendMessage(ws: WebSocket, settings:{
    user_id: string,
    offense_id: string,
    message: string,
    admin?: boolean,
    send_as?: string,
    anonymous?: boolean
}, timeout?: number) {
    
    return sendAndAwait(ws, { type: "request" , request: "send-message", data: {
        ...{
            user_id: settings.user_id,
            offense_id: settings.offense_id,
            message: settings.message
        },
        ...settings.admin ? {admin: true, send_as: settings.send_as, anonymous: settings.anonymous ?? false} : {},
    }}, timeout)
}

export async function getInvolvedUsers(ws: WebSocket, user_id: string, offense_id: string, admin: boolean = false, timeout?: number) {
    return sendAndAwait(ws, {type: "query", query: "involvedUsers", data: {user_id, offense_id, admin}}, timeout)
}

export async function getAppeal(ws: WebSocket, user_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, {type: "query", query: "appeal", data: {user_id, offense_id}}, timeout)
}

export function revokeOffense(ws: WebSocket, closer_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "revoke-offense", data: { closer_id, offense_id } }, timeout);
}

export function toggleAppealment(ws: WebSocket, user_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "toggle-appealment", data: { user_id, offense_id } }, timeout);
}

export function getOffense(ws: WebSocket, user_id: string, offense_id: string, admin?: boolean, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "offense", data: { user_id, offense_id, admin } }, timeout);
}

export function getUsersOffenses(ws: WebSocket, user_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "usersOffenses", data: { user_id } }, timeout);
}

export function getUser(ws: WebSocket, user_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "user", data: { user_id } }, timeout);
}

export function getUsersWithOffenses(ws: WebSocket, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "usersWithOffenses", data: { } }, timeout);
}

export async function appealOffense(ws: WebSocket, user_id: string, offense_id: string, message: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "create-appeal", data: { user_id, offense_id, message } }, timeout);
}

export async function getOffenses(ws: WebSocket, user_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "offenses", data: { user_id } }, timeout);
}