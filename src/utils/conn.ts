import { NoncedWebsocket } from '@/app/ws/bot/[UUID]/route';
import crypto from 'crypto';
import { WebSocket } from 'ws';

export function sendAndAwait(ws: NoncedWebsocket, message: any, typeRequest: string | null = null, timeout: number = 30000): Promise<any> {
    return new Promise((resolve, reject) => {

        //! Generate a nonce used to identify the response, the client will send the same nonce back
        const nonce = crypto.randomBytes(16).toString('hex');


        function onReceive(message: string) {
            let data = null;
            try {
                data = JSON.parse(message.toString());
            } catch (e) {
                console.error(`Error parsing message:`, e);
            }
            if (!data) return;

            if (data.nonce == nonce && (typeRequest == null || data.type == typeRequest)) {
                clearTimeout(timeouter);
                resolve(data);
            }
        }

        
        let timeouter = setTimeout(() => {
            console.log("Timeout reached for message", message);
            ws.off('message', onReceive);
            reject("TIMEOUT");
        }, timeout);
        
        ws.on('message', onReceive)
        ws.send(message, nonce);
    })
}

// ! ------------------------------------------------- ! //
// ! -- ASCP (Appeal System Communication Protocol) -- ! //
// ! ------------------------------------------------- ! //

function isAdminCheck(ws: NoncedWebsocket, user_id: string, timeout?: number): Promise<{ admin: boolean }> {
    return sendAndAwait(ws, { type: "query", query: "admin", data: { user_id } }, "query", timeout);
}

function approveAppeal(ws: NoncedWebsocket, closer_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "approve-appeal", data: { closer_id, offense_id } }, "request", timeout);
}

function denyAppeal(ws: NoncedWebsocket, closer_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "deny-appeal", data: { closer_id, offense_id } }, "request", timeout);
}

async function sendMessage(ws: NoncedWebsocket, settings:{
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
    }}, "request", timeout)
}

async function getInvolvedUsers(ws: NoncedWebsocket, user_id: string, offense_id: string, admin: boolean = false, timeout?: number) {
    return sendAndAwait(ws, {type: "query", query: "involvedUsers", data: {user_id, offense_id, admin}}, "query", timeout)
}

async function getAppeal(ws: NoncedWebsocket, user_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, {type: "query", query: "appeal", data: {user_id, offense_id}}, "query", timeout)
}

function revokeOffense(ws: NoncedWebsocket, closer_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "revoke-offense", data: { closer_id, offense_id } }, "request", timeout);
}

function toggleAppealment(ws: NoncedWebsocket, user_id: string, offense_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "toggle-appealment", data: { user_id, offense_id } }, "request", timeout);
}

function getOffense(ws: NoncedWebsocket, user_id: string, offense_id: string, admin?: boolean, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "offense", data: { user_id, offense_id, admin } }, "query", timeout);
}

function getUsersOffenses(ws: NoncedWebsocket, user_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "usersOffenses", data: { user_id } }, "query", timeout);
}

function getUser(ws: NoncedWebsocket, user_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "user", data: { user_id } }, "query", timeout);
}

function getUsersWithOffenses(ws: NoncedWebsocket, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "usersWithOffenses", data: { } }, "query", timeout);
}

async function appealOffense(ws: NoncedWebsocket, user_id: string, offense_id: string, message: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "create-appeal", data: { user_id, offense_id, message } }, "request", timeout);
}

async function getOffenses(ws: NoncedWebsocket, user_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "offenses", data: { user_id } }, "query", timeout);
}

async function getEvidence(ws: NoncedWebsocket, offense_id: string, admin = false, timeout?: number) {
    return sendAndAwait(ws, { type: "query", query: "evidence", data: { offense_id, admin } }, "query", timeout);
}

async function retractEvidence(ws: NoncedWebsocket, user_id: string, offense_id: string, evidence_id: string, timeout?: number) {
    return sendAndAwait(ws, { type: "request", request: "retract-evidence", data: { user_id, offense_id, evidence_id} }, "request", timeout);
}