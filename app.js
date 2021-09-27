var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 20
});

// apply rate limiter to all requests
app.use(limiter);
app.listen(7380, () => console.log('listening on 7380'))

app.get("/img/years.png")
function nextBirthday(date, a) {
	let thisYearBd = new Date(
	  date.getMonth() +
		1 +
		"/" +
		date.getDate() +
		"/" +
		new Date().getFullYear() +
		" " +
		date.getHours() +
		":" +
		date.getMinutes() +
		":" +
		date.getSeconds()
	);
	// console.log(thisYearBd)
	if (thisYearBd < new Date()) {
	  thisYearBd = thisYearBd.setFullYear(thisYearBd.getFullYear() + 1);
	}
	if (a) {
	  console.log(new Date(thisYearBd));
	}
	if (thisYearBd instanceof Date) {
	  return thisYearBd.getTime();
	} else {
	  return thisYearBd;
	}
}
setInterval(() => {
	makeIMG("years")
	makeIMG("seconds")
	makeIMG("hours")
	makeIMG("minutes")
	makeIMG("months")
	makeIMG("days")
	makeIMG("weeks")
}, 800)
  function makeIMG(unit) {
	var time;
	if (unit) {
		if (unit == "seconds") {
			tempTime = "" + (nextBirthday(new Date(1163622720000)) - new Date()) / 1000;
			temp = tempTime.split(".");
			temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0");
			if (temp[1] === undefined) {
			  temp[1] = "0";
			}
			time = temp.join(".");
			image=path.join(__dirname, "public/img/blankseconds.png")
		} else if (unit == "minutes") {
			tempTime =
			"" + (nextBirthday(new Date(1163622720000)) - new Date()) / (1000 * 60);
		  temp = tempTime.split(".");
		  temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0");
		  if (temp[1] === undefined) {
			temp[1] = "0";
		  }
		  time = temp.join(".");
			image=path.join(__dirname, "public/img/blankminutes.png")
		} else if (unit == "hours") {
			tempTime =
			"" + (nextBirthday(new Date(1163622720000)) - new Date()) / (1000 * 60*60);
		  temp = tempTime.split(".");
		  temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0");
		  if (temp[1] === undefined) {
			temp[1] = "0";
		  }
		  time = temp.join(".");
			image=path.join(__dirname, "public/img/blankhours.png")
		} else if (unit == "days") {
			tempTime =
			"" + (nextBirthday(new Date(1163622720000)) - new Date()) / (1000 * 60*60*24);
		  temp = tempTime.split(".");
		  temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0");
		  if (temp[1] === undefined) {
			temp[1] = "0";
		  }
		  time = temp.join(".");
			image=path.join(__dirname, "public/img/blankdays.png")
		} else if (unit == "weeks") {
			tempTime =
			"" + (nextBirthday(new Date(1163622720000)) - new Date()) / (1000 * 60*60*24*7);
		  temp = tempTime.split(".");
		  temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0");
		  if (temp[1] === undefined) {
			temp[1] = "0";
		  }
		  time = temp.join(".");
			image=path.join(__dirname, "public/img/blankweeks.png")

		} else if (unit == "months") {
			tempTime =
			"" + (nextBirthday(new Date(1163622720000)) - new Date()) / (1000 * 60*60*24*30.417);				
		  temp = tempTime.split(".");
		  temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0");
		  if (temp[1] === undefined) {
			temp[1] = "0";
		  }
		  time = temp.join(".");
		  image=path.join(__dirname, "public/img/blankmonths.png")
		} else if (unit == "milliseconds") {
			time = "" + nextBirthday(new Date(1163622720000)) - new Date().getTime();
			image=path.join(__dirname, "public/img/blankmilliseconds.png")
		} else if (unit == "years") {
			time = (new Date() - new Date(1163622720000)) / (1000 * 60 * 60 * 24 * 365.2666666666666);
			// console.log(time)
			time = String(time).split(".")
			time[1] = String(time[1]).padEnd(15, "0")
			time = time.join(".")
			image=path.join(__dirname, "public/img/blank.png")
		}
	} else {
		unit = "years"
		time = (new Date() - new Date(1163622720000)) / (1000 * 60 * 60 * 24 * 365.2666666666666);
		// console.log(time)
		time = String(time).split(".")
		time[1] = String(time[1]).padEnd(15, "0")
		time = time.join(".")
		image=path.join(__dirname, "public/img/blank.png")
	}
	// res.setHeader('Content-Type', 'image/png');
	// res.send(time)
	const Jimp = require("jimp");
	Jimp.read(image).then(function (image) {

      Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function (font) {

        image.print(font, 0,-5, time);
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          image.write(path.join(__dirname, "public/img/"+unit+".png"));
		})
	})

      }).catch(function (err) {
        console.error(err);
      });
	  //send image to user

  }