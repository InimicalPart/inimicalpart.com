import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
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
              if (unixDate.toString() == "Invalid Date") throw new Error("Invalid date")
              unixDate.setHours(unixDate.getHours() + Math.abs(offset / 60));
              unixBirth = unixDate.getTime();
          } catch (e) {
              return new NextResponse("Invalid query value: 'birth'. Has to be a valid JavaScript Date string.", {
                    status: 400,
                });
          }
        }

        return NextResponse.json({
            years: parseFloat(await get("years", unixBirth, untilAge) as string),
            nextBirthday: new Date(nextBirthday(unixDate)).toISOString(),
            turnsAge: parseInt((await get("years", unixBirth, untilAge) as string).split(".")[0])+1,
            secondsLeft: parseFloat(await get("seconds", unixBirth, untilAge) as string),
            minutesLeft: parseFloat(await get("minutes", unixBirth, untilAge) as string),
            hoursLeft: parseFloat(await get("hours", unixBirth, untilAge) as string),
            daysLeft: parseFloat(await get("days", unixBirth, untilAge) as string),
            weeksLeft: parseFloat(await get("weeks", unixBirth, untilAge) as string),
            monthsLeft: parseFloat(await get("months", unixBirth, untilAge) as string),
            millisecondsLeft: parseInt(await get("milliseconds", unixBirth, untilAge) as string),
            pretty: await get("pretty", unixBirth, untilAge),
            prettyF: await get("prettyF", unixBirth, untilAge),
            prettyLeft: await get("prettyLeft", unixBirth, untilAge),
            prettyFLeft: await get("prettyFLeft", unixBirth, untilAge),

        }, { status: 200 });

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



  async function get(type: string, birthUnix: string | number | Date, untilAge: number | null = null) {
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
            time = dayjs().diff(dayjs.utc(birthUnix), "year", true).toString();

            let temp = String(time).split(".");
            temp[1] = String(temp[1]).padEnd(15, "0") ?? "0";

            time = temp.join(".")
          } else if (type == "pretty") {
            let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= currentDnT.getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }
              dayjs().diff(dayjs.utc(birthUnix), "year", true).toString()
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

            resolve(time)
        })
}