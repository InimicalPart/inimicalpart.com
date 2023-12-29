import onHeaders from "on-headers";
import { Response, Request, Router } from "express-serve-static-core";
import prettyMs from "pretty-ms";
import jimp from "jimp";
import dayjs from "dayjs";

export async function main(API: Router) {

    API.get("/age/live", async (req: Request, res: Response) => {
      try {
        let query = req.query;
        let unixDate: Date = new Date(Object.keys(query).includes("birthUnix") ? parseInt((query["birthUnix"] as string)) : 1163623320000)
        let offset = Object.keys(query).includes("offset") ? parseInt((query["offset"] as string)) : 0;
        let untilAge: number = Object.keys(query).includes("untilAge") ? parseInt((query["untilAge"] as string)) : null;
        let birthUnix: number = new Date(unixDate.getTime() + (Math.abs(offset / 60) * 60 * 60 * 1000)).getTime()
        let changeCountdownText = Object.keys(query).includes("dontChangeCountdownText") ? false : true;

        if (Object.keys(query).includes("birth")) {
          try {
              unixDate = new Date((query["birth"] as string));
              unixDate.setHours(unixDate.getHours() + Math.abs(offset / 60));
              birthUnix = unixDate.getTime();
          } catch (e) {
              return res.status(400).send("Invalid query value: 'birth'. Has to be a valid JavaScript Date string.");
          }
        }

        let source_code: string = "";

             if (Object.keys(query).includes("years"))            source_code = await returnLiveSRC("years",        {birthUnix,           changeCountdownText});
        else if (Object.keys(query).includes("pretty"))           source_code = await returnLiveSRC("pretty",       {birthUnix,           changeCountdownText});
        else if (Object.keys(query).includes("prettyF"))          source_code = await returnLiveSRC("prettyF",      {birthUnix,           changeCountdownText});
        else if (Object.keys(query).includes("millisecondsLeft")) source_code = await returnLiveSRC("milliseconds", {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("secondsLeft"))      source_code = await returnLiveSRC("seconds",      {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("minutesLeft"))      source_code = await returnLiveSRC("minutes",      {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("hoursLeft"))        source_code = await returnLiveSRC("hours",        {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("daysLeft"))         source_code = await returnLiveSRC("days",         {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("weeksLeft"))        source_code = await returnLiveSRC("weeks",        {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("monthsLeft"))       source_code = await returnLiveSRC("months",       {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("prettyLeft"))       source_code = await returnLiveSRC("prettyLeft",   {birthUnix, untilAge, changeCountdownText});
        else if (Object.keys(query).includes("prettyFLeft"))      source_code = await returnLiveSRC("prettyFLeft",  {birthUnix, untilAge, changeCountdownText});
        else return res.status(400).send("You need to specify a type!");

        res.setHeader("Content-Type", "text/html");

        //! Hides that the server is using Express
        res.removeHeader("x-powered-by");

        //! CSP
        res.removeHeader("Content-Security-Policy"); // Removes CSP set by app.ts
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; form-action 'self'; frame-ancestors 'self'; base-uri 'self'; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://cdn.jsdelivr.net; object-src 'none'; style-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://cdn.jsdelivr.net 'unsafe-inline'; img-src 'self' inimicalpart.com https://www.inimicalpart.com");

        res.status(200).send(source_code);
    } catch (e) {
      console.log(e);
      res.status(400).send("Error. Please try again later.");
    }
    })
    API.get(["/age/img", "/age/img.png"], async (req: Request, res: Response) => {
        try {
          let query = req.query;
          let unixDate: Date = new Date(Object.keys(query).includes("birthUnix") ? parseInt((query["birthUnix"] as string)) : 1163623320000)
          let offset = Object.keys(query).includes("offset") ? parseInt((query["offset"] as string)) : 0;
          let untilAge: number = Object.keys(query).includes("untilAge") ? parseInt((query["untilAge"] as string)) : null;
          let unixBirth: number = new Date(unixDate.getTime() + (Math.abs(offset / 60) * 60 * 60 * 1000)).getTime()

          if (Object.keys(query).includes("birth")) {
            try {
                unixDate = new Date((query["birth"] as string));
                unixDate.setHours(unixDate.getHours() + Math.abs(offset / 60));
                unixBirth = unixDate.getTime();
            } catch (e) {
                return res.status(400).send("Invalid query value: 'birth'. Has to be a valid JavaScript Date string.");
            }
          }
            let fRD = Object.keys(query).includes("rmvdif") ? parseInt((query["rmvdif"] as string)) : null;
            let xrmvbias = Object.keys(query).includes("xrmvbias") ? parseFloat((query["xrmvbias"] as string)) : null;
            let yrmvbias = Object.keys(query).includes("yrmvbias") ? parseFloat((query["yrmvbias"] as string)) : null;
            // scrubCacheControl(res);

            let imageBuffer: any;

                 if (Object.keys(query).includes("years"))            imageBuffer = await makeIMG("years",        unixBirth, fRD, xrmvbias, yrmvbias);
            else if (Object.keys(query).includes("pretty"))           imageBuffer = await makeIMG("pretty",       unixBirth, fRD, xrmvbias, yrmvbias);
            else if (Object.keys(query).includes("prettyF"))          imageBuffer = await makeIMG("prettyF",      unixBirth, fRD, xrmvbias, yrmvbias);
            else if (Object.keys(query).includes("millisecondsLeft")) imageBuffer = await makeIMG("milliseconds", unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("secondsLeft"))      imageBuffer = await makeIMG("seconds",      unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("minutesLeft"))      imageBuffer = await makeIMG("minutes",      unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("hoursLeft"))        imageBuffer = await makeIMG("hours",        unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("daysLeft"))         imageBuffer = await makeIMG("days",         unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("weeksLeft"))        imageBuffer = await makeIMG("weeks",        unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("monthsLeft"))       imageBuffer = await makeIMG("months",       unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("prettyLeft"))       imageBuffer = await makeIMG("prettyLeft",   unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else if (Object.keys(query).includes("prettyFLeft"))      imageBuffer = await makeIMG("prettyFLeft",  unixBirth, fRD, xrmvbias, yrmvbias, untilAge);
            else return res.status(400).send("You need to specify a type!");


            //! Hides that the server is using Express
            res.removeHeader("x-powered-by");

            //! Disable cache
            res.setHeader("Etag", "off");
            res.setHeader("If_modified_since", "off");
            res.setHeader("Last-Modified", new Date().toUTCString());
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");

            //! Tell NGINX to disable the Expires header
            res.setHeader("X-NoExpire", "yes");

            //! Tell recipient that the response is a .png image
            res.setHeader("Content-Type", "image/png");

            //! Send the image
            res.status(200).end(imageBuffer.toString("base64"), 'base64')

            return;
        } catch (e) {
            console.log(e);
            res.status(400).send("Error. Please try again later.");
        }
    });
}


  //! Get the next birthday from a date
  /* prettier-ignore */
  function getBirthday(birthday: Date, age: number) {let newDate = new Date(birthday.toISOString());newDate.setFullYear(newDate.getFullYear() + age);return newDate}

  //! Get the next birthday from a date
  /* prettier-ignore */
  function nextBirthday(e: Date, t?: undefined) {let n: Date | number = new Date(e.getMonth() + 1 + "/" + e.getDate() + "/" + new Date().getFullYear() + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds());return (n < new Date() && (n = n.setFullYear(n.getFullYear() + 1)),t,n instanceof Date ? n.getTime() : n);}

  //! Check if a year is a leap year
  /* prettier-ignore */
  function isLeapYear(year: number) {return ((year%4)==0&&!((year%400)!==0&&(year%100)==0))}


  /* prettier-ignore */
  async function returnLiveSRC(type: string, settings: Partial<{
    birthUnix: string | number | Date;
    untilAge: null | number;
    changeCountdownText: boolean;
  }>) {
    return new Promise<string>(async (resolve, _reject) => {

        const defaultSettings = {
          birthUnix: 1163623320000,
          untilAge: null,
          changeCountdownText: true
        }

        settings = Object.assign(defaultSettings, settings)


        let generator: string = `
        // Functions
        const getBirthday = (birthday, age) => {let newDate = new Date(birthday.toISOString());newDate.setFullYear(newDate.getFullYear() + age);return newDate;};
        const nextBirthday = (e, t = undefined) => {let n = new Date(e.getMonth() + 1 + "/" + e.getDate() + "/" + new Date().getFullYear() + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds());if (n < new Date()) {n.setFullYear(n.getFullYear() + 1);}return n instanceof Date ? n.getTime() : n};
        const isLeapYear = (year) => ((year % 4) == 0 && !((year % 400) !== 0 && (year % 100) == 0));
        const ord = (n) => n + (n > 0 ? ["th", "st", "nd", "rd"][n > 3 && n < 21 || n % 10 > 3 ? 0 : n % 10] : "")
        const showConfetti = () => {const duration = 10 * 1000;const animationEnd = Date.now() + duration;const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };const randomInRange = (min, max) => Math.random() * (max - min) + min;const interval = setInterval(() => {const timeLeft = animationEnd - Date.now();if (timeLeft <= 0) {return clearInterval(interval);}const particleCount = 125 * (timeLeft / duration);confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.5), y: Math.random() - 0.2 } }));confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.5, 0.9), y: Math.random() - 0.2 } }))}, 250)};

        // Variables
        const wordSplitter = /(?<=[a-zA-Z])\\s/g

        // Initializer
        let birthDnT = new Date(${settings.birthUnix})
        let untilAge = ${settings.untilAge}

        // Confetti and Birthday Title Setup
        let secondsUntilBirthday = null;
        let celebrationTime = false;
        let celebrationTitleChanger = null;
        let turnsAge = dayjs().diff(dayjs(birthDnT.getTime()), "year", true)+1

        setInterval(() => {
          secondsUntilBirthday = (nextBirthday(new Date(${settings.birthUnix})) - new Date()) / 1000;
          if (parseFloat(secondsUntilBirthday) < 0.05 && celebrationTime === false) {
            celebrationTime = true;
            document.getElementById("time").innerHTML = "Happy <b>" + ord(turnsAge.toString().split(".")[0]) + "</b> birthday! 🎉";
            document.title = "BIRTHDAY TIME 🎉";
            celebrationTitleChanger = setInterval(() => {
              if (document.title === "BIRTHDAY TIME 🎉") {
                document.title = "BIRTHDAY TIME";
              } else {
                document.title = "BIRTHDAY TIME 🎉";
              }
            }, 250);
            setTimeout(() => {
              celebrationTime = false;
              clearInterval(celebrationTitleChanger);
              turnsAge += 1;
            }, 10000);
            showConfetti();
          }
        },50)

        // Automatic title change
        setInterval(() => {
          if (celebrationTime) return
          let title = "🔴 LIVE - " + new Date(nextBirthday(birthDnT)).toLocaleString("en-us").replace (",", " -")
          if (document.title !== title) document.title = title
        }, 50)
      `


        if ("seconds" == type) {
          generator += `
          // Seconds
          setInterval(() => {
            let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
            let temp = seconds.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0") ?? "0";
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = parseFloat(temp.join(".")) > 0 ? temp.join(".") : 0;
            document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
          },31)`
        } else if ("minutes" == type){
          generator += `
          // Minutes
          setInterval(() => {
            let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
            let minutes = seconds / 60;
            let temp = minutes.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0") ?? "0";
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = parseFloat(temp.join(".")) > 0 ? temp.join(".") : 0;
            document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
          },31)`
        } else if ("hours" == type) {
          generator += `
          // Hours
          setInterval(() => {
            let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
            let hours = seconds / (60 * 60);
            let temp = hours.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0") ?? "0";
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = parseFloat(temp.join(".")) > 0 ? temp.join(".") : 0;
            document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
          },31)`
        } else if ("days" == type) {
            generator += `
            // Days
            setInterval(() => {
              let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
              let days = seconds / (60 * 60 * 24);
              let temp = days.toString().split(".");
              temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0") ?? "0";
              ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
              document.getElementById("time").innerHTML = parseFloat(temp.join(".")) > 0 ? temp.join(".") : 0;
              document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            },31)`
        } else if ("weeks" == type) {
          generator += `
          // Weeks
          setInterval(() => {
            let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
            let weeks = seconds / (60 * 60 * 24 * 7);
            let temp = weeks.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0") ?? "0";
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = parseFloat(temp.join(".")) > 0 ? temp.join(".") : 0;
            document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
          },31)`
        } else if ("months" == type) {
          generator += `
          // Months
          setInterval(() => {
            let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
            let months = seconds / (60 * 60 * 24 * 30.437);
            let temp = months.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0") ?? "0";
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = parseFloat(temp.join(".")) > 0 ? temp.join(".") : 0;
            document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
          },31)`
        } else if ("milliseconds" == type) {
          generator += `
          // Milliseconds
          setInterval(() => {
            let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = "" + (seconds > 0 ? seconds * 1000 : 0);
            document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
          },31)`
        } else if ("years" == type) {
            generator += `
            // Years
            setInterval(() => {
              let time = dayjs().diff(dayjs(birthDnT.getTime()), "year", true).toString();
              let temp = String(time).split(".");
              temp[1] = String(temp[1]).padEnd(15, "0") ?? 0;
              ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
              document.getElementById("time").innerHTML = temp.join(".");
              document.getElementById("birthday").innerText = "Next birthday: " + new Date(nextBirthday(birthDnT))
            },50)`
        } else if (type == "pretty") {
            generator += `
            // Pretty
            setInterval(() => {
              let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= new Date().getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }
              let temp = new Date(birthDnT.getTime())
              temp.setDate(birthDnT.getDate() + addDays )
              ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
              document.getElementById("time").innerHTML = (prettyMs(new Date().getTime() - temp.getTime(), {keepDecimalsOnWholeSeconds:true})).replace(wordSplitter, ' ')
              document.getElementById("birthday").innerText = "Next birthday: " + new Date(nextBirthday(birthDnT))
            },50)`
        } else if (type == "prettyF") {
            generator += `
            // PrettyF
            setInterval(() => {
              let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= new Date().getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }
              let temp = new Date(birthDnT.getTime())
              temp.setDate(birthDnT.getDate() + addDays )
              ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
              document.getElementById("time").innerHTML = (prettyMs(new Date().getTime() - temp.getTime(), {verbose: true, keepDecimalsOnWholeSeconds: true})).replace(wordSplitter, ' <br class="mobile-break">')
              document.getElementById("birthday").innerText = "Next birthday: " + new Date(nextBirthday(birthDnT))
            },50)`
        } else if (type == "prettyLeft") {
            generator += `
            // PrettyLeft
            setInterval(() => {
              ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
              document.getElementById("time").innerHTML = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime() > 0 ? prettyMs(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime(), {keepDecimalsOnWholeSeconds:true}) : prettyMs(0,{keepDecimalsOnWholeSeconds:true})).replace(wordSplitter, ' ')
              document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            },50)`
        } else if (type == "prettyFLeft") {
          generator += `
          // PrettyFLeft
          setInterval(() => {
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime() > 0 ? prettyMs(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime(), {verbose: true, keepDecimalsOnWholeSeconds:true}) : prettyMs(0, {verbose: true, keepDecimalsOnWholeSeconds:true})).replace(wordSplitter, ' <br class="mobile-break">')
            document.getElementById("birthday").innerHTML = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
          },50)`

        }


        let source_code = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title></title>
          <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/@lyo/pretty-ms@4.0.0/pretty-ms.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
          <link rel="icon" type="image/x-icon" href="https://www.inimicalpart.com/favicon.ico" />
          <style>
            body {
              background-color: rgb(17 24 39);
              color: #ffffff;
              font-family: monospace;
              font-size: 48px;
            }
            @media screen and (min-width: 750px)  {
              .mobile-break { display: none; }
          }
            #time {
              position: fixed;
              top: 10%;
              width: 100%;
              text-align: center;
            }
            #birthday {
              position: fixed;
              bottom: 10px;
              font-size:13px;
              width: 100%;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <p id="time"></p>
          <p id="birthday"></p>

          <script>
            ${generator}
          </script>
        </body>
        </html>
        `
        return resolve(source_code)

      })
  }

  /* prettier-ignore */
  async function makeIMG(type: string, birthUnix: string | number | Date,fixedRmvDif: number,_xrmvbias=0,yrmvbias=0, untilAge=null) {
    return new Promise(async (resolve, _reject) => {
          var time: string;
          var seconds: number;
          var currentDnT = new Date()
          var birthDnT = new Date(birthUnix)
          var rmvdif = 10
          if ("seconds" == type) {
            if (!untilAge) {
              seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
              seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let temp = seconds.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0") ?? "0";

            time = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
          } else if ("minutes" == type){
            if (!untilAge) {
              seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
              seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let minutes = seconds / 60;

            let temp = minutes.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0") ?? "0";

            time = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
          } else if ("hours" == type) {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let hours = seconds / (60 * 60);

            let temp = hours.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0") ?? "0";

            time = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
          } else if ("days" == type) {
            if (!untilAge) {
            seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
            seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let days = seconds / (60 * 60 * 24);

            let temp = days.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0") ?? "0";

            time = temp.join(".");
            if (!yrmvbias) yrmvbias = 12.5
          } else if ("weeks" == type) {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
              } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
              }

              let weeks = seconds / (60 * 60 * 24 * 7);

              let temp = weeks.toString().split(".");
              temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0") ?? "0";

              time = temp.join(".");
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("months" == type) {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
              } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
              }

              let months = seconds / (60 * 60 * 24 * 30.437);

              let temp = months.toString().split(".");
              temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0") ?? "0";

              time = temp.join(".");
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("milliseconds" == type) {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            time = "" + seconds * 1000;
            if (!yrmvbias) yrmvbias = 12.5
          } else if ("years" == type) {
            time = dayjs().diff(dayjs(birthDnT.getTime()), "year", true).toString();

            let temp = String(time).split(".");
            temp[1] = String(temp[1]).padEnd(15, "0") ?? "0";

            time = temp.join(".")
            if (!yrmvbias) yrmvbias = 12.5
          } else if (type == "pretty") {
            let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= currentDnT.getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }

              //! Add the leap days to the birthday
              birthDnT.setDate(birthDnT.getDate() + addDays)

              time = prettyMs(currentDnT.getTime() - (birthDnT as Date).getTime()).toString()
              rmvdif=4
              if (!yrmvbias) yrmvbias = 4
          } else if (type == "prettyF") {
              let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= currentDnT.getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }

              //! Add the leap days to the birthday
              birthDnT.setDate(birthDnT.getDate() + addDays)

              time = prettyMs(currentDnT.getTime() - birthDnT.getTime(), {verbose: true}).toString()
              rmvdif=4
              if (!yrmvbias) yrmvbias = 0
          } else if (type == "prettyLeft") {
            if (!untilAge) {
                time = prettyMs(nextBirthday(birthDnT) - currentDnT.getTime()).toString()
              } else {
                time = prettyMs(getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()).toString()
              }
              rmvdif=10
              if (!yrmvbias) yrmvbias = 11
          } else if (type == "prettyFLeft") {
              if (!untilAge) {
                  time = prettyMs(nextBirthday(birthDnT) - currentDnT.getTime(), {verbose: true}).toString()
              } else {
                  time = prettyMs(getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime(), {verbose: true}).toString()
              }
              rmvdif=4
              if (!yrmvbias) yrmvbias = 4
              // &rmvdif=10&yrmvbias=11 to make it remove the bottom of the "y"
          }
          if (fixedRmvDif || fixedRmvDif == 0) rmvdif = fixedRmvDif
          let img = await jimp.read(1,1,0x0)
          let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
          img.resize(2000,1000)
          img.print(font,0,0,{text:time})

          img = img.autocrop(false)


          img.getBuffer(jimp.MIME_PNG, (err, buffer) => {
            resolve(buffer)
          })
          // img.write(pth,()=>{return resolve(pth)})
  })
}


export default {main};
