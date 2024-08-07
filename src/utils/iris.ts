import EventEmitter from "node:events";
import IPCSocket from "./ipc"

let ipc = IPCSocket.getInstance();

function createVerifiableNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function connectToIRIS(): Promise<typeof import('node-ipc')> {
    return new Promise(async (resolve, reject) => {
        const internal_ipc = IPCSocket.getInstance()


        if (IPCSocket.connected) {
            if (process.env.NODE_ENV == "development") console.log("Already connected to IRIS");
            ipc = internal_ipc;
            resolve(internal_ipc);
            return;
        }

        ipc.of.iris.on("connect", () => {
            if (process.env.NODE_ENV == "development") console.log("Re-connected to IRIS");
            ipc.of.iris.off("error", IRISNotOnline);
            ipc = internal_ipc;
            resolve(internal_ipc);
        });

        function IRISNotOnline() {
            ipc.of.iris.off("error", IRISNotOnline);
            ipc.disconnect("iris");
            reject("IRIS is not online.");
        }

        ipc.of.iris.on("error", IRISNotOnline);
    })
}


export async function query(type: string, data: any) {
    const ipc = await connectToIRIS().catch(e=>e)
    const verifiableNonce = createVerifiableNonce();
    
    return new Promise((resolve, reject) => {
        if (ipc == "IRIS is not online.") return reject("IRIS is not online.")
        ipc.of.iris.on("query", (data: any) => {
            if (data.type == type && data.verifiableNonce == verifiableNonce) {
                if (data.code) reject(data.code);
                else resolve(data.data);
            }
        })

        ipc.of.iris.emit("query", {
            type: type,
            ...(data ? {data: data} : {}),
            verifiableNonce: verifiableNonce
        });

    })  
}









export async function getOffenses(user_id: string) {
    const type = "mod:offenses:get";
    const data = {
        user_id: user_id
    }

    return await query(type, data);
}

export async function getOffense(user_id: string, offense_id: string, asAdmin: boolean = false) {
    const type = asAdmin ? "mod:admin:offense:get" : "mod:offense:get";
    const data = {
        user_id: user_id,
        offense_id: offense_id
    }

    return await query(type, data);
}

export async function getUserInfo(user_id: string) {
    const type = "mod:admin:is";
    const data = {
        user_id: user_id
    }

    return await query(type, data);
}

export async function getUsers() {
    const type = "mod:admin:users";
    return await query(type, null);
}

export async function getUser(user_id: string) {
    const type = "mod:admin:user";
    const data = {
        user_id: user_id
    }

    return await query(type, data);
}

export async function toggleAppealment(user_id: string, offense_id: string) {
    const type = "mod:admin:offense:toggleAppealment";
    const data = {
        user_id: user_id,
        offense_id: offense_id
    }

    return await query(type, data);
}

export async function revokeOffense(closer_id: string, offense_id: string) {
    const type = "mod:admin:offense:revoke";
    const data = {
        closer_id: closer_id,
        offense_id: offense_id
    }

    return await query(type, data);
}

export async function denyAppeal(closer_id: string, offense_id: string) {
    const type = "mod:admin:appeal:deny";
    const data = {
        closer_id: closer_id,
        offense_id: offense_id
    }

    return await query(type, data);
}



export async function getUsersOffenses(user_id: string) {
    const type = "mod:admin:users:offenses";
    const data = {
        user_id: user_id
    }

    return await query(type, data);
}

export async function appealOffense(user_id: string, offense_id: string, message: string) {
    const type = "mod:appeal:create";
    const data = {
        user_id: user_id,
        offense_id: offense_id,
        message: message
    }

    return await query(type, data);
}

export async function getAppeal(user_id: string, offense_id: string) {
    const type = "mod:appeal:get";
    const data = {
        user_id: user_id,
        offense_id: offense_id
    }

    return await query(type, data);
}

export async function getServerInfo() {
    const type = "server:info";
    return await query(type, null);
}

export async function sendMessage(settings:{
    user_id: string,
    offense_id: string,
    message: string,
    admin?: boolean,
    send_as?: string,
    anonymous?: boolean
}) {
    const type = settings.admin ? "mod:admin:appeal:message:create" : "mod:appeal:message:create";
    const data = {
        ...{
            user_id: settings.user_id,
            offense_id: settings.offense_id,
            message: settings.message
        },
        ...settings.admin ? {admin: true, send_as: settings.send_as, anonymous: settings.anonymous ?? false} : {},
    }

    if (settings.message.length > 2000) throw new Error("MESSAGE_TOO_LONG");
    if (settings.message.length < 1) throw new Error("MESSAGE_TOO_SHORT");

    return await query(type, data);
}

export async function getInvolvedUsers(user_id: string, offense_id:string, asAdmin: boolean = false) {
    const type = asAdmin ? "mod:admin:appeal:getUsers" : "mod:appeal:getUsers"
    const data = {
        user_id: user_id,
        offense_id: offense_id
    }

    return await query(type, data);
}


export async function saveEmail(user_id: string, email: string) {
    const type = "db:user:saveEmail";
    const data = {
        user_id: user_id,
        email: email
    }

    return await query(type, data);
}

export class AppealListener {
    private offense_id: string | null;
    private user_id: string;
    private emitter: EventEmitter = new EventEmitter();
    private verifiableNonce: string;

    private listeningEvent: string;
    private callback: (data: any) => void;

    private ipc = IPCSocket.getInstance();

    constructor(user_id:string, offense_id?: string) {
        this.offense_id = offense_id || null;
        this.user_id = user_id;
        this.verifiableNonce = createVerifiableNonce();

        if (this.offense_id) {
            this.listeningEvent = `user:${this.user_id}:offenses:${this.offense_id}`
        } else {
            this.listeningEvent = `user:${this.user_id}:offenses`
        }


        this.callback = (data: any) => {
            this.emitter.emit("message", data);
        }

        this.ipc.of.iris.on(this.listeningEvent, (data: any) => {
            if (data.verifiableNonce == this.verifiableNonce) {
                this.callback(data);
            }
        })

        this.ipc.of.iris.emit("subscribe", {event: this.listeningEvent, verifiableNonce: this.verifiableNonce});
        
    }

    public start(listener: (data: any) => void) {
        this.emitter.on("message", listener);
    }

    public stop(listener: (data: any) => void) {
        this.emitter.off("message", listener);
    }

    public end() {
        this.ipc.of.iris.off(this.listeningEvent, this.callback);
        this.ipc.of.iris.emit("unsubscribe", {event: this.listeningEvent, verifiableNonce: this.verifiableNonce});
    }

}