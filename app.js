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

// New endpoint for /api without time parameter
app.get("/api", function (req, res) {
  const currentUnixTime = moment().unix();
  res.json({  unix: currentUnixTime });
});

app.get("/api/:time", function (req, res) {
  const { time } = req.params;

  // Check if the input date string is empty
  if (!time) {
    const currentUnixTime = moment().unix();
    const currentUtcTime = moment.unix(currentUnixTime).format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
    res.json({ unix: currentUnixTime });
    return;
  }

  const unixTimestampPattern = /^\d+$/;
  const isUnixFormat = unixTimestampPattern.test(time);

  if (isUnixFormat) {
    const date = moment.unix(time.slice(0, 10));
    // Check if the date is valid
    if (!date.isValid()) {
      res.json({ error: "Invalid Date" });
      return;
    }
    const formattedDate = date.format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
    res.json({ utc: formattedDate, unix: Number(time) });
  } else {
    const utc = new Date(time).toUTCString();
    const unix = moment.utc(utc, "ddd, DD MMM YYYY HH:mm:ss [GMT]").valueOf();
    // Check if the date is valid
    if (!moment(utc, "ddd, DD MMM YYYY HH:mm:ss [GMT]").isValid()) {
      res.json({ error: "Invalid Date" });
      return;
    }
    res.json({ utc, unix });
  }
});

var listener = app.listen(12736, function () {
  console.log('Your app is listening on port ' + 12736);
});
