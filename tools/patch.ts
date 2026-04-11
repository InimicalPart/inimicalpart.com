import fs from "fs/promises";

console.log("patch.ts: Waiting for trigger...")
const target = `UPGRADE?: (a: any, b: any, c: any, d: any) => Promise<Response | void> | Response | void`
const path = "build/types/validator.ts";

const exitIfNotSeenAgainFor = 10000;
let lastSeen: number | null = null;

async function poll() {
    if (lastSeen && Date.now() - lastSeen > exitIfNotSeenAgainFor) {
        console.log("patch.ts: Exiting patcher because it hasn't seen the target for a while.");
        process.exit(0);
    }
    const txt = await fs.readFile(path, "utf-8").catch(() => null);
    if (!txt || txt.includes("UPGRADE")) return;
    lastSeen = Date.now();
    console.log("patch.ts: Trigger found, patching validator.ts...");
    await fs.writeFile(path, `
import { WebSocket } from "ws";
${txt.replace(`void\n}`, `void\n  ${target}\n}`)}

`)
}

setInterval(poll, 500);