 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

// call packages
var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

var router = express.Router();

router.route("/:message")
  
  .get(function(req, res) {
    var stamp = {"unix": 0, "natural": 0};
    var message = req.params.message;
    var str = isNaN(message);
  if (str) {
    // convert to unix
    message = new Date(message).getTime() / 1000;
    message = JSON.stringify(message);
    stamp.unix = message;
    stamp.natural = req.params.message;
  } else {
    // convert to string
    message = new Date(message*1000);
    var locale = "en-us",
    month = message.toLocaleString(locale, { month: "long" }),
    day = message.getDate(),
    year = message.getFullYear();
    var date = month+' '+day+', '+year;
    stamp.unix = req.params.message;
    stamp.natural = date;
    if (month === "Invalid Date") {
      message = null;
    }
  }

  if (message === null || isNaN(message)) {
    stamp.unix = null;
    stamp.natural = null;
  }

  res.json(stamp);
});


app.use('/api', router);


// middleware ??
app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

