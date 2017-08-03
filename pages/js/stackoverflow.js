'use strict'
// window.addEventListener("load", runTenTimes);
window.addEventListener("load", getStack);


function runTenTimes() {
  var pageNumber, url;
  var firstHalf = 'https://api.stackexchange.com/2.2/questions?pagesize=';
  var secondHalf = '&order=desc&sort=creation&site=stackoverflow&filter=withbody';
  for (var i = 1; i < 11; i++) {
    pageNumber = i.toString();
    url = firstHalf + pageNumber + secondHalf;
    console.log(url);
    getStack(url);
  }
}

function getStack() {
  // var url = 'https://api.stackexchange.com/2.2/search?fromdate=1456876800&todate=1501718400&order\
  //           =asc&sort=activity&site=stackoverflow&filter=withbody';
    var  url = 'https://api.stackexchange.com/2.2/questions?pagesize=100&order=desc&sort=creation&site=stackoverflow&filter=withbody';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      // console.log((JSON.parse(xhr.responseText)));
      // console.log((JSON.parse(xhr.responseText)).items[0].title);
      // console.log((JSON.parse(xhr.responseText)).items[0].question_id);
      // console.log((JSON.parse(xhr.responseText)).items[0].body);
      // console.log((JSON.parse(xhr.responseText)).items[0].tags);
      // console.log((JSON.parse(xhr.responseText)).items[0].link);
      //
      // console.log((((JSON.parse(xhr.responseText)).items[0].body).indexOf("parrallelize")) > -1);
      printSlackToPage((JSON.parse(xhr.responseText)).items)
    } else {
      console.log("Error getting stack overflow data");
    }
  }
  xhr.send();
}

function checkForKeywords(item) {
  // var word = "java";
  var wordArr = ["java", "swift", "javascript", "ibm"];
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
      console.log(newJson);
      return newJson;
    }
  }
  return null;
}

function printSlackToPage(arr) {
  var sortedList = [];
  for (var i = 0; i < arr.length; i++) {
    var item = checkForKeywords(arr[i]);
    if (item != null) {
      sortedList.push(item);
    }
  }
  console.log(sortedList);
  var div = document.getElementById("search-results");
  if (sortedList.length > 0) {
    for (var i = 0; i < sortedList.length; i++) {
      var cont = document.createElement('div');
      cont.style.cssText = 'padding: 10px';

      var a = document.createElement('a');
      a.setAttribute('href', sortedList[i].link);
      a.setAttribute('target', 'blank');
      a.style.cssText = "text-decoration: none";


      var el = document.createElement('p');
      el.textContent = sortedList[i].title;
      el.style.cssText = "text-transform: capitalize; color: #D2D4C8";
      a.appendChild(el);

      el = document.createElement('p');
      el.textContent = "Tags: " + sortedList[i].tags.join(', ');
      el.style.cssText = 'font-size: 12px';
      a.appendChild(el);

      cont.appendChild(a);
      div.appendChild(cont);
    }
  } else {
    var el = document.createElement('p');
    el.textContent = "Nothing found on Stack Overflow using your keywords.";
    div.appendChild(el);
  }
}
