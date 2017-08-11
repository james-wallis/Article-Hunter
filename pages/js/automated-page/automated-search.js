'use strict'
/**
 * The JavaScript scripts which dictate how the automated search page is run on Article-Hunter.
 * Author: James Wallis
 */


/**
 * Global Variables
 *    serverArticles:   The list of articles that are loaded from the
 *                      server using socket.io.
 *    amountOnPage:     The amount of articles that are displayed on each page.
 *    amountOfColumns:  The amount of columns on a each page.
 *    currentPage:      The current page that the user is on.
 *    activeFeed:       The feed that is currently been displayed.
 */
var serverArticles = {};
var amountOnPage = 30;
var amountOfColumns = 3;
var currentPage = 1;
var activeFeed = null;


/**
 * Event Listeners
 * Onload:
 *    - loadDiscoveredArticles attatches the client to the server through socket.io.
 *    - changeButtonWidth modifies the button widths for next and previous so that they
 *                        dynamically fit the size of the side bar.
 * Resize:
 *    - changeButtonWidth modifies the button widths for next and previous when the
 *                        side bar size changes.
 * Onclick:
 *    - showStackOverflow when the user selects to see the stack overflow results
 *                        the function is run and it will display each element in the
 *                        stackoverflow array (serverArticles.stackoverflow)
 */
window.addEventListener('load', loadDiscoveredArticles);
window.addEventListener('load', changeButtonWidth);
window.addEventListener('resize', changeButtonWidth);
document.getElementById('stack-overflow-button').addEventListener('click', showStackOverflow);
document.getElementById('setting-icon-list-item');

/**
 * Function to load the discovered articles from the server.
 * Sets up the socket.io so that it is listening for articles when they are sent.
 * Articles are only sent from the server if the list length is changed.
 * If there are already articles being displayed on the page it will refresh these
 *    adding the new articles to the page.
 */
function loadDiscoveredArticles() {
  socket.on('articles', function(articles){
    serverArticles = articles;
    console.log("refresh");
    console.log(activeFeed);
    if (activeFeed != null) {
      refreshFeed();
    }
  });
}

//Stack Overflow specific
function showStackOverflow(e) {
  clearActive();
  //Set stack-overflow as active
  activeFeed = 'stackoverflow';
  document.getElementById('stack-overflow-button').classList.add('active-feed');
  var soList = serverArticles.stackoverflow;
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
    var index = i+((currentPage-1) * amountOnPage);
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
  determinePageButtonShow();
}


/**
 * Function to refresh the active feed
 */
function refreshFeed() {
  if (activeFeed = "stackoverflow") {
    showStackOverflow();
  }
}






/**
 * Function to clear the active feed when the user selects another.
 * Begins by ensuring that no other element has the active-feed class
 *      which is used to show the user which feed they are currently viewing.
 * Then sets the activeFeed variable to null so that it doesn't load anymore of
 *      the previous feed.
 */
function clearActive() {
  document.getElementById('setting-icon-list-item').classList.remove('active-feed');
  document.getElementById('stack-overflow-button').classList.remove('active-feed');
  document.getElementById('google-forum-button').classList.remove('active-feed');
  activeFeed = null;
}


/**
 * Function to change the width of the next and previous button's container
 * This helps to ensure that the UI displays correctly no matter the size or
 *    aspect ratio of the screen.
 */
function changeButtonWidth() {
  var feedSelectorWidth = document.getElementById('feed-selector-div').clientWidth;
  var pageSelectorDiv = document.getElementById('page-select');
  pageSelectorDiv.style.width = feedSelectorWidth + "px";
}

//Function to determine whether to show page buttons
function determinePageButtonShow() {
  var list;
  if (activeFeed === 'stackoverflow') {
    list = serverArticles.stackoverflow;
  }
  var pageSelectorDiv = document.getElementById('page-select');
  var nextPage = document.getElementById('next-page');
  var previousPage = document.getElementById('previous-page');
  if (list.length > amountOnPage) {
    pageSelectorDiv.style.display = "block";
    document.getElementById('display-page-number').textContent = currentPage;
    if (currentPage === 1) {
      nextPage.addEventListener('click', incrementPageNumber);
      nextPage.style.display = "inline";
      if (previousPage.style.display == "inline" || previousPage.style.display == "") {
        previousPage.style.display = "none";
      }
    } else if (list.length < (currentPage*amountOnPage)) {
      previousPage.addEventListener('click', decrementPageNumber);
      previousPage.style.display = "inline";
      if (nextPage.style.display == "inline" || nextPage.style.display == "") {
        nextPage.style.display = "none";
      }
    } else {
      nextPage.addEventListener('click', incrementPageNumber);
      previousPage.addEventListener('click', decrementPageNumber);
      nextPage.style.display = "inline";
      previousPage.style.display = "inline";
    }
  } else if (list.lenth <= amountOnPage){
    pageSelectorDiv.style.display = "none";
    nextPage.style.display = "none";
    previousPage.style.display = "none";
    previousPage.removeEventListener('click', decrementPageNumber);
    nextPage.removeEventListener('click', incrementPageNumber);
  }
}

//Functions to increase and decrease pageNumbers
function incrementPageNumber() {
  currentPage++;
  updatePage();
}
function decrementPageNumber() {
  currentPage--;
  updatePage();
}
function goToPage(number) {
  currentPage = number;
  updatePage();

}
function updatePage() {
  document.getElementById('display-page-number').textContent = currentPage;
  determinePageButtonShow();
  console.log(currentPage);
  refreshFeed();
}
