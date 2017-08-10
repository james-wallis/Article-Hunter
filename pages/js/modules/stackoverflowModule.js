var fetch = require('node-fetch');

//Exported Functions
module.exports = {
  getStackOverflowItems: function(callback, keywordList) {
    fetchAPI(callback, keywordList);
  }
}

//Local Functions

//FetchAPI gets the json from the api source and returns it
function fetchAPI(callback, keywordList) {
  // adding '&filter=withbody' to the end of the search url on stack overflow will include the question body
  // This makes it an even more indepth keyword search
  fetch('https://api.stackexchange.com/2.2/questions?pagesize=100&order=desc&sort=creation&site=stackoverflow&filter=withbody')
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      //we only want the items in the json and not the information about stackoverflow
      var list = json.items;
      // console.log(list);
      sorted = sortThroughJSON(list, keywordList);
      //Call callback to move variable sorted to server
      callback(sorted);
    }).catch(function (err) {
     console.log("Promise Rejected");
     console.log(err);
});
}

/**
  * Function to sort through the JSON to create a list of items that
  * 1. Each item contains a keyword that we are looking for
  * 2. Only contains data such as title and link that we need.
  */
function sortThroughJSON(json, keywordList) {
  var sortedList = [];
  for (var i = 0; i < json.length; i++) {
    var item = checkForKeywords(json[i], keywordList);
    if (item != null) {
      sortedList.push(item);
    }
  }
  return sortedList;
}


//Function to take an item in the JSON array and check whether any of its
//  Fields contain a keyword that we have saved.
function checkForKeywords(item, keywordList) {
  var wordArr = ["java", "swift", "javascript", "ibm"];
  wordArr = keywordList;
  for (var i = 0; i < wordArr.length; i++) {
    var word = wordArr[i];
    if ((item.title.indexOf(word) > -1) ||
    (item.body.indexOf(word) > -1) ||
    (item.tags.indexOf(word) > -1)) {
      var newJson = {
        'id': item.question_id,
        'title': item.title,
        'body': item.body,
        'tags': item.tags,
        'link':item.link
      };
      // console.log(newJson);
      return newJson;
    }
  }
  return null;
}
