'use strict'

//Global Variables
var serverArticles = {};
//Doesn't work as we're not checking the length of serverArticles but serverArticles.stackoverflow
var servArtLength = 0;
var amountOnPage = 30;
var amountOfColumns = 3;
var currentPage = 0;
var activeFeed;
var buttonsDisplayed = false;
var seconds = 30;
var timer;


//Event Listeners
//Load discoveredArticles array on page load - this will be refreshed later using a refresh button
window.addEventListener('load', setUpdateTimer);
// window.addEventListener('load', loadDiscoveredArticles);
window.addEventListener('load', changeButtonWidth);
//update width of button selector on window resize
window.addEventListener('resize', changeButtonWidth);
document.getElementById('stack-overflow-button').addEventListener('click', loadFeed);
document.getElementById('google-forum-button').addEventListener('click', loadFeed);
document.getElementById('setting-icon-list-item').addEventListener('click', stopFeed);



//General Data/Atricles JavaScript
function loadDiscoveredArticles() {
  var url = '/api/automated';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      serverArticles = (JSON.parse(xhr.responseText));
      console.log(serverArticles.stackoverflow.length);
      // console.log(serverArticles);
      // console.log(serverArticles.stackoverflow);
    } else if (xhr.status === 404) {
      //Get error if no elements are in list
      // document.getElementById('search-results').innerHTML =
      // '<p>The RSS feed url that you have provided does not return valid \
      //   RSS style data.</p><p>Please check your url.</p>';
      console.log("Caught 404");
    } else {
      // document.getElementById('search-results').innerHTML =
      // 'Sorry, there was an error when fetching the Stack Overflow Data.';
      console.log("Error loading articles from server");
    }
  }
  xhr.send();
}

//Function to set update timer for the list
function setUpdateTimer() {
  loadDiscoveredArticles();
  timer = setInterval(refreshFeed, (seconds*1000));
}

//Function to change the width of the div which contains the 'next' and 'previous' buttons
function changeButtonWidth() {
  var feedSelectorWidth = document.getElementById('feed-selector-div').clientWidth;
  var pageSelectorDiv = document.getElementById('page-select');
  pageSelectorDiv.style.width = feedSelectorWidth + "px";
}

//Function to determine whether to show page buttons
function determinePageButtonShow(list) {
  var pageSelectorDiv = document.getElementById('page-select');
  if (list.length > amountOnPage && buttonsDisplayed === false) {
    pageSelectorDiv.style.display = "block";
    buttonsDisplayed = true;
    document.getElementById('previous-page').addEventListener('click', decrementPageNumber);
    document.getElementById('next-page').addEventListener('click', incrementPageNumber);
    document.getElementById('display-page-number').textContent = currentPage+1;
  } else if (list.lenth <= amountOnPage){
    console.log("else");
    pageSelectorDiv.style.display = "none";
    buttonsDisplayed = false;
    document.getElementById('previous-page').removeEventListener('click', decrementPageNumber);
    document.getElementById('next-page').removeEventListener('click', incrementPageNumber);
  }
}

//Functions to increase and decrease pageNumbers
function incrementPageNumber() {
  currentPage++;
  document.getElementById('display-page-number').textContent = currentPage+1;
  console.log(currentPage);
  refreshFeed();
}
function decrementPageNumber() {
  currentPage--;
  document.getElementById('display-page-number').textContent = currentPage+1;
  console.log(currentPage);
  refreshFeed();
}

//General function to clear class from all feed buttons for active-feed
function clearActiveClass() {
  document.getElementById('setting-icon-list-item').classList.remove('active-feed');
  document.getElementById('stack-overflow-button').classList.remove('active-feed');
  document.getElementById('google-forum-button').classList.remove('active-feed');
}


//Function to determine and load the correct feed
function loadFeed(e) {
  //Get ID of button that was clicked
  var id = e.target.id;
  //Clear active class for navigation
  clearActiveClass();
  //Add active class to active navigation button
  document.getElementById(id).classList.add('active-feed');
  //Check server for new articles
  loadDiscoveredArticles();
  //If statement to determine which feed is active
  if (id.includes("stack") && id.includes("overflow")) {
    activeFeed = "stackoverflow";
    loadStackOverflow();
  } else if (id.includes("google") && id.includes("forum")) {
    activeFeed = "googleforums";
    loadGoogleForums();
  }
}

function stopFeed() {
  clearInterval(timer);
}

//Function to refresh the currently loaded feed
function refreshFeed() {
  loadDiscoveredArticles();
  //If statement to determine which feed is active
  if (activeFeed === "stackoverflow") {
    loadStackOverflow();
  } else if (activeFeed === "googleforums") {
    loadGoogleForums();
  }
  console.log(serverArticles.stackoverflow.length);
}


//Stack Overflow specific
function loadStackOverflow(e) {
  // serverArticles = {"stackoverflow": [{'id':'The ID Of this thing', 'body': 'The Body Of This Thing', 'link': 'the link', 'tags': '[one, two, three]', 'title': 'The title of this'}]}
  //Get up-to-date article list from server
  var soList = serverArticles.stackoverflow;
  // console.log(serverArticles);
  // console.log(serverArticles.stackoverflow);

  var container = document.getElementById('search-results');
  container.innerHTML = '';

  if (soList.length <= 0) {
    container.innerHTML = "<p style='padding-top: 50px; color:#D2D4C8'> \
                            Oops! It seems that there are no articles available for Stack Overflow.</p>";
  } else {
    var amountInColumn = amountOnPage / amountOfColumns;
    //Round down for integer conversion
    //Article Hunter will display the closest amount of articles as the user has requested.
    amountInColumn = Math.floor(amountInColumn);
    var columnCounter = 0;
    var articleCounter = 0;
    var column = document.createElement('div');
    column.classList.add('col-4');
    var i=0;
    //Offset index for correct page display
    var index = i+(currentPage * amountOnPage);
    while (i<soList.length && index<soList.length) {
      var div = document.createElement('div');
      div.style.cssText = 'padding: 10px';

      var a = document.createElement('a');
      a.setAttribute('href', soList[index].link);
      a.setAttribute('target', 'blank');
      a.style.cssText = "text-decoration: none";


      var el = document.createElement('p');
      el.textContent = (index+1) + ": " + soList[index].title;
      el.style.cssText = "text-transform: capitalize; color: #D2D4C8";
      a.appendChild(el);

      el = document.createElement('p');
      el.textContent = "Tags: " + soList[index].tags.join(', ');
      el.style.cssText = 'font-size: 12px';
      a.appendChild(el);

      div.appendChild(a);
      articleCounter++;
      column.appendChild(div);
      if (articleCounter == amountInColumn) {
        columnCounter++;
        if (columnCounter == amountOfColumns) {
          break;
        }
        container.appendChild(column);
        column = document.createElement('div');
        column.classList.add('col-4');
        articleCounter = 0;
      }
      container.appendChild(column);
      i++;
      index ++;
    }
  }
  //If soList has more elements than the amount allowed on the page, show page buttons
  determinePageButtonShow(soList);
}


//Google Forums specific
function loadGoogleForums() {
  var container = document.getElementById('search-results');
  container.innerHTML = '';
}
