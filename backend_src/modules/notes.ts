import { Response, Request, Router } from "express-serve-static-core";
import crypto, { CipherGCM, CipherGCMTypes, DecipherGCM } from 'node:crypto';
import { MongoClient } from "mongodb";
import { encrypt, decrypt, verify } from "../utils/encryption.js";

import { config } from "dotenv";

// log current working directory
config({ path: "./dist/.env" });

export async function main(API: Router) {

    API.get(["/n/:id/:key", "/n/:id", "/"], async (req: Request, res: Response) => {
        // send note.html
        return res.sendFile("note.html", { root: "/var/www/notes" });


    })
}

export default { main };
