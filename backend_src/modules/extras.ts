import { Response, Request, Express } from "express-serve-static-core";
import { GHK } from "../utils/github-keys.js";
import { SEC } from "../utils/secrets.js";

export async function main(API: Express) {
    API.get(["/v1/getGHKey"], async (req: Request, res: Response) => {
        try {
            await GHK(req, res);
        } catch (e) {
            console.log(e);
        }
    });
    API.get(["/v1/getSecret"], async (req: Request, res: Response) => {
        try {
            await SEC(req, res);
        } catch (e) {
            console.log(e);
        }
    });
}

export default { main };