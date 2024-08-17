import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let query = request.nextUrl.searchParams
  
    try {
        let unixDate: Date = new Date((Array.from(query.keys())).includes("birthUnix") ? parseInt((query.get("birthUnix") as string)) : 1163623320000)
        let offset = Array.from(query.keys()).includes("offset") ? parseInt((query.get("offset") as string)) : 0;
        let untilAge: number | null = Array.from(query.keys()).includes("untilAge") ? parseInt((query.get("untilAge") as string)) : null;
        let birthUnix: number = new Date(unixDate.getTime() + (Math.abs(offset / 60) * 60 * 60 * 1000)).getTime()
        let changeCountdownText = Array.from(query.keys()).includes("dontChangeCountdownText") ? false : true;

        if (Array.from(query.keys()).includes("birth")) {
          try {
              unixDate = new Date((query.get("birth") as string));
              unixDate.setHours(unixDate.getHours() + Math.abs(offset / 60));
              birthUnix = unixDate.getTime();
          } catch (e) {
              return new NextResponse("Invalid query value: 'birth'. Has to be a valid JavaScript Date string.",
              {
                status:400
            });
          }
        }

        let source_code: string = "";

             if (Array.from(query.keys()).includes("years"))            source_code = await returnLiveSRC("years",        {birthUnix,           changeCountdownText});
        else if (Array.from(query.keys()).includes("pretty"))           source_code = await returnLiveSRC("pretty",       {birthUnix,           changeCountdownText});
        else if (Array.from(query.keys()).includes("prettyF"))          source_code = await returnLiveSRC("prettyF",      {birthUnix,           changeCountdownText});
        else if (Array.from(query.keys()).includes("millisecondsLeft")) source_code = await returnLiveSRC("milliseconds", {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("secondsLeft"))      source_code = await returnLiveSRC("seconds",      {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("minutesLeft"))      source_code = await returnLiveSRC("minutes",      {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("hoursLeft"))        source_code = await returnLiveSRC("hours",        {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("daysLeft"))         source_code = await returnLiveSRC("days",         {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("weeksLeft"))        source_code = await returnLiveSRC("weeks",        {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("monthsLeft"))       source_code = await returnLiveSRC("months",       {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("prettyLeft"))       source_code = await returnLiveSRC("prettyLeft",   {birthUnix, untilAge, changeCountdownText});
        else if (Array.from(query.keys()).includes("prettyFLeft"))      source_code = await returnLiveSRC("prettyFLeft",  {birthUnix, untilAge, changeCountdownText});
        else source_code = await returnLiveSRC("years",        {birthUnix,           changeCountdownText});


        return new NextResponse(
            source_code,
            {
                headers: {
                    "Content-Type": "text/html",
                },
                status: 200
            }
        )
    } catch (e) {
      console.error(e);
      return new NextResponse(
        "An unexpected error has occurred, please try again later.",
        {
            status: 500
        }
      )
    }
}

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
        let birthUnix = ${settings.birthUnix}
        let birthDnT = new Date(birthUnix)
        let untilAge = ${settings.untilAge}

        // Confetti and Birthday Title Setup
        let secondsUntilBirthday = null;
        let celebrationTime = false;
        let celebrationTitleChanger = null;
        let turnsAge = dayjs().diff(dayjs.utc(birthUnix), "year", true)+1

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
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerHTML !== newBirthdayText) document.getElementById("birthday").innerHTML = newBirthdayText
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
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerHTML !== newBirthdayText) document.getElementById("birthday").innerHTML = newBirthdayText
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
            let newBirthdayText = = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerHTML !== newBirthdayText) document.getElementById("birthday").innerHTML = newBirthdayText
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
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerHTML !== newBirthdayText) document.getElementById("birthday").innerHTML = newBirthdayText
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
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerHTML !== newBirthdayText) document.getElementById("birthday").innerHTML = newBirthdayText
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
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerHTML !== newBirthdayText) document.getElementById("birthday").innerHTML = newBirthdayText
          },31)`
        } else if ("milliseconds" == type) {
          generator += `
          // Milliseconds
          setInterval(() => {
            let seconds = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime()) / 1000;
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = "" + (seconds > 0 ? seconds * 1000 : 0);
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerHTML !== newBirthdayText) document.getElementById("birthday").innerHTML = newBirthdayText
          },31)`
        } else if ("years" == type) {
          generator += `
          // Years
          setInterval(() => {
            let time = dayjs().diff(dayjs.utc(birthUnix), "year", true).toString();
            let temp = String(time).split(".");
            temp[1] = String(temp[1]).padEnd(15, "0") ?? 0;
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = temp.join(".");
            let newBirthdayText = "Next birthday: " + new Date(nextBirthday(birthDnT))
            if (document.getElementById("birthday").innerText !== newBirthdayText) document.getElementById("birthday").innerText = newBirthdayText
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
            let newBirthdayText = "Next birthday: " + new Date(nextBirthday(birthDnT))
            if (document.getElementById("birthday").innerText !== newBirthdayText) document.getElementById("birthday").innerText = newBirthdayText
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
            let newBirthdayText = "Next birthday: " + new Date(nextBirthday(birthDnT))
            if (document.getElementById("birthday").innerText !== newBirthdayText) document.getElementById("birthday").innerText = newBirthdayText
          },50)`
        } else if (type == "prettyLeft") {
          generator += `
          // PrettyLeft
          setInterval(() => {
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime() > 0 ? prettyMs(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime(), {keepDecimalsOnWholeSeconds:true}) : prettyMs(0,{keepDecimalsOnWholeSeconds:true})).replace(wordSplitter, ' ')
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerText !== newBirthdayText) document.getElementById("birthday").innerText = newBirthdayText
          },50)`
        } else if (type == "prettyFLeft") {
          generator += `
          // PrettyFLeft
          setInterval(() => {
            ${settings.changeCountdownText ? `if (!celebrationTime)` : ""}
            document.getElementById("time").innerHTML = (${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime() > 0 ? prettyMs(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}) - new Date().getTime(), {verbose: true, keepDecimalsOnWholeSeconds:true}) : prettyMs(0, {verbose: true, keepDecimalsOnWholeSeconds:true})).replace(wordSplitter, ' <br class="mobile-break">')
            let newBirthdayText = ${settings.untilAge ? '"Turns <b>' + settings.untilAge + '</b> on: "' : '"Next birthday: "'} + new Date(${settings.untilAge ? "getBirthday" : "nextBirthday"}(birthDnT${settings.untilAge ? ", untilAge" : ""}))
            if (document.getElementById("birthday").innerText !== newBirthdayText) document.getElementById("birthday").innerText = newBirthdayText
          },50)`

        }


        let source_code = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title></title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.12/dayjs.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.12/plugin/timezone.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.12/plugin/utc.min.js"></script>
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
            dayjs.extend(window.dayjs_plugin_utc)
            dayjs.extend(window.dayjs_plugin_timezone)

            ${generator}
          </script>
        </body>
        </html>
        `
        return resolve(source_code)

      })
  }
