import prettyMs from "pretty-ms";
import path from "path";
import chalk from "chalk";
import express from "express";
import fs from "fs";
import quickDb from "quick.db";
import http from "http";
import { Server } from "socket.io";
import jimp from "jimp";
import { fileURLToPath } from "url";
import onHeaders from "on-headers";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mainWebsite = express();
const app = express();
mainWebsite.use(express.urlencoded({ extended: true }));
mainWebsite.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mainWebsite.use(express.static(path.join(__dirname, "build")));
mainWebsite.use("/img", express.static(path.join(__dirname, "build/img")));
function getActivity(t) {
  let e = quickDb.fetch(`presence_${t}`);
  if (!e) return null;
  try {
    e = JSON.parse(e);
  } catch (t) {}
  let a = null;
  "custom" == e.game?.id &&
    ((a = { type: 4, name: e.game.name, state: e.game.state }),
    e.game.emoji && (a.emoji = e.game.emoji)),
    e.activities &&
      e.activities.sort((t, e) =>
        4 == t.type ? -1 : 4 == e.type ? 1 : t.type - e.type
      ),
    (e.game = e.activities[0]);
  let s = (function (t) {
      try {
        t = JSON.parse(t);
      } catch (t) {}
      let e = t.game;
      "custom" === e.id && "Custom Status" === e.name && (e = t.activities[1]);
      if (!e.id.startsWith("spotify:") && "Spotify" !== e.name) return null;
      let a = e.state,
        s = e.details,
        i = e.assets.large_image,
        n = e.timestamps?.start,
        r = e.timestamps?.end,
        l = r - n,
        m = l - (Date.now() - n),
        p = l - m;
      return m <= 0
        ? null
        : {
            song: {
              start: "00:00",
              current:
                c(Math.floor((p / 1e3 / 60) << 0), 2) +
                ":" +
                c(Math.floor((p / 1e3) % 60), 2),
              end:
                c(Math.floor((l / 1e3 / 60) << 0), 2) +
                ":" +
                c(Math.floor((l / 1e3) % 60), 2),
              name: s,
              author: a,
              image: i.replace("spotify:", "https://i.scdn.co/image/"),
              startTimestamp: n,
              endTimestamp: r,
            },
          };
      function c(t, e) {
        let a = t + "";
        for (; a.length < e; ) a = "0" + a;
        return a;
      }
    })(e),
    i = (function (t) {
      if ("custom" === t?.game?.id) return t.activities[1] || null;
      return t.game || null;
    })(e);
  return {
    user: {
      username: e.user.username,
      discriminator: e.user.discriminator,
      image: `https://cdn.discordapp.com/avatars/${e.user.id}/${e.user.avatar}.png`,
      id: t,
    },
    custom_status: a,
    client_status: e.client_status,
    status: e.status,
    activity: {
      activity_data: {
        type: i.type,
        name: i.name,
        state: i.state,
        details: i.details,
        id: i.id,
        timestamps: {
          start: i.timestamps.start || null,
          end: i.timestamps.end || null,
        },
        assets: {
          small_text: i.assets.small_text || null,
          small_image: `https://cdn.discordapp.com/app-assets/${i.application_id}/${i.assets.small_image}.png`,
          large_text: i.assets.large_text || null,
          large_image: `https://cdn.discordapp.com/app-assets/${i.application_id}/${i.assets.large_image}.png`,
        },
        application_id: i.application_id,
      },
      external_data: s,
    },
    lastUpdated: e.lastUpdated,
  };
}
const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000,
  };
  if (req.method === "GET") {
    res.writeHead(200, headers);
  }
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  },
});

function scrubCacheControl(res) {
  onHeaders(res, function () {
    this.removeHeader("Cache-Control");
  });
}
app.get(["/v1/img", "/v1/img.png"], async (req, res) => {
  try {
    let query = req.query;
    let pth = "";
    let unixBirth = Object.keys(query).includes("birthUnix")
      ? parseInt(query["birthUnix"])
      : 116362272e4;
    let fRD = Object.keys(query).includes("rmvdif")
      ? parseInt(query["rmvdif"])
      : null;
    let xrmvbias = Object.keys(query).includes("xrmvbias")
      ? parseFloat(query["xrmvbias"])
      : null;
    let yrmvbias = Object.keys(query).includes("yrmvbias")
      ? parseFloat(query["yrmvbias"])
      : null;
    scrubCacheControl(res);
    if (Object.keys(query).includes("years")) {
      pth = await makeIMG("years", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("millisecondsLeft")) {
      pth = await makeIMG("milliseconds", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("secondsLeft")) {
      pth = await makeIMG("seconds", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("minutesLeft")) {
      pth = await makeIMG("minutes", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("hoursLeft")) {
      pth = await makeIMG("hours", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("daysLeft")) {
      pth = await makeIMG("days", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("weeksLeft")) {
      pth = await makeIMG("weeks", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("monthsLeft")) {
      pth = await makeIMG("months", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("pretty")) {
      pth = await makeIMG("pretty", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("prettyF")) {
      pth = await makeIMG("prettyF", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("prettyLeft")) {
      pth = await makeIMG("prettyLeft", unixBirth, fRD, xrmvbias, yrmvbias);
    } else if (Object.keys(query).includes("prettyFLeft")) {
      pth = await makeIMG("prettyFLeft", unixBirth, fRD, xrmvbias, yrmvbias);
    } else return res.status(400).send("You need to specify a type!");
    res.removeHeader("x-powered-by");
    res.setHeader("Etag", "off");
    res.setHeader("Expires", "off");
    res.setHeader("If_modified_since", "off");
    res.status(200).sendFile(pth);
    return setTimeout(() => fs.unlinkSync(pth), 1000);
  } catch (e) {
    console.log(e);
    res.status(400).send("Err: " + e);
  }
});
// app.get("/v1/presence/:id", async (req, res) => {
//   let userActivity = getActivity(req.params.id);
//   res.header("Content-Type", "application/json");
//   res.send(JSON.stringify(userActivity));
// });
app
  .listen(3000, (e) => {
    console.log(
      chalk.cyan.bold("[*] ") +
        chalk.white.bold("Subdomain 'API' listening on port 3000")
    );
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(
        chalk.red.bold("[!] ") +
          chalk.redBright.bold("Port 3000 is already in use")
      );
      process.exit(1);
    }
  });
mainWebsite
  .listen(7798, (e) => {
    console.log(
      chalk.cyan.bold("[*] ") +
        chalk.white.bold("Main Website listening on port 7798")
    );
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(
        chalk.red.bold("[!] ") +
          chalk.redBright.bold("Port 7798 is already in use")
      );
      process.exit(1);
    }
  });
server
  .listen(7892, (e) => {
    console.log(
      chalk.cyan.bold("[*] ") +
        chalk.white.bold("Socket.IO Server (HEROKU) listening on port 7892")
    );
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(
        chalk.red.bold("[!] ") +
          chalk.redBright.bold("Port 7892 is already in use")
      );
      process.exit(1);
    }
  });

/* prettier-ignore */
function nextBirthday(e,t){let n=new Date(e.getMonth()+1+"/"+e.getDate()+"/"+(new Date).getFullYear()+" "+e.getHours()+":"+e.getMinutes()+":"+e.getSeconds());return n<new Date&&(n=n.setFullYear(n.getFullYear()+1)),t&&console.log(new Date(n)),n instanceof Date?n.getTime():n}
/* prettier-ignore */
function makeid(length) {
    var result           = '';
    for ( var i = 0; i < length; i++ ) {
      result += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 
      'abcdefghijklmnopqrstuvwxyz0123456789'.length));
   }
   return result;
}
/* prettier-ignore */
async function makeIMG(type, birthUnix,fixedRmvDif,xrmvbias=0,yrmvbias=0) {
    return new Promise(async (resolve, reject) => {
        let customId = makeid(16)
        let pth = path.join(__dirname, "build/img/" + type + "_" + customId + ".png")
        // console.log(pth)
        var t, temp, tempTime;
        var rmvdif = 10
        if ("seconds" == type) {
            tempTime = "" + (nextBirthday(new Date(birthUnix)) - new Date) / 1e3;
            temp = tempTime.split(".");
            temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0");
            void 0 === temp[1] && (temp[1] = "0");
            t = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
        } else if ("minutes" == type){
            tempTime = "" + (nextBirthday(new Date(birthUnix)) - new Date) / 6e4;
            temp = tempTime.split(".");
            temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0");
            void 0 === temp[1] && (temp[1] = "0");
            t = temp.join(".")
            if (!yrmvbias) yrmvbias = 12.5
        } else if ("hours" == type) {
            tempTime = "" + (nextBirthday(new Date(birthUnix)) - new Date) / 36e5;
            temp = tempTime.split("."), temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0");
            void 0 === temp[1] && (temp[1] = "0"); t = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
        } else if ("days" == type) {
            tempTime = "" + (nextBirthday(new Date(birthUnix)) - new Date) / 864e5;
            temp = tempTime.split(".");
            temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0");
            void 0 === temp[1] && (temp[1] = "0");
            t = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
        } else if ("weeks" == type) {
            tempTime = "" + (nextBirthday(new Date(birthUnix)) - new Date) / 6048e5;
            temp = tempTime.split(".");
            temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0");
            void 0 === temp[1] && (temp[1] = "0");
            t = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
        } else if ("months" == type) {
            tempTime = "" + (nextBirthday(new Date(birthUnix)) - new Date) / 2628028800
            temp = tempTime.split(".")
            temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0")
            void 0 === temp[1] && (temp[1] = "0")
            t = temp.join(".")
            if (!yrmvbias) yrmvbias = 12.5
        } else if ("milliseconds" == type) {
            t = String(nextBirthday(new Date(birthUnix)) - (new Date).getTime())
            if (!yrmvbias) yrmvbias = 12.5
        } else if ("years" == type) {
            t = (new Date - new Date(birthUnix)) / 31559039999.999992
            t = String(t).split(".");
            t[1] = String(t[1]).padEnd(15, "0")
            t = t.join(".")
            console.log(yrmvbias)
            if (!yrmvbias) yrmvbias = 12.5
        } else if (type == "pretty") {
            t = prettyMs(new Date - new Date(birthUnix))
            rmvdif=4
            if (!yrmvbias) yrmvbias = 4
        } else if (type == "prettyF") {
            t = prettyMs(new Date - new Date(birthUnix), {verbose: true})
            rmvdif=4
            if (!yrmvbias) yrmvbias = 4
        } else if (type == "prettyLeft") {
            t = prettyMs(nextBirthday(new Date(birthUnix)) - (new Date).getTime())
            rmvdif=10
            if (!yrmvbias) yrmvbias = 11
        } else if (type == "prettyFLeft") {
            t = prettyMs(nextBirthday(new Date(birthUnix)) - (new Date).getTime(), {verbose: true})
            rmvdif=4
            if (!yrmvbias) yrmvbias = 4
            // &rmvdif=10&yrmvbias=11 to make it remove the bottom of the "y"
        }
        if (fixedRmvDif || fixedRmvDif == 0) rmvdif = fixedRmvDif
        let img = await jimp.read(1,1,0x0)
        let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
        img.resize(jimp.measureText(font,t)-xrmvbias, jimp.measureTextHeight(font,t)-yrmvbias)
        img.print(font,0,rmvdif/2*-1,{text:t})
        img.write(pth,()=>{return resolve(pth)})
})
}
let herokuWeb = [],
  herokuWorker = [];

io.on("connection", (socket) => {
  socket.emit("HPI", "HPI");
  socket.on("disconnect", () => {
    if (herokuWorker.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.cyan.bold("(WORKER)"),
        chalk.red.bold(" DISCONNECTED")
      );
      herokuWorker.splice(herokuWorker.indexOf(socket), 1);
      if (herokuWeb.length > 0) {
        for (let i = 0; i < herokuWeb.length; i++) {
          herokuWeb[i].emit("LCNT", {
            socketId: socket.id,
            remaining: herokuWorker.length,
          });
        }
      }
    } else if (herokuWeb.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.hex("#ffa500").bold("(WEB)"),
        chalk.red.bold("DISCONNECTED")
      );
      herokuWeb.splice(herokuWeb.indexOf(socket), 1);
      if (herokuWorker.length > 0) {
        for (let i = 0; i < herokuWorker.length; i++) {
          herokuWorker[i].emit("LCNT", {
            socketId: socket.id,
            remaining: herokuWeb.length,
          });
        }
      }
    }
  });
  socket.on("HPIResponse", (message) => {
    if (message == "web") {
      console.log(
        chalk.white.bold(socket.id),
        chalk.green.bold("[HPI]"),
        "is a web client"
      );
      herokuWeb.push(socket);
      socket.emit("IACK", "WLCWEB");
    } else if (message == "worker") {
      console.log(
        chalk.white.bold(socket.id),
        chalk.green.bold("[HPI]"),
        "is a worker client"
      );
      herokuWorker.push(socket);
      socket.emit("IACK", "WLCWRKR");
    }
    if (herokuWeb.length >= 1 && herokuWorker.length >= 1) {
      console.log(
        "Both " +
          chalk.hex("#ffa500").bold("[WEB]") +
          " and " +
          chalk.cyan.bold("[WORKER]") +
          " connected"
      );
      for (let i = 0; i < herokuWeb.length; i++) {
        herokuWeb[i].emit("CNT", "CONNECTED");
      }
      for (let i = 0; i < herokuWorker.length; i++) {
        herokuWorker[i].emit("CNT", "CONNECTED");
      }
    }
  });
  socket.on("message", (message) => {
    if (herokuWeb.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.hex("#ffa500").bold("(WEB)"),
        chalk.blue.bold("[MESSAGE]"),
        message
      );
      for (let i = 0; i < herokuWorker.length; i++) {
        herokuWorker[i].emit("message", message);
      }
    }
    if (herokuWorker.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.cyan.bold("(WORKER)"),
        chalk.blue.bold("[MESSAGE]"),
        message
      );
      for (let i = 0; i < herokuWeb.length; i++) {
        herokuWeb[i].emit("message", message);
      }
    }
  });
  socket.on("allBotsIdent", (message) => {
    //to each worker
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#39d824").bold("[ABI]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      herokuWorker[i].emit("allBotsIdent", message);
    }
  });
  socket.on("allBotsIdentResponse", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[ABI-RESPONSE]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("allBotsIdentResponse", message);
      }
    }
  });
  socket.on("askBotConfig", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[ASK-BC]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("askBotConfig", message);
      }
    }
  });
  socket.on("botConfig", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[BC]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("botConfig", message);
      }
    }
  });
  socket.on("getUptime", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[GET-UPTIME]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("getUptime", message);
      }
    }
  });
  socket.on("uptime", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[UPTIME]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("uptime", message);
      }
    }
  });
  socket.on("requestAsset", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[REQ-ASSET]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("requestAsset", message);
      }
    }
  });
  socket.on("asset", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[ASSET]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("asset", message);
      }
    }
  });
  socket.on("getLatency", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[GET-LATENCY]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("getLatency", message);
      }
    }
  });
  socket.on("latency", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[LATENCY]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("latency", message);
      }
    }
  });
  socket.on("webUpdate", (message) => {
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.magenta.bold("[WEBUPDATE]"),
      message
    );
    if (herokuWeb.length > 0) {
      for (let i = 0; i < herokuWeb.length; i++) {
        if (herokuWeb[i] !== socket) herokuWeb[i].emit("webUpdate", message);
      }
    }
  });
});
