'use strict';
//Event Listeners
// window.addEventListener('load', loadRSSFeeds);
document.getElementById('quick-search').addEventListener("submit", quickSearch);


//Functions
function loadRSSFeeds() {
  var url = '/api/search';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
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

function printRSSFeedsToPage(articles) {
  console.log(articles);
  var container = document.getElementById('search-results');
  //clear out container
  container.innerHTML = "";

  //Loop through all articles to display
  articles.forEach(function(article) {
    //Add Title
    var header = document.createElement('h4');
    container.appendChild(header);

    var link = document.createElement('a');
    link.textContent = article.title;
    link.setAttribute('href', article.link)
    header.appendChild(link);
  });
}

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
