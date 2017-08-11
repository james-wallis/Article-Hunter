/*
 * The Server for the Article Hunter RSS Feed Trawler.
 * Author: James Wallis
 */
'use static'
//Modules
var stack = require('./pages/js/modules/stackoverflowModule.js');
//App.listen is here so that socket.io works as expected.
//This fixes the error which occured possibly due to the redirection of js files below.
var express = require('express');
var app     = express();
var server  = app.listen(8000);
var io      = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var feed = require("feed-read-parser");
var fetch = require('node-fetch');

//Old RSS Feeds
// var testFeed = 'https://stackoverflow.com/feeds/tag?tagnames=java&sort=newest';
// var emptyFeed = "https://stackoverflow.com/feeds/tag?tagnames=javametrics";
// var givenFeed = 'http://www.gamekult.com/feeds/actu.html';
// var testFeedList = [
//     'https://stackoverflow.com/feeds/tag?tagnames=java&sort=newest',
//     'https://stackoverflow.com/feeds/tag?tagnames=node.js&sort=newest',
//     'https://groups.google.com/forum/feed/nodejs/topics/rss.xml',
//     'http://rss.slashdot.org/Slashdot/slashdotDevelopers',
//     'https://groups.google.com/forum/feed/swift-language/topics/rss.xml'
//   ];

//Initialise userFeed variable for quick search
var userFeed;
//Initialise userFeedList for use of automated and multiple feed search
var userFeedList = ["http://rss.slashdot.org/Slashdot/slashdotDevelopers"];
//Initialise userKeywordList for use for multiple keyword searches
var userKeywordList = ["java", "swift", "javascript", "ibm", "node"];
//Create a list of the data found from the API's and RSS
var discoveredArticles = {"stackoverflow": []};
//Set the refresh rate for the feeds (In minutes);
var minutesTilRefresh = 0.5;
//Set the amount of articles displayed on a page at any one time
var amountOnPage = 30;

// Constant page directory
var pages = __dirname + '/pages/html';
var stylesheet = __dirname + '/pages/css';
var script = __dirname + '/pages/js';

// Static files
app.use('/', express.static(pages, { extensions: ['html'] }));
app.use('/', express.static(stylesheet, { extensions: ['css'] }));
app.use('/', express.static(script, { extensions: ['js'] }));

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
// app.listen(8000);
console.log("\nArticle Hunter has been loaded!");
console.log("Available on port 8000\n");
console.log("Settings:");
console.log("    Feed Refresh: " + minutesTilRefresh + " minutes");
console.log("    Amount of Articles on a page: " + amountOnPage);

//Socket.io functions
//Send discoveredArticles to clients when the client loads
io.on('connection', function(socket){
  io.emit('articles', discoveredArticles);
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  io.emit('keywordList', userKeywordList);
  socket.on('addKeyword', addKeyword);
  socket.on('editKeyword', editKeyword);
  socket.on('deleteKeyword', deleteKeyword);
});

//Function which runs all data collector functions
function getFeeds() {
  console.log("\nSearching Feeds...\n");
  stack.getStackOverflowItems(stackOverflowCallback, userKeywordList);
}
//Start feed collection and timer
function startFeedCollection() {
  getFeeds();
  var refreshRate = 10 * 6000 * minutesTilRefresh;
  setInterval(function() {
    getFeeds();
  }, refreshRate);
}

//Function used as a call back
function stackOverflowCallback(list) {
  addNewStackOverflowToList(list);
}

//Function used to add new items to the stack overflow list when they have been found
//If item is already in the list then it will ensure it is not duplicated
//If the list changes size then the new list will be sent to the clients using socket.io
function addNewStackOverflowToList(list) {
  if(discoveredArticles.stackoverflow.length > 0) {
    var soList = discoveredArticles.stackoverflow;
    var previousListLength = discoveredArticles.stackoverflow.length;
    var numberSame = 0;
    for (var i = 0; i<soList.length; i++) {
      var found = false;
      var j = 0;
      while ((found === false) && (j < list.length)) {
        if (soList[i].id == list[j].id) {
          list.splice(j, 1);
          numberSame++;
          found = true;
        }
        j++;
      }
    }
    soList = soList.concat(list);
    console.log("previousListLength: " + previousListLength);
    console.log("soList: " + soList.length);
    discoveredArticles.stackoverflow = soList;
    //If new list is larger than previous list notify clients
    if (soList.length > previousListLength) {
      //Send new list to clients
      io.emit('articles', discoveredArticles);
    }
  } else {
    discoveredArticles.stackoverflow = list;
    io.emit('articles', discoveredArticles);
  }
  console.log("Stack Overflow List Length: " + discoveredArticles.stackoverflow.length);
}

//Settings Page Functions
function addKeyword(keyword) {
  keyword = keyword.toLowerCase();
  if (keyword !== "" && keyword !== null && !(userKeywordList.indexOf(keyword) >= 0)) {
    userKeywordList.push(keyword);
  }
  io.emit('keywordList', userKeywordList);
}

function editKeyword(json) {
  var index = json.index;
  var keyword = json.edit;
  userKeywordList[index] = keyword;
  io.emit('keywordList', userKeywordList);
}

function deleteKeyword(index) {
  userKeywordList.splice(index, 1);
  io.emit('keywordList', userKeywordList);
}


//Start refreshFeedFunction
// startFeedCollection();
