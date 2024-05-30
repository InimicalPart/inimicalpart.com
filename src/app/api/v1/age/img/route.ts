import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import prettyMs from "pretty-ms";
import sharp from "sharp";

export async function GET(request: NextRequest) {
    let query = request.nextUrl.searchParams

    try {
        let unixDate: Date = new Date(Array.from(query.keys()).includes("birthUnix") ? parseInt((query.get("birthUnix") as string)) : 1163623320000)
        let offset = Array.from(query.keys()).includes("offset") ? parseInt((query.get("offset") as string)) : 0;
        let untilAge: number | null = Array.from(query.keys()).includes("untilAge") ? parseInt((query.get("untilAge") as string)) : null;
        let unixBirth: number = new Date(unixDate.getTime() + (Math.abs(offset / 60) * 60 * 60 * 1000)).getTime()
        let fontSize: number = Array.from(query.keys()).includes("font-size") ? parseInt((query.get("font-size") as string)) : 50;

        if (fontSize < 15) fontSize = 15
        if (fontSize > 200) fontSize = 200

        if (Array.from(query.keys()).includes("birth")) {
          try {
              unixDate = new Date((query.get("birth") as string));
              unixDate.setHours(unixDate.getHours() + Math.abs(offset / 60));
              unixBirth = unixDate.getTime();
          } catch (e) {
              return new NextResponse("Invalid query value: 'birth'. Has to be a valid JavaScript Date string.", {
                    status: 400,
                });
          }
        }

          let imageBuffer: any;

               if (Array.from(query.keys()).includes("years"))            imageBuffer = await makeIMG("years",        unixBirth, undefined, fontSize);
          else if (Array.from(query.keys()).includes("pretty"))           imageBuffer = await makeIMG("pretty",       unixBirth, undefined, fontSize);
          else if (Array.from(query.keys()).includes("prettyF"))          imageBuffer = await makeIMG("prettyF",      unixBirth, undefined, fontSize);
          else if (Array.from(query.keys()).includes("millisecondsLeft")) imageBuffer = await makeIMG("milliseconds", unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("secondsLeft"))      imageBuffer = await makeIMG("seconds",      unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("minutesLeft"))      imageBuffer = await makeIMG("minutes",      unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("hoursLeft"))        imageBuffer = await makeIMG("hours",        unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("daysLeft"))         imageBuffer = await makeIMG("days",         unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("weeksLeft"))        imageBuffer = await makeIMG("weeks",        unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("monthsLeft"))       imageBuffer = await makeIMG("months",       unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("prettyLeft"))       imageBuffer = await makeIMG("prettyLeft",   unixBirth, untilAge,  fontSize);
          else if (Array.from(query.keys()).includes("prettyFLeft"))      imageBuffer = await makeIMG("prettyFLeft",  unixBirth, untilAge,  fontSize);
          else imageBuffer = await makeIMG("years", unixBirth, undefined, fontSize);

        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                "X-NoExpire": "yes",
                "Etag": "off",
                "If_modified_since": "off",
                "Last-Modified": new Date().toUTCString(),
            },
            status: 200,
        })
      } catch (e) {
          console.log(e);
          return new NextResponse("An unexpected error occurred. Please try again later.", {
                status: 500,
        });
      }
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


  async function makeIMG(type: string, birthUnix: string | number | Date, untilAge: number | null = null, fontSize: number = 50) {
    return new Promise(async (resolve, _reject) => {
          var time: string;
          var seconds: number;
          var currentDnT = new Date()
          var birthDnT = new Date(birthUnix)
          if (type == "seconds") {
            if (!untilAge) {
              seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
              seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let temp = seconds.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0") ?? "0";

            time = temp.join(".");
          } else if (type == "minutes"){
            if (!untilAge) {
              seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
              seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let minutes = seconds / 60;

            let temp = minutes.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0") ?? "0";

            time = temp.join(".");
          } else if (type == "hours") {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let hours = seconds / (60 * 60);

            let temp = hours.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0") ?? "0";

            time = temp.join(".");
          } else if (type == "days") {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            let days = seconds / (60 * 60 * 24);

            let temp = days.toString().split(".");
            temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0") ?? "0";

            time = temp.join(".");
          } else if (type == "weeks") {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
              } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
              }

              let weeks = seconds / (60 * 60 * 24 * 7);

              let temp = weeks.toString().split(".");
              temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0") ?? "0";

              time = temp.join(".");
          } else if (type == "months") {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
              } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
              }

              let months = seconds / (60 * 60 * 24 * 30.437);

              let temp = months.toString().split(".");
              temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0") ?? "0";

              time = temp.join(".");
          } else if (type == "milliseconds") {
            if (!untilAge) {
                seconds = (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            } else {
                seconds = (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            }

            time = "" + seconds * 1000;
          } else if (type == "years") {
            time = dayjs().diff(dayjs(birthDnT.getTime()), "year", true).toString();

            let temp = String(time).split(".");
            temp[1] = String(temp[1]).padEnd(15, "0") ?? "0";

            time = temp.join(".")
          } else if (type == "pretty") {
            let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= currentDnT.getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }

              //! Add the leap days to the birthday
              birthDnT.setDate(birthDnT.getDate() + addDays)

              time = prettyMs(currentDnT.getTime() - (birthDnT as Date).getTime()).toString()
          } else if (type == "prettyF") {
              let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= currentDnT.getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }

              //! Add the leap days to the birthday
              birthDnT.setDate(birthDnT.getDate() + addDays)

              time = prettyMs(currentDnT.getTime() - birthDnT.getTime(), {verbose: true}).toString()
          } else if (type == "prettyLeft") {
            if (!untilAge) {
                time = prettyMs(nextBirthday(birthDnT) - currentDnT.getTime()).toString()
              } else {
                time = prettyMs(getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()).toString()
              }
          } else if (type == "prettyFLeft") {
              if (!untilAge) {
                  time = prettyMs(nextBirthday(birthDnT) - currentDnT.getTime(), {verbose: true}).toString()
              } else {
                  time = prettyMs(getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime(), {verbose: true}).toString()
              }
          } else {
            throw new Error("Invalid type")
          }

          //! Create the image
          let img = sharp({
            create: {
              width: fontSize * 12,
              height: fontSize * 2,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
          }).png()

          
          //! Add text
          img.composite([{
            input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${fontSize*12}" height="${fontSize*2}">
            <text x="5" y="${fontSize-5 < 1 ? 5 : fontSize-5}" font-family="Arial" font-size="${fontSize}" fill="white">${time}</text>
            </svg>`),
            gravity: "northwest"
          }])

            //! Trim the image
            const newImage = sharp(await img.toBuffer()).trim()

            //! Return the image
            resolve(await newImage.toBuffer());
        })
}