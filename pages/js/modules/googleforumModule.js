var feed = require("feed-read-parser");

//Exported Functions
module.exports = {
  getItems: function(callback, feeds, keywordList) {
    fetchRSS(callback, feeds, keywordList);
  }
}

//Local Functions
// sorted = sortThroughJSON(list, keywordList);
// //Call callback to move variable sorted to server
// callback(sorted);

//FetchAPI gets the json from the api source and returns it
function fetchRSS(callback, feeds, keywordList) {
  var rss = [];
  for (var i = 0; i < feeds.length; i++) {
    rss.push(feeds[i].source);
    console.log(feeds[i].source.title);
  }
  feed(rss, function (err, articles) {
    if (err) throw err;
    var sortedList = sortThroughRSS(articles, keywordList);
    callback(sortedList);
  });
}

/**
  * Function to sort through the JSON to create a list of items that
  * 1. Each item contains a keyword that we are looking for
  * 2. Only contains data such as title and link that we need.
  */
function sortThroughRSS(rss, keywordList) {
  var sortedList = [];
  for (var i = 0; i < rss.length; i++) {
    var item = checkForKeywords(rss[i], keywordList);
    if (item != null) {
      sortedList.push(item);
    }
  }
  return sortedList;
}


//Function to take an item in the JSON array and check whether any of its
//  Fields contain a keyword that we have saved.
//  The ID uses the section of the link which is noted permalink in the RSS.
function checkForKeywords(item, keywordList) {
  var wordArr = keywordList;
  for (var i = 0; i < wordArr.length; i++) {
    var word = wordArr[i];
    if ((item.title.toLowerCase().indexOf(word) > -1) ||
    (item.content.toLowerCase().indexOf(word) > -1)) {
      var id = getSegment(item.link, 4);
      var newJson = {
        'id': id,
        'title': item.title,
        'content': item.content,
        'link':item.link,
        'keyword': word
      };
      return newJson;
    }
  }
  return null;
}

/**
 * Function to get a part of a link. Index dicates inside which slash to get the data from.
 */
function getSegment(url, index) {
   return url.replace(/^https?:\/\//, '').split('/')[index];
}
