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
 *    keywordList:      The list of keywords used as the keyword selector.
 *    showAll:          A Boolean variable which if true will show all keywords.
 *    currentKeyword:   If this is set and showAll is false, the only results on
 *                      the automated search page will be found using the specified
 *                      keyword.
 *    lastListNumber:   The list index of the last element printed to the page.
 */
var serverArticles = {};
var amountOnPage = 21;
var amountOfColumns = 3;
var currentPage = 1;
var activeFeed = null;
var keywordList = [];
var showAll = true;
var currentKeyword = '';
var lastListNumber = '';


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
 *    - showGoogleForums  when the user selects to see the google forum results,
 *                        this function is run and it displays each element in the
 *                        google forum array (serverArticles.googleforums)
 */
window.addEventListener('load', loadDiscoveredArticles);
window.addEventListener('load', changeButtonWidth);
window.addEventListener('resize', changeButtonWidth);
document.getElementById('stack-overflow-button').addEventListener('click', showStackOverflow);
document.getElementById('google-forum-button').addEventListener('click', showGoogleForums);
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
  socket.on('keywordList', function(list) {
    keywordList = list;
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
    //Create keyword selector div
    createKeywordSelector(container);
    var amountInColumn = amountOnPage / amountOfColumns;
    //Round down for integer conversion
    //Article Hunter will display the closest amount of articles as the user has requested.
    amountInColumn = Math.floor(amountInColumn);
    var columnCounter = 0;
    var articleCounter = 0;
    var column = document.createElement('div');
    column.classList.add('col-4');
    var i=0;
    //Offset index for correct page display when displaying all

    //
    //
    //
    // START BY FIXING PAGE CHANGING WHEN SHOWING SPECIFIC KEYWORDS
    //
    //
    //

    var index = i+((currentPage-1) * amountOnPage);
    if (currentPage > 1 && currentKeyword != '') {
      console.log('l');
      index = lastListNumber;
    }
    while (i<soList.length && index<soList.length) {
      if (soList[i].keyword == currentKeyword || showAll) {
        var div = document.createElement('div');
        div.style.cssText = 'padding: 10px';

        var a = document.createElement('a');
        a.setAttribute('href', soList[index].link);
        a.setAttribute('target', 'blank');
        a.style.cssText = "text-decoration: none";

        var el = document.createElement('p');
        el.textContent = (index+1) + ": " + soList[index].title + " --- " + soList[i].title;
        el.style.cssText = "text-transform: capitalize; color: #D2D4C8";
        a.appendChild(el);

        el = document.createElement('p');
        el.textContent = "Tags: " + soList[index].tags.join(', ');
        el.style.cssText = 'font-size: 12px';
        a.appendChild(el);

        el = document.createElement('p');
        el.textContent = "Matched: " + soList[index].keyword;
        el.style.cssText = "text-transform: capitalize; font-size: 12px";
        a.appendChild(el);

        div.appendChild(a);
        articleCounter++;
        column.appendChild(div);
        if (articleCounter == amountInColumn) {
          columnCounter++;
          if (columnCounter == amountOfColumns) {
            lastListNumber = index;
            break;
          }
          container.appendChild(column);
          column = document.createElement('div');
          column.classList.add('col-4');
          articleCounter = 0;
        }
        container.appendChild(column);
      }
      i++;
      index++;
    }
  }
  //If soList has more elements than the amount allowed on the page, show page buttons
  determinePageButtonShow();
}

/**
 * Function to display all the elements in the google forums array on the page
 */
function showGoogleForums(e) {
  clearActive();
  //Set stack-overflow as active
  activeFeed = 'googleforum';
  document.getElementById('google-forum-button').classList.add('active-feed');
  var googleList = serverArticles.googleforums;
  var container = document.getElementById('search-results');
  container.innerHTML = '';
  if (googleList.length <= 0) {
    container.innerHTML = "<p style='padding-top: 50px; color:#D2D4C8'> \
                            Oops! It seems that there are no articles available for Google Forums.</p>";
  } else {
    //Create keyword selector div
    createKeywordSelector(container);
    var amountInColumn = amountOnPage / amountOfColumns;
    //Round down for integer conversion
    //Article Hunter will display the closest amount of articles as the user has requested.
    amountInColumn = Math.floor(amountInColumn);
    var columnCounter = 0;
    var articleCounter = 0;
    var column = document.createElement('div');
    column.classList.add('col-4');
    var i=0;

    var index = i+((currentPage-1) * amountOnPage);
    if (currentPage > 1 && currentKeyword != '') {
      index = lastListNumber;
    }
    while (i<googleList.length && index<googleList.length) {
      if (googleList[i].keyword == currentKeyword || showAll) {
        var div = document.createElement('div');
        div.style.cssText = 'padding: 10px';

        var a = document.createElement('a');
        a.setAttribute('href', googleList[index].link);
        a.setAttribute('target', 'blank');
        a.style.cssText = "text-decoration: none";

        var el = document.createElement('p');
        el.textContent = (index+1) + ": " + googleList[index].title;
        el.style.cssText = "text-transform: capitalize; color: #D2D4C8";
        a.appendChild(el);

        el = document.createElement('p');
        el.textContent = "Matched: " + googleList[index].keyword;
        el.style.cssText = "text-transform: capitalize; font-size: 12px";
        a.appendChild(el);

        div.appendChild(a);
        articleCounter++;
        column.appendChild(div);
        if (articleCounter == amountInColumn) {
          columnCounter++;
          if (columnCounter == amountOfColumns) {
            lastListNumber = index;
            break;
          }
          container.appendChild(column);
          column = document.createElement('div');
          column.classList.add('col-4');
          articleCounter = 0;
        }
        container.appendChild(column);
      }
      i++;
      index++;
    }
  }
  //If googleList has more elements than the amount allowed on the page, show page buttons
  determinePageButtonShow();
}

/**
 * Function to refresh the active feed
 */
function refreshFeed() {
  console.log('refresh');
  if (activeFeed === "stackoverflow") {
    console.log('stack refresh');
    showStackOverflow();
  } else if (activeFeed === "googleforum") {
    showGoogleForums();
  }
}

/**
 * Function to add the keyword selector to the page in order to enable the
 * ability to only see results which matched a particular keyword.
 */
function createKeywordSelector(cont) {
  var keywordSelect = document.createElement('div');
  keywordSelect.classList.add('col-12');
  keywordSelect.style.padding = '5px 0px';

  var ul = document.createElement('ul');

  var li = document.createElement('li');
  li.classList.add('keyword-select');
  li.id = 'all';
  li.textContent = 'all';
  ul.appendChild(li);

  var arr = keywordList;
  for (var i = 0; i < arr.length; i++) {
    li = document.createElement('li');
    li.classList.add('keyword-select');
    li.id = arr[i];
    li.textContent = arr[i];
    ul.appendChild(li);
  }
  keywordSelect.appendChild(ul);
  cont.appendChild(keywordSelect);

  //Add Event Listeners
  document.getElementById('all').addEventListener('click', function() {
    showAll = true;
    currentKeyword = '';
    console.log(currentKeyword);
    lastListNumber = '';
    refreshFeed();
  });
  for (var i = 0; i < arr.length; i++) {
    document.getElementById(arr[i]).addEventListener('click', function() {
      currentKeyword =  this.id;
      showAll = false;
      console.log(currentKeyword);
      lastListNumber = '';
      refreshFeed();
    });
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
  } else if (activeFeed === 'googleforum') {
    list = serverArticles.googleforums;
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
