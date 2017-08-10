'use strict';


//Event Listeners
// window.addEventListener('load', loadRSSFeeds);
// document.getElementById('quick-search').addEventListener("submit", quickSearch);
// document.getElementById('add-feed').addEventListener("submit", addNewFeed);
// document.getElementById('add-keyterm').addEventListener("submit", addNewKeyword);
// document.getElementById('start-search').addEventListener("click", search);
// window.addEventListener('load', loadFeeds);


//Functions
// function loadRSSFeeds() {
//   var url = '/api/search';
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', url, true);
//   xhr.onload = function() {
//     if (xhr.status === 200) {
//       printRSSFeedsToPage(JSON.parse(xhr.responseText));
//     } else if (xhr.status === 404) {
//       //Provide error message if there is no content returned from their feed
//       document.getElementById('search-results').innerHTML =
//       '<p>The RSS feed url that you have provided does not return valid \
//         RSS style data.</p><p>Please check your url.</p>';
//     } else {
//       document.getElementById('search-results').innerHTML =
//       'Sorry, there has been an error fetching your feeds';
//     }
//   }
//   xhr.send();
// }



//Function to search for a single rss feed
function quickSearch(e) {
  event.preventDefault();
  var searchURL = document.getElementById('feed-url-input');
  console.log("SEARCH URL: " + searchURL.value);
  if (searchURL.value != "") {
    var url = '/api/search';
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type','application/json');
    http.onload = function() {
      if (http.status == 200) {
        searchURL.value = "";
        loadRSSFeeds();
      }
    };
    http.send(JSON.stringify(  {
        searchurl: searchURL.value
      }
  ));
  }
}

//Function to add a new feed to the feed list and display it on the page
function addNewFeed(e) {
  event.preventDefault();
  var newFeed = document.getElementById('feed-url-input');
  if (newFeed.value != "") {
    var url = '/api/feed';
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type','application/json');
    http.onload = function() {
      if (http.status == 200) {
        showFeed(newFeed.value);
        newFeed.value = "";
        //
      }
    };
    http.send(JSON.stringify(  {
        newfeed: newFeed.value
      }
  ));
  }
}

//Function to display a new feed in the feedbox
function showFeed(feed) {
  var feedList = document.getElementById("feed-list");
  var el = document.createElement('li');
  el.textContent = feed;
  feedList.appendChild(el);
}

//Function to show the already inputted feeds on the page
function loadFeeds() {
  var url = '/api/feed';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var list = JSON.parse(xhr.responseText).userFeedList;
      console.log(list);
      for (var i = 0; i < list.length; i++) {
        showFeed(list[i]);
      }
    } else if (xhr.status === 404) {
      //Get error if no elements are in list
      // document.getElementById('search-results').innerHTML =
      // '<p>The RSS feed url that you have provided does not return valid \
      //   RSS style data.</p><p>Please check your url.</p>';
      console.log("Caught 404");
    } else {
      document.getElementById('search-results').innerHTML =
      'Sorry, there was an error when fetching the feeds.';
    }
  }
  xhr.send();
}

//Function to show the already inputted keywords on the page
function loadKeywords() {
  var url = '/api/keyword';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      showKeyword(JSON.parse(xhr.responseText));
    } else if (xhr.status === 404) {
      //Get error if no elements are in list
      // document.getElementById('search-results').innerHTML =
      // '<p>The RSS feed url that you have provided does not return valid \
      //   RSS style data.</p><p>Please check your url.</p>';
      console.log("Caught 404");
    } else {
      document.getElementById('search-results').innerHTML =
      'Sorry, there was an error when fetching the keywords.';
    }
  }
  xhr.send();
}

//Function to add a new keyword to the keyword list and display it on the page
function addNewKeyword(e) {
  event.preventDefault();
  var newKeyword = document.getElementById('keyterm-input');
  if (newKeyword.value != "") {
    var url = '/api/keyword';
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type','application/json');
    http.onload = function() {
      if (http.status == 200) {
        showKeyword(newKeyword.value);
        newKeyword.value = "";

      }
    };
    http.send(JSON.stringify(  {
        newfeed: newKeyword.value
      }
  ));
  }
}

//Function to display a new feed in the feedbox
function showKeyword(word) {
  var keywordList = document.getElementById("keyword-list");
  var el = document.createElement('li');
  el.textContent = word;
  keywordList.appendChild(el);
}

//Function to search all RSS fields that have been inputted
function search() {
  var url = '/api/search';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
      printRSSFeedsToPage(JSON.parse(xhr.responseText));
    } else if (xhr.status === 404) {
      //Provide error message if there is no content returned from their feed
      document.getElementById('search-results').innerHTML =
      '<p>The RSS feed url that you have provided does not return valid \
        RSS style data.</p><p>Please check your url.</p>';
    } else {
      document.getElementById('search-results').innerHTML =
      'Sorry, there has been an error fetching your feeds';
    }
  }
  xhr.send();
}

//Function to display RSS data on the page
function printRSSFeedsToPage(articles) {
  console.log(articles);
  var container = document.getElementById('search-results');
  //clear out container
  container.innerHTML = "";

  //Loop through all articles to display
  articles.forEach(function(article) {
    //Add Title
    var header = document.createElement('p');
    container.appendChild(header);

    var link = document.createElement('a');
    link.textContent = article.title;
    link.setAttribute('href', article.link);
    link.setAttribute('target', 'blank');
    header.appendChild(link);
  });
}
