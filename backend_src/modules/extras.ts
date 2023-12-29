import { Response, Request, Router } from "express-serve-static-core";
import { GHK } from "../utils/github-keys.js";
import { SEC } from "../utils/secrets.js";

export async function main(API: Router) {
    API.get(["/getGHKey"], async (req: Request, res: Response) => {
        try {
            await GHK(req, res);
        } catch (e) {
            console.log(e);
        }
    });
    API.get(["/getSecret"], async (req: Request, res: Response) => {
        try {
            await SEC(req, res);
        } catch (e) {
            console.log(e);
        }
    });
}

export default { main };
