var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(7380, () => console.log('listening on 7380'))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
})
// GET /testing
app.get('/testing', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/testing.html'));
})
app.use(function (req, res, next) {
	res.status(404).sendFile(path.join(__dirname + '/errors/404.html'));
});