import onHeaders from "on-headers";
import { Response, Request, Express } from "express-serve-static-core";
import prettyMs from "pretty-ms";
import jimp from "jimp";


export async function main(API: Express) {
    API.get(["/v1/age/img", "/v1/age/img.png"], async (req: Request, res: Response) => {
        try {
            let query = req.query;
            let imageBuffer: any = "";
            let unixBirth: any
            let unixDate: Date
            let untilAge: number;
            let offset = 0;
            if (Object.keys(query).includes("offset")) {
            offset = parseInt((query["offset"] as string));
            }
            if (Object.keys(query).includes("birth")) {
            try {
                unixDate = new Date((query["birth"] as string));
                unixDate.setHours(unixDate.getHours() + Math.abs(offset / 60));
                unixBirth = unixDate.getTime();
            } catch (e) {
                return res.status(400).send("Invalid query value: birth");
            }
            }
            if (!unixBirth) {
                unixDate = new Date(
                    Object.keys(query).includes("birthUnix")
                    ? parseInt((query["birthUnix"] as string))
                    : 1163623320000
                );
                unixDate.setHours(unixDate.getHours() + Math.abs(offset / 60));
                unixBirth = unixDate.getTime();
            }
            untilAge = Object.keys(query).includes("untilAge") ? parseInt((query["untilAge"] as string)) : null;
            let fRD = Object.keys(query).includes("rmvdif") ? parseInt((query["rmvdif"] as string)) : null;
            let xrmvbias = Object.keys(query).includes("xrmvbias") ? parseFloat((query["xrmvbias"] as string)) : null;
            let yrmvbias = Object.keys(query).includes("yrmvbias") ? parseFloat((query["yrmvbias"] as string)) : null;
            // scrubCacheControl(res);


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


            res.removeHeader("x-powered-by"); // hides that the server is using express

            //! Disable cache
            res.setHeader("Etag", "off"); 
            res.setHeader("If_modified_since", "off");
            res.setHeader("X-NoExpire", "yes"); // tell NGINX to disable the Expires header
            res.setHeader("Last-Modified", new Date().toUTCString());
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");

            //! Tell recipient that the response is a .png image
            res.setHeader("Content-Type", "image/png");

            console.log(res.getHeader("X-NoExpire"))
            //! Send the image
            res.status(200).end(imageBuffer.toString("base64"), 'base64')

            console.log(res.getHeader("X-NoExpire"))
            return;
        } catch (e) {
            console.log(e);
            res.status(400).send("Err: " + e);
        }
    });
}

function scrubCacheControl(res: Response<any, Record<string, any>, number>) {
    onHeaders(res, function () {
      this.removeHeader("Cache-Control");
    });
  }

function getBirthday(birthday: Date, age: number) {
    let newDate = new Date(birthday.toISOString());
    newDate.setFullYear(newDate.getFullYear() + age);
    return newDate;
  }
  

  //! Get the next birthday from a date
  /* prettier-ignore */
  function nextBirthday(e: Date, t?: undefined) {let n: Date | number = new Date(e.getMonth() + 1 + "/" + e.getDate() + "/" + new Date().getFullYear() + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds());return (n < new Date() && (n = n.setFullYear(n.getFullYear() + 1)),t,n instanceof Date ? n.getTime() : n);}
  
  /* prettier-ignore */
  async function makeIMG(type: string, birthUnix: string | number | Date,fixedRmvDif: number,_xrmvbias=0,yrmvbias=0, untilAge=null) {
      return new Promise(async (resolve, _reject) => {
          var t: string | number | any[], temp: any[], tempTime: string;
          var currentDnT = new Date()
          var birthDnT = new Date(birthUnix)
          var rmvdif = 10
          if ("seconds" == type) {
            if (!untilAge)
            tempTime = "" + (nextBirthday(birthDnT) - currentDnT.getTime()) / 1000;
            else tempTime = "" + (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / 1000;
            temp = tempTime.split(".");
              temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0");
              void 0 === temp[1] && (temp[1] = "0");
              t = temp.join(".");
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("minutes" == type){
            if (!untilAge)
              tempTime = "" + (nextBirthday(birthDnT) - currentDnT.getTime()) / (1000 * 60 * 1);
              else tempTime = "" + (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / (1000 * 60 * 1);
              temp = tempTime.split(".");
              temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0");
              void 0 === temp[1] && (temp[1] = "0");
              t = temp.join(".")
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("hours" == type) {
            if (!untilAge) tempTime = "" + (nextBirthday(birthDnT) - currentDnT.getTime()) / (1000 * 60 * 60 * 1);
              else tempTime = "" + (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / (1000 * 60 * 60 * 1);
              temp = tempTime.split("."), temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0");
              void 0 === temp[1] && (temp[1] = "0"); t = temp.join(".");
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("days" == type) {
            if (!untilAge)
              tempTime = "" + (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / (1000 * 60 * 60 * 24 * 1);
              else tempTime = "" + (nextBirthday(birthDnT) - currentDnT.getTime()) / (1000 * 60 * 60 * 24 * 1);
              temp = tempTime.split(".");
              temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0");
              void 0 === temp[1] && (temp[1] = "0");
              t = temp.join(".");
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("weeks" == type) {
            if (!untilAge)
              tempTime = "" + (nextBirthday(birthDnT) - currentDnT.getTime()) / (1000 * 60 * 60 * 24 * 7);
              else tempTime = "" + (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / (1000 * 60 * 60 * 24 * 7);
              temp = tempTime.split(".");
              temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0");
              void 0 === temp[1] && (temp[1] = "0");
              t = temp.join(".");
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("months" == type) {
            if (!untilAge) tempTime = "" + (nextBirthday(birthDnT) - currentDnT.getTime()) / (1000 * 60 * 60 * 24 * 30.437)
              else tempTime = "" + (getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime()) / (1000 * 60 * 60 * 24 * 30.437)
              temp = tempTime.split(".")
              temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0")
              void 0 === temp[1] && (temp[1] = "0")
              t = temp.join(".")
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("milliseconds" == type) {
            if (!untilAge) t = String(nextBirthday(birthDnT) - currentDnT.getTime())
            else t = String(getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime())
              if (!yrmvbias) yrmvbias = 12.5
          } else if ("years" == type) {
              t = (currentDnT.getTime() - birthDnT.getTime()) / (1000 * 60 * 60 * 24 * 365.2425) // 31540000000
              t = String(t).split(".");
              t[1] = String(t[1]).padEnd(15, "0")
              t = t.join(".")
              if (!yrmvbias) yrmvbias = 12.5
          } else if (type == "pretty") {
              function isLeapYear(year: number) {return ((year%4)==0&&!((year%400)!==0&&(year%100)==0))}
              let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= currentDnT.getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }
              birthDnT.setDate(birthDnT.getDate() +addDays)
              t = prettyMs(currentDnT.getTime() - (birthUnix as Date).getTime())
              rmvdif=4
              if (!yrmvbias) yrmvbias = 4
          } else if (type == "prettyF") {
              function isLeapYear(year: number) {return ((year%4)==0&&!((year%400)!==0&&(year%100)==0))}
              let addDays = 0
              for (var i = birthDnT.getFullYear(); i <= currentDnT.getFullYear(); i++) {
                  if (isLeapYear(i)) addDays++
              }
              birthDnT.setDate(birthDnT.getDate() +addDays )
              t = prettyMs(currentDnT.getTime() - birthDnT.getTime(), {verbose: true})
              rmvdif=4
              if (!yrmvbias) yrmvbias = 0
          } else if (type == "prettyLeft") {
              if (!untilAge) t = prettyMs(nextBirthday(birthDnT) - currentDnT.getTime())
              else t = prettyMs(getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime())
              rmvdif=10
              if (!yrmvbias) yrmvbias = 11
          } else if (type == "prettyFLeft") {
            if (!untilAge) t = prettyMs(nextBirthday(birthDnT) - currentDnT.getTime(), {verbose: true})
              else t = prettyMs(getBirthday(birthDnT, untilAge).getTime() - currentDnT.getTime(), {verbose: true})
              rmvdif=4
              if (!yrmvbias) yrmvbias = 4
              // &rmvdif=10&yrmvbias=11 to make it remove the bottom of the "y"
          }
          if (fixedRmvDif || fixedRmvDif == 0) rmvdif = fixedRmvDif
          let img = await jimp.read(1,1,0x0)
          let font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
          img.resize(2000,1000)
          img.print(font,0,0,{text:t})

          img = img.autocrop(false)
          

          img.getBuffer(jimp.MIME_PNG, (err, buffer) => {
            resolve(buffer)
          })
          // img.write(pth,()=>{return resolve(pth)})
  })
}


export default {main};