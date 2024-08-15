declare const global: ICOMGlobal

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const fs = await import("fs");

        const botConfPath = process.platform == "win32" ? process.env.USERPROFILE + "\\Documents\\inimicalpart.com\\3p-botConfig.jsonc" : "/srv/inimicalpart.com/3p-botConfig.jsonc"

        if (!fs.existsSync(botConfPath)) {
            console.log("Bot config not found, creating one at", botConfPath);
            fs.writeFileSync(botConfPath, `{}`);
        }
        
        const botConf = JSON.parse(fs.readFileSync(botConfPath, "utf-8").toString());

        global.botConfig = botConf;
        global.connections = {};
        global.servers = {};
        global.caches = {};

    }
   
  }