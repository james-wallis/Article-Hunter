/*
 * The Server for the Article Hunter RSS Feed Trawler.
 */

'use static'
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var feed = require("feed-read-parser");

var app = express();
var testFeed = 'https://stackoverflow.com/feeds/tag?tagnames=java&sort=newest';
var emptyFeed = "https://stackoverflow.com/feeds/tag?tagnames=javametrics";
var givenFeed = 'http://www.gamekult.com/feeds/actu.html';
var testFeedList = [
    'https://stackoverflow.com/feeds/tag?tagnames=java&sort=newest',
    'https://stackoverflow.com/feeds/tag?tagnames=node.js&sort=newest',
    'https://groups.google.com/forum/feed/nodejs/topics/rss.xml',
    'http://rss.slashdot.org/Slashdot/slashdotDevelopers',
    'https://groups.google.com/forum/feed/swift-language/topics/rss.xml'
  ];

//Initialise userFeed variable for quick search
var userFeed;
//Initialise userFeedList for use of automated and multiple feed search
var userFeedList = [];
//Initialise userKeywordList for use for multiple keyword searches
var userKeywordList = [];


// Constant page directory
var pages = __dirname + '/pages/html';
var stylesheet = __dirname + '/pages/css';
// var script = __dirname + '/pages/js';

// Static files
app.use('/', express.static(pages, { extensions: ['html'] }));
app.use('/', express.static(stylesheet, { extensions: ['css'] }));
// app.use('/', express.static(script, { extensions: ['js'] }));

/**
 * Parses the text as URL encoded data and exposes the resulting object on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// logging in order to fully understand what the API is doing
app.use('/', function(req, res, next) { console.log(new Date(), req.method, req.url); next(); });



// start the server
app.listen(8000);
console.log("\nArticle Hunter has been loaded!");
console.log("Available on port 8000\n");


//Server functions
app.get('/api/search', sendFeed);
app.post('/api/search', postFeed);
app.post('/api/addFeed', addFeed);
app.post('/api/addKeyword', addKeyword);


//Send Feed will parse the given RSS feed and return it as JSON
function sendFeed(req, res) {
  feed(userFeedList, function(err, articles) {
    // if (err) return error(res, 'failed to fetch feeds', err);
    if (err) {
      //Send error 404 as there is no content
      res.status(404).send('Something broke!');
    };
    res.json(articles);
  });
}

//Post Feed will get a new feed from a form
function postFeed(req, res) {
  userFeed = req.body.searchurl;
  if (req.accepts('html')) {
    // browser should go to the listing of units
    res.redirect(303, '/#');
  } else {
    res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
    // XML HTTP request that accepts JSON will instead get that
    res.json({searchurl: req.body.searchurl});
  }
  //This would add to list.
  // userFeed.push(req.body.searchurl);
}

//Add Feed will add a feed to userFeedList in order to perform searches
function addFeed(req, res) {
  var inList = false;
  for (var i = 0; i < userFeedList.length; i++) {
    if (userFeedList[i] == req.body.newfeed) {
      inList = true;
    }
  }
  if (!inList) {
    userFeedList.push(req.body.newfeed);
  }
  if (req.accepts('html')) {
    // browser should go to the listing of units
    res.redirect(303, '/#');
  } else {
    res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
    // XML HTTP request that accepts JSON will instead get that
    res.json({searchurl: req.body.newfeed});
  }
}

//Add Keyword will add a keyword to userKeywordList in order to perform searches
function addKeyword(req, res) {
  userKeywordList.push(req.body.newKeyword);
  if (req.accepts('html')) {
    // browser should go to the listing of units
    res.redirect(303, '/#');
  } else {
    res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
    // XML HTTP request that accepts JSON will instead get that
    res.json({searchurl: req.body.newKeyword});
  }
}
























//RSS FEED TESTING
var rss = [
  // 'http://www.eurogamer.net/?format=rss',
  // 'http://fr.ign.com/feed.xml',
  // 'http://www.gamekult.com/feeds/actu.html',
  'https://stackoverflow.com/feeds/tag?tagnames=java&sort=newest',
  'https://stackoverflow.com/feeds/tag?tagnames=node.js&sort=newest',
  'https://groups.google.com/forum/feed/nodejs/topics/rss.xml',
  'http://rss.slashdot.org/Slashdot/slashdotDevelopers',
  'https://groups.google.com/forum/feed/swift-language/topics/rss.xml'
]

// feed(rss, function(err, articles) {
//     // if (err) throw err;
//     // articles is an array of article with properties described above.
//     // for (var i = 0; i < articles.length; i++) {
//     //   console.log(articles[i][0]);
//     // }
//     // console.log(articles.length);
//     // console.log(articles[10]);
//     // console.log("\n\n");
//     // console.log(articles[20]);
//     // console.log("\n\n");
//     // console.log(articles[50]);
// });
