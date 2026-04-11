declare const global: ICOMGlobal


const thirdPaths = {
    "win32": process.env.USERPROFILE + "\\Documents\\inimi.dev\\3p-botConfig.jsonc",
    "linux": "/srv/inimi.dev/3p-botConfig.jsonc",
    "darwin": process.env.HOME + "/Documents/inimi.dev/3p-botConfig.jsonc"
}

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const fs = await import("fs");

        const botConfPath = thirdPaths[process.platform as keyof typeof thirdPaths] || thirdPaths["linux"];

        if (!fs.existsSync(botConfPath)) {
            console.log("Bot config not found, creating one at", botConfPath);
            fs.mkdirSync(botConfPath.split("/").slice(0, -1).join("/"), { recursive: true });
            fs.writeFileSync(botConfPath, JSON.stringify({}));
        }
        
        const botConf = JSON.parse(fs.readFileSync(botConfPath, "utf-8").toString());

        global.botConfig = botConf;
        global.connections = {};
        global.servers = {};
        global.caches = {};

    }
   
  }