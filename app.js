// index.js
// where your node app starts

// init project
var express = require('express');
var moment = require('moment');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:time", function (req, res) {
  const { time } = req.params;

  const unixTimestampPattern = /^\d+$/;

  const isUnixFormat = unixTimestampPattern.test(time);

  if (isUnixFormat) {

    console.log(time.slice(0, 9))
    const date = moment.unix(time.slice(0, 10));
    const formattedDate = date.format('ddd, DD MMM YYYY HH:mm:ss [GMT]');

    res.json({ utc: formattedDate, unix: Number(time) });
  } else {

    const utc = new Date(time).toUTCString();
    const unix = moment.utc(utc, "ddd, DD MMM YYYY HH:mm:ss [GMT]").valueOf();

    res.json({ utc, unix })

  }

});

// listen for requests :)
var listener = app.listen(12736, function () {
  console.log('Your app is listening on port ' + 12736);
});
