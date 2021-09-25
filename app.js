var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const { text } = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(7380, () => console.log('listening on 7380'))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
})
// GET /testing
/*app.get('/testing', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/testing.html'));
})*/
app.get("/api/yearsOld", function(req, res) {
	res.setHeader('Content-Type', 'image/png');
	time = (new Date() - new Date(1163622720000)) / (1000 * 60 * 60 * 24 * 365.2666666666666);
	// console.log(time)
	time = String(time).split(".")
	time[1] = String(time[1]).padEnd(15, "0")
	time = time.join(".")
	// res.send(time)
	const Jimp = require("jimp");
	Jimp.read(path.join(__dirname, "public/img/blank.png")).then(function (image) {

      Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function (font) {

        image.print(font, 0,-5, time);
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          image.write(path.join(__dirname, "public/img/text.png"));
		  setTimeout(() => {
		  res.sendFile(path.join(__dirname + '/public/img/text.png'));
		  }, 1000);
		})
	}).then(function () {
	});

      }).catch(function (err) {
        console.error(err);
      });
	  //send image to user

})
app.use(function (req, res, next) {
	res.status(404).sendFile(path.join(__dirname + '/errors/404.html'));
});