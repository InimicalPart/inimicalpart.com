import { Response, Request, Router } from "express-serve-static-core";
import crypto from 'node:crypto';
import { encrypt, decrypt, verify } from "../utils/encryption.js";
import { MongoClient } from "mongodb";

import { config } from "dotenv";
import expressWs, { RouterLike } from "express-ws";

// log current working directory
config({ path: "./dist/.env" });

import { rateLimit } from 'express-rate-limit'
import { Application } from "express";
import https from "https";
import fs from "fs";
import { WebSocket } from "ws";

const createLimit = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 10,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    keyGenerator: function (req: Request) {
        return (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string
    },
    requestWasSuccessful: function (req: Request, res: Response) {
        return res.statusCode < 400
    }
})

const checkPasswordLimit = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 6,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    keyGenerator: function (req: Request) {
        return (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string
    },
    requestWasSuccessful: function (req: Request, res: Response) {
        return res.statusCode < 400
    }
})


export async function main(API: RouterLike) {
    // Endpoints:
    //   - /notes/get (GET)
    //   - /notes/create (POST)
    //   - /notes/retrieve (POST)
    //   - /notes/update (PATCH)
    //   - /notes/delete (DELETE)
    //   - ...
    interface SessionInformation {
        ws: WebSocket,
        id?: string,
        key?: string,
        password?: string,
        status: "UNIDENTIFIED" | "IDENTIFIED",
        data?: string,
        awaitingDatabaseUpdate?: boolean,
        lastDatabaseUpdate?: number,
        databaseUpdateTimer?: NodeJS.Timeout,
        lastModified?: number,
        heartbeat: {
            id: number,
            received: boolean,
            timer: NodeJS.Timeout
        }
    }
    const sessionInformation: Partial<SessionInformation> = {}

    const getUniqueID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4();
    };
    
    interface DifferenciatedWebSocket extends WebSocket {
        id: string
    }

    API.ws("/notes/ws", (ws: DifferenciatedWebSocket, req) => {
        ws.id = getUniqueID();
        console.log("Websocket connection established. WSID: " + ws.id);
        sessionInformation[ws.id] = {
            ws,
            status: "UNIDENTIFIED"
        }
        //TODO: Keep track of all websockets and their id's so collab works
        ws.send(JSON.stringify({
            event: "IDENTIFY"
        }))
        console.log("Sent IDENTIFY event. WSID: " + ws.id);
        sessionInformation[ws.id].heartbeat = {
            timer: null,
            received: true, 
            id: 0
        }
        sessionInformation[ws.id].heartbeat.timer = setInterval(() => {
            if (!sessionInformation[ws.id].heartbeat.received) {
                console.error("Websocket didn't respond to heartbeat. Closing. WSID: " + ws.id);
                ws.close();
                clearInterval(sessionInformation[ws.id].heartbeat.timer as NodeJS.Timeout);
                return;
            }
            console.log("Sent HEARTBEAT event. WSID: " + ws.id);
            sessionInformation[ws.id].heartbeat.received = false;
            sessionInformation[ws.id].heartbeat.id = Math.floor(Math.random() * 100000 - 1) + 1; //? Client should send back this ID + 1 to verify that it received the heartbeat
            ws.send(JSON.stringify({
                event: "HEARTBEAT",
                id: sessionInformation[ws.id].heartbeat.id
            }))
        }, 30000)
        ws.on('message', async function(msg) {
            let client = null
            try {
                let data = JSON.parse(msg.toString());
                if (data.event === "IDENTIFY") {

                    client = new MongoClient(process.env.MongoDBConnectionString as string)
                    let db = client.db("notes-inimicalpart-com");
                    let collection = db.collection("notes");
                    let note;
                    try {
                        note = await collection.findOne({ id: data.id });
                    } finally {
                        client.close();
                    }

                    if (!note) {
                        console.error("Websocket tried to identify with an invalid ID. WSID: " + ws.id);
                        ws.send(JSON.stringify({
                            event: "ERROR",
                            error: "INVALID_ID",
                            msg: "Invalid ID."
                        }))
                        return;
                    }
                    if (note.viewKey === data.key) {
                        console.error("Websocket tried to identify with an viewer key. WSID: " + ws.id);
                        ws.send(JSON.stringify({
                            event: "ERROR",
                            error: "MISSING_PERMISSIONS",
                            msg: "Missing permissions."
                        }))
                        return;
                    }
                    if (note.editorKey !== data.key) {
                        console.error("Websocket tried to identify with an invalid key. WSID: " + ws.id);
                        ws.send(JSON.stringify({
                            event: "ERROR",
                            error: "INVALID_KEY",
                            msg: "Invalid key."
                        }))
                        return;
                    }

                    let decrypted = decrypt(note.contents, data.password);
                    if (!decrypted) {
                        console.error("Websocket tried to identify with an invalid password. WSID: " + ws.id);
                        ws.send(JSON.stringify({
                            event: "ERROR",
                            error: "INVALID_PASSWORD",
                            msg: "Invalid password."
                        }))
                        return;
                    }
                    


                    sessionInformation[ws.id] = {
                        ...sessionInformation[ws.id],
                        ws,
                        id: data.id,
                        key: data.key,
                        password: data.password,
                        status: "IDENTIFIED"
                    }
                    console.log("Websocket identified itself as editor for note " + data.id + ". WSID: " + ws.id);
                    ws.send(JSON.stringify({
                        event: "IDENTIFIED"
                    }))
                } else if (data.event === "UPDATE") {
                    if (sessionInformation[ws.id].status !== "IDENTIFIED") {
                        console.error("Websocket tried to update without identifying. WSID: " + ws.id);
                        ws.send(JSON.stringify({
                            event: "ERROR",
                            error: "NOT_IDENTIFIED",
                            msg: "You must identify before updating."
                        }))
                        return;
                    }

                    if (typeof data.type !== "string") {
                        console.error("Websocket tried to update without a valid type. WSID: " + ws.id);
                        ws.send(JSON.stringify({
                            event: "ERROR",
                            error: "TYPE_NOT_STRING",
                            msg: "Type must be a string."
                        }))
                        return;
                    }

                    if (typeof data.data !== "string") {
                        console.error("Websocket tried to update without a valid data. WSID: " + ws.id);
                        ws.send(JSON.stringify({
                            event: "ERROR",
                            error: "DATA_NOT_STRING",
                            msg: "Data must be a string."
                        }))
                        return;
                    }

                    if (data.type == "CONTENT") {
                        if (Object.keys(JSON.parse(data.data)).some(key => !["title", "content"].includes(key)) || !Object.keys(JSON.parse(data.data)).includes("title") || !Object.keys(JSON.parse(data.data)).includes("content")) {
                            console.error("Websocket tried to update without a valid data. WSID: " + ws.id);
                            ws.send(JSON.stringify({
                                event: "ERROR",
                                error: "DATA_NOT_VALID",
                                msg: "Data must be a valid JSON with title and content keys."
                            }))
                            return;
                        }

                        let encrypted = encrypt(data.data, sessionInformation[ws.id].password);
                        if (!encrypted) {
                            console.error("Websocket tried to update without a valid data. WSID: " + ws.id);
                            ws.send(JSON.stringify({
                                event: "ERROR",
                                error: "SOMETHING_WENT_WRONG",
                                msg: "Something went wrong"
                            }))
                            return;
                        }
                        sessionInformation[ws.id].data = encrypted;
                        console.log("Websocket updated note " + sessionInformation[ws.id].id + ". WSID: " + ws.id);
                        sessionInformation[ws.id].awaitingDatabaseUpdate = true;
                        sessionInformation[ws.id].lastModified = new Date().getTime();
                        if (!sessionInformation[ws.id].databaseUpdateTimer) { 
                            sessionInformation[ws.id].databaseUpdateTimer = setTimeout(async () => {
                                client = new MongoClient(process.env.MongoDBConnectionString as string)
                                let db = client.db("notes-inimicalpart-com");
                                let collection = db.collection("notes");
                                let note;
                                try {
                                    note = await collection.findOne({ id: sessionInformation[ws.id].id });
                                } catch (e) {
                                    console.error(e);
                                    client.close();
                                    return;
                                }
                                if (!note) {
                                    client.close();
                                    return;
                                }
                                let decrypted = decrypt(note.contents, sessionInformation[ws.id].password);
                                if (!decrypted) {
                                    client.close();
                                    return;
                                }
                                let encrypted = sessionInformation[ws.id].data
                                try {
                                    await collection.updateOne({ id: sessionInformation[ws.id].id }, { $set: { contents: encrypted, "info.lastModified": sessionInformation[ws.id].lastModified } });
                                } catch (e) {
                                    console.error(e);
                                    client.close();
                                    return;
                                }
                                console.log("Updated note " + sessionInformation[ws.id].id + ". WSID: " + ws.id);
                                sessionInformation[ws.id].awaitingDatabaseUpdate = false;
                                sessionInformation[ws.id].lastDatabaseUpdate = new Date().getTime();
                                client.close();
                            },60000)
                        }
                        ws.send(JSON.stringify({
                            event: "UPDATED",
                            type: "CONTENT",
                        }))
                    
                    }
                } else if (data.event === "HEARTBEAT") {
                    if (sessionInformation[ws.id].heartbeat.id + 1 !== data.id) {
                        console.error("Websocket heartbeat ID didn't match. Closing. WSID: " + ws.id);
                        ws.close();
                        clearInterval(sessionInformation[ws.id].heartbeat.timer as NodeJS.Timeout);
                        return;
                    }
                    console.log("Websocket sent valid heartbeat ("+sessionInformation[ws.id].heartbeat.id+"). WSID: " + ws.id);
                    sessionInformation[ws.id].heartbeat.received = true;
                    ws.send(JSON.stringify({
                        event: "RCVD",
                        id: data.id
                    }))
                }
                    

            } catch (e) {
                // JSON.parse failed
                if (e instanceof SyntaxError) {
                    console.error("JSON.parse failed. WSID: " + ws.id);
                    try {
                        client.close()
                    } catch (e) {}
                    ws.send(JSON.stringify({
                        event: "ERROR",
                        error: "JSON_PARSE_FAILED",
                        msg: "Invalid JSON."
                    }))
                    
                }
            }
        });
        ws.on('close', async function() {
            console.log("Websocket connection closed. WSID: " + ws.id);
            clearInterval(sessionInformation[ws.id].heartbeat.timer as NodeJS.Timeout);
            
            if (sessionInformation[ws.id].awaitingDatabaseUpdate) {
                let client = new MongoClient(process.env.MongoDBConnectionString as string)
                let db = client.db("notes-inimicalpart-com");
                let collection = db.collection("notes");

                let note;
                try {
                    note = await collection.findOne({ id: sessionInformation[ws.id].id });
                } catch (e) {
                    console.error(e);
                    client.close();
                    return;
                }
                if (!note) {
                    client.close();
                    return;
                }
                let decrypted = decrypt(note.contents, sessionInformation[ws.id].password);
                if (!decrypted) {
                    client.close();
                    return;
                }

                let encrypted = sessionInformation[ws.id].data
                try {
                    await collection.updateOne({ id: sessionInformation[ws.id].id }, { $set: { contents: encrypted, "info.lastModified": sessionInformation[ws.id].lastModified } });
                } catch (e) {
                    console.error(e);
                    client.close();
                    return;
                }
                console.log("Updated note " + sessionInformation[ws.id].id + ". WSID: " + ws.id);
                sessionInformation[ws.id].awaitingDatabaseUpdate = false;
                sessionInformation[ws.id].lastDatabaseUpdate = new Date().getTime();
                clearTimeout(sessionInformation[ws.id].databaseUpdateTimer as NodeJS.Timeout);


            }
            delete sessionInformation[ws.id];
        })
    })
    API.post("/notes/retrieve", checkPasswordLimit, async (req: Request, res: Response) => {
        let {id, key, password} = req.body;
        if (!id || !key || !password) {
            return res.status(400).send({
                msg: "Note ID, key or password missing.",
                error: "ID_OR_KEY_OR_PASSWORD_MISSING"  
            });
        }

        // connect to database
        const client = new MongoClient(process.env.MongoDBConnectionString as string)
        const db = client.db("notes-inimicalpart-com");
        const collection = db.collection("notes");

        // get note
        let note;
        try {
            note = await collection.findOne({ id });
        } catch (e) {
            console.error(e);
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"
            });
        }
        if (!note) {
            client.close();
            return res.status(404).send({
                msg: "Note not found.",
                error: "NOT_FOUND"
            });
        }

        if (note.editorKey !== key && note.viewKey !== key) {
            client.close();
            return res.status(403).send({
                msg: "Invalid key.",
                error: "INVALID_KEY"
            });
        }

        // decrypt note
        let decrypted = decrypt(note.contents, password);
        if (!decrypted) {
            client.close();
            return res.status(403).send({
                msg: "Invalid password.",
                error: "INVALID_PASSWORD"
            });
        }

        // return note information
        client.close()
        return res.status(200).send({
            id: note.id,
            settings: {password: true, ...note.settings},
            title: JSON.parse(decrypted).title,
            content: JSON.parse(decrypted).content,
            info: note.info
        });


    })

    API.patch("/notes/update", async (req: Request, res: Response) => {
        // id, owners key, changes (key:value pairs)
        let { id, key, changes, password } = req.body;
        if (!id || !key || !changes || !password) {
            return res.status(400).send({
                msg: "Note ID, key, changes or password missing.",
                error: "MISSING_INFORMATION"  
            });
        }

        // connect to database
        const client = new MongoClient(process.env.MongoDBConnectionString as string)
        const db = client.db("notes-inimicalpart-com");
        const collection = db.collection("notes");

        // get note
        let note;
        try {
            note = await collection.findOne({ id });
        } catch (e) {
            console.error(e);
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"

            });
        }
        if (!note) {
            client.close();
            return res.status(404).send({
                msg: "Note not found.",
                error: "NOT_FOUND"

            });
        }

        if (note.editorKey !== key) {
            client.close();
            return res.status(403).send({
                msg: "Invalid key.",
                error: "INVALID_KEY"
            });
        }

        // changes is an object with key:value pairs
        if (typeof changes !== "object") {
            client.close();
            return res.status(400).send({
                msg: "Changes must be an object.",
                error: "CHANGES_NOT_OBJECT"
            });
        }
        
        // update note
        let changesStatus = {}
        for (const [key, value] of Object.entries(changes)) {

            switch (key) {
                case "password":
                    if (typeof value !== "string") {
                        client.close();
                        return res.status(400).send({
                            msg: "Password must be a string.",
                            error: "PASSWORD_NOT_STRING"
                        });
                    }
                    if (value.length < 1) { // TODO: allow 0's to remove password
                        client.close();
                        return res.status(400).send({
                            msg: "Password must be at least 1 character long.",
                            error: "PASSWORD_TOO_SHORT"
                        });
                    }
                    if (value.length > 256) {
                        client.close();
                        return res.status(400).send({
                            msg: "Password must be at most 256 characters long.",
                            error: "PASSWORD_TOO_LONG"
                        });
                    }
                    let decrypted = decrypt(note.contents, password);
                    if (!decrypted) {
                        client.close();
                        return res.status(403).send({
                            msg: "Invalid password.",
                            error: "INVALID_PASSWORD"
                        });
                    }
                    let encrypted = encrypt(JSON.parse(decrypted), value);
                    if (!encrypted) {
                        client.close();
                        return res.status(500).send({
                            msg: "Internal Server Error.",
                            error: "INTERNAL_SERVER_ERROR"

                        });
                    }
                    try {
                        await collection.updateOne({ id }, { $set: { contents: encrypted } });
                    } catch (e) {
                        console.error(e);
                        client.close();
                        return res.status(500).send({
                            msg: "Internal Server Error.",
                            error: "INTERNAL_SERVER_ERROR"

                        });
                    }
                    changesStatus[key] = true;
                    break;
                case "contents":
                    if (typeof value !== "object") {
                        client.close();
                        return res.status(400).send({
                            msg: "Contents must be an object.",
                            error: "CONTENTS_NOT_OBJECT"
                        });
                    }
                    if (typeof (value as any).title !== "string") {
                        client.close();
                        return res.status(400).send({
                            msg: "Contents.title must be a string.",
                            error: "CONTENTS_TITLE_NOT_STRING"
                        });
                    }
                    if (typeof (value as any).content !== "string") {
                        client.close();
                        return res.status(400).send({
                            msg: "Contents.content must be a string.",
                            error: "CONTENTS_CONTENT_NOT_STRING"
                        });
                    }
                    let decrypted2 = decrypt(note.contents, password);
                    if (!decrypted2) {
                        client.close();
                        return res.status(403).send({
                            msg: "Invalid password.",
                            error: "INVALID_PASSWORD"
                        });
                    }
                    let encrypted2 = encrypt(value, password);
                    if (!encrypted2) {
                        client.close();
                        return res.status(500).send({
                            msg: "Internal Server Error.",
                            error: "INTERNAL_SERVER_ERROR"

                        });
                    }
                    try {
                        await collection.updateOne({ id }, { $set: { contents: encrypted2 } });
                    } catch (e) {
                        console.error(e);
                        client.close();
                        return res.status(500).send({
                            msg: "Internal Server Error.",
                            error: "INTERNAL_SERVER_ERROR"

                        });
                    }

                    changesStatus[key] = true;
                    break;
                
            }
        }

        // return change information
        client.close()
        return res.status(200).send({
            msg: "Changes made.",
            changes: changesStatus
        });
        
    })

    API.delete("/notes/delete", async (req: Request, res: Response) => {
        let { id, key } = req.body;
        if (!id || !key) {
            return res.status(400).send({
                msg: "Note ID or key missing.",
                error: "ID_OR_KEY_MISSING"  
            });
        }

        // connect to database
        const client = new MongoClient(process.env.MongoDBConnectionString as string)
        const db = client.db("notes-inimicalpart-com");
        const collection = db.collection("notes");

        // get note
        let note;
        try {
            note = await collection.findOne({ id });
        } catch (e) {
            console.error(e);
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"

            });
        }
        if (!note) {
            client.close();
            return res.status(404).send({
                msg: "Note not found.",
                error: "NOT_FOUND"

            });
        }

        if (note.editorKey !== key) {
            client.close();
            return res.status(403).send({
                msg: "Invalid key.",
                error: "INVALID_KEY"
            });
        }

        // delete note
        try {
            await collection.deleteOne({ id });
        } catch (e) {
            console.error(e);
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"

            });
        }

        // return note information
        client.close()
        return res.status(200).send({
            msg: "Note deleted."
        });
    })
    API.get("/notes/get", async (req: Request, res: Response) => {
        // get note id and key
        let { id, key } = req.query;
        if (!id || !key) {
            return res.status(400).send({
                msg: "Note ID or key missing.",
                error: "ID_OR_KEY_MISSING"  
            });
        }

        // connect to database
        const client = new MongoClient(process.env.MongoDBConnectionString as string)
        const db = client.db("notes-inimicalpart-com");
        const collection = db.collection("notes");

        // get note
        let note;
        try {
            note = await collection.findOne({ id });
        } catch (e) {
            console.error(e);
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"

            });
        }
        if (!note) {
            client.close();
            return res.status(404).send({
                msg: "Note not found.",
                error: "NOT_FOUND"

            });
        }

        if (note.editorKey !== key && note.viewKey !== key) {
            client.close();
            return res.status(403).send({
                msg: "Invalid key.",
                error: "INVALID_KEY"
            });
        }

        // return note information
        client.close()
        return res.status(200).send({
            id: note.id,
            settings: {password: true, ...note.settings}
        });
    })
    API.post("/notes/create", createLimit, async (req: Request, res: Response) => {
        let { title="Hello world!", content="Hey there! Welcome to your note!", password } = req.body;
        if (!password) return res.status(400).send({
            msg: "Password is required but wasn't provided.",
            error: "PASSWORD_REQUIRED"
        })

        let id = crypto.randomUUID({
            disableEntropyCache: true
        });
        const client = new MongoClient(process.env.MongoDBConnectionString as string)
        const db = client.db("notes-inimicalpart-com");
        const collection = db.collection("notes");
        try {

            while (await collection.findOne({ id })) {
                id = crypto.randomUUID({
                    disableEntropyCache: true
                });
            }
        } catch (e) {
            console.error(e);
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"

            });
        }


        let encrypted = encrypt({ title, content }, password);
        if (!encrypted) {
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"

            });
        }
        let editorKey = crypto.randomBytes(16).toString("hex");
        let viewKey = crypto.randomBytes(16).toString("hex");
        while (editorKey === viewKey) {
            viewKey = crypto.randomBytes(16).toString("hex");
        }

        const noteInformation = {
            id,
            editorKey,
            viewKey,
            settings: {}
        }

        try {
            await collection.insertOne({
                id: noteInformation.id,
                editorKey: noteInformation.editorKey,
                viewKey: noteInformation.viewKey,
                contents: encrypted,
                settings: {},
                info: {
                    createdAt: new Date().getTime(),
                    lastModified: new Date().getTime()
                }
            });

            
        } catch (e) {
            console.error(e);
            client.close();
            return res.status(500).send({
                msg: "Internal Server Error.",
                error: "INTERNAL_SERVER_ERROR"

            });
        }

        client.close();
        return res.status(200).send(noteInformation);


    })
}

export default { main };
