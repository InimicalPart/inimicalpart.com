import path from "path";
import chalk from "chalk";
import express, { NextFunction, Request, Response } from "express";
import { fileURLToPath } from "url";

//! Modules
import birthdayModule from "./modules/birthday.js";
import extrasModule from "./modules/extras.js";
import notesModule from "./modules/notes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainWebsite = express();
const API = express();

//! Initialize the API
API.use(express.urlencoded({ extended: true }));
API.use(express.json());

//! Initialize the main website
mainWebsite.use(express.urlencoded({ extended: true }));
mainWebsite.use(express.json());
mainWebsite.use(express.static(path.join(__dirname, "../build")));
mainWebsite.use("/img", express.static(path.join(__dirname, "../build/img")));


API.use(defaultHeaders);
mainWebsite.use(defaultHeaders);

//! Initialize the /v1/test endpoint for the API
API.get(["/v1/test"],async(_req,res)=>{res.status(200).send("Alive! Test succeeded.")})


//! Initialize the modules and their routes
await birthdayModule.main(API);
await extrasModule.main(API);
await notesModule.main(API);


API
  .listen(3000, () => console.log(chalk.cyan.bold("[*] ") + chalk.white.bold("Subdomain 'API' listening on port 3000")))
  .on("error", (e: any | Error) => {
    if (e.code === "EADDRINUSE") {
      console.log(chalk.red.bold("[!] ") + chalk.redBright.bold("Port 3000 is already in use"));
      process.exit(1);
    }
  });
mainWebsite
  .listen(7798, () => console.log(chalk.cyan.bold("[*] ") + chalk.white.bold("Main Website listening on port 7798")))
  .on("error", (e: any | Error) => {
    if (e.code === "EADDRINUSE") {
      console.log(chalk.red.bold("[!] ") + chalk.redBright.bold("Port 7798 is already in use"));
      process.exit(1);
    }
  });


function defaultHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Security-Policy","default-src 'self' cdn.jsdelivr.net;");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Accept-Encoding", "gzip, deflate");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy","accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()");
  next();
}