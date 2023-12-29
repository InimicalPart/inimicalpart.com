import path from "path";
import chalk from "chalk";
import express, { NextFunction, Request, Response } from "express";
import { fileURLToPath } from "url";
import expressWs from "express-ws";
import fs from "fs";
import https from "https";







let v1 = express.Router();

//! Modules
import birthdayModule from "./modules/birthday.js";
import extrasModule from "./modules/extras.js";
import notesAPIModule from "./modules/notesAPI.js";
import notesModule from "./modules/notes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const www = express();
const api = express();
const notes = express();

expressWs(api)


//! Initialize the API
api.use(express.urlencoded({ extended: true }));
api.use(express.json());

//! Initialize the main website
www.use(express.urlencoded({ extended: true }));
www.use(express.json());
www.use(express.static(path.join(__dirname, "../build")));
www.use("/img", express.static(path.join(__dirname, "../build/img")));


//! Initialize the notes website
notes.use(express.urlencoded({ extended: true }));
notes.use(express.json());


//! Initialize the headers
api.use(defaultHeaders);
www.use(defaultHeaders);
notes.use(defaultHeaders);

//! Initialize the v1 router
api.use("/v1", v1);
//! Initialize the /v1/test endpoint for the API
v1.get(["/test"],async(_req,res)=>{res.status(200).send("Alive! Test succeeded.")})


//! Initialize the modules and their routes
await birthdayModule.main(v1);
await extrasModule.main(v1);
await notesAPIModule.main(v1);
await notesModule.main(notes);





// httpsServer.listen(3000)
api
  .listen(3000, () => console.log(chalk.cyan.bold("[*] ") + chalk.white.bold("api.***.*** is now listening on port: 3000")))
  .on("error", (e: any | Error) => {
    if (e.code === "EADDRINUSE") {
      console.log(chalk.red.bold("[!] ") + chalk.redBright.bold("Port 3000 is already in use"));
      process.exit(1);
    }
  });
www
  .listen(7798, () => console.log(chalk.cyan.bold("[*] ") + chalk.white.bold("www.***.*** is now listening on port: 7798")))
  .on("error", (e: any | Error) => {
    if (e.code === "EADDRINUSE") {
      console.log(chalk.red.bold("[!] ") + chalk.redBright.bold("Port 7798 is already in use"));
      process.exit(1);
    }
  });
notes
  .listen(7799, () => console.log(chalk.cyan.bold("[*] ") + chalk.white.bold("notes.***.*** is now listening on port: 7799")))
  .on("error", (e: any | Error) => {
    if (e.code === "EADDRINUSE") {
      console.log(chalk.red.bold("[!] ") + chalk.redBright.bold("Port 7799 is already in use"));
      process.exit(1);
    }
  });

// httpsServer.listen(8789, () => {
//     console.log(`Server is running on port 8789`);
// });

function defaultHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Security-Policy","default-src 'self' cdn.jsdelivr.net;");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Accept-Encoding", "gzip, deflate");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy","accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()");
  next();
}
