/**
 * JavaScript functions for the settings 'page'.
 * It is in a seperate document from the feeds on the same page for readability
 * Author: James Wallis
 */
'use strict'
/**
 * Global Variables
 *    keywordList:    The list of keywords which is used when editing
 *                    or deleting a keyword.
 *    successColour:  The colour that text will be in a success message.
 *    errorColour:    The colour text will be in an error message.
 *    googleFeeds:    The feeds that are being used for the google forums page.
 */
var keywordList = [];
var successColour = '#ACFFA1';
var errorColour = '#FF6262';
var googleFeeds;
/**
 * Event Listeners
 * On Click:
 *      - showSettings  This function will run when the setting icon is clicked on
 *                      the main side bar in the automated search page. It runs the
 *                      function which is responsible for dynamically creating the
 *                      content for the setings page.
 * Mouse Over:
 *      - rotateCog     This function rotates the cog which represents settings in
 *                      the sidebar. (Styling purpose only)
 * Mouse Leave:
 *      - unrotateCog   This function rotates the settings cog in the opposite
 *                      direction to the rotateCog function. (Styling purpose only)
 *
 */
document.getElementById('setting-icon-list-item').addEventListener('click', showSettings);
document.getElementById('setting-icon-list-item').addEventListener('mouseover', rotateCog);
document.getElementById('setting-icon-list-item').addEventListener('mouseleave', unrotateCog);

/**
 * Socket.IO Listeners
 *
 */
socket.on('keywordList', displayKeywords);
socket.on('googleForumFeeds', function(list) {
  googleFeeds = list;
  var currentFeeds = document.getElementById('show-google-feed');
  console.log(currentFeeds);
  if (currentFeeds != null) {
    showGoogleFeed();
    console.log('not null');
  }
  console.log(list);
});

/**
 * Function to rotate the settings cog in the sidebar.
 * Run on mouseOver.
 */
function rotateCog() {
  var cog = document.getElementById('setting-icon');
  cog.style.transform = "rotate(90deg) scale(1.2)";
}

/**
 * Function to rotate the settings cog in the sidebar.
 * Run on mouseLeave.
 */
function unrotateCog() {
  var cog = document.getElementById('setting-icon');
  cog.style.transform = "";
}

/**
 * Function to clear the 'active-feed' class from each of the menu items
 *    in the side bar.
 * Also sets activeFeed variable from automated-search.js to false.
 *      This stops the feeds being refreshed and loaded into the
 *      search-results div.
 */
function clearActiveClass() {
  document.getElementById('setting-icon-list-item').classList.remove('active-feed');
  document.getElementById('stack-overflow-button').classList.remove('active-feed');
  document.getElementById('google-forum-button').classList.remove('active-feed');
  activeFeed = null;
}

/**
 * Function to display the current keywordList in the sidebar.
 */
function displayKeywords(list) {
  keywordList = list;
  var cont = document.getElementById('keyword-div');
  cont.textContent = '';
  var title = document.createElement('h3');
  title.textContent = "Current Keywords";
  cont.appendChild(title);
  for (var i = 0; i < list.length; i++) {
    var p = document.createElement('p');
    p.textContent = list[i];
    cont.appendChild(p);
  }
}

/**
 * Function to create the settings page.
 * Creates divs and other elements which function as the settings page.
 * Runs populateSettings so that the forms are shown on the settings page.
 */
function showSettings() {
  clearActiveClass();
  document.getElementById('setting-icon-list-item').classList.add('active-feed');
  var container = document.getElementById('search-results');
  container.innerHTML = '';

  var div = document.createElement('div');
  div.classList.add('col-12');

  var header = document.createElement('h2');
  header.textContent = "Automated Search Settings";
  header.style.color = "#D2D4C8";
  header.style.fontSize = "28px";
  div.appendChild(header);
  container.appendChild(div);

  //Create 6 divs for settings - each has an id
  var divIDs = ['add-keyword', 'edit-keyword', 'delete-keyword', 'change-sources', 'run-times', 'amount-to-display'];
  var index = 0;
  for (var i = 0; i < 2; i++) {
    var rowCont = document.createElement('div');
    rowCont.classList.add('col-12');
    rowCont.style.borderBottom ='1px solid #333';
    for (var j = 0; j < 3; j++) {
      div = document.createElement('div');
      div.classList.add('col-4');
      div.classList.add('automated-settings');
      div.id = divIDs[index];
      rowCont.appendChild(div);
      index++;
    }
    container.appendChild(rowCont);
  }

  var googleDiv = document.createElement('div');
  googleDiv.classList.add('col-12');
  googleDiv.classList.add('google-settings-page');

  var el = document.createElement('h3');
  el.textContent = "Google Forums Specific";
  googleDiv.appendChild(el);

  el = document.createElement('div');
  el.classList.add('col-4');
  el.classList.add('google-settings');
  el.id = 'show-google-feed';
  googleDiv.appendChild(el);

  el = document.createElement('div');
  el.classList.add('col-4');
  el.classList.add('google-settings');
  el.id = 'add-google-feed';
  googleDiv.appendChild(el);

  el = document.createElement('div');
  el.classList.add('col-4');
  el.classList.add('google-settings');
  el.id = 'remove-google-feed';
  googleDiv.appendChild(el);

  container.appendChild(googleDiv);

  populateSettings();
}

/**
 * Function to call all 6 functions that add forms onto the settings page.
 */
function populateSettings() {
  addKeywordForm();
  editKeywordForm();
  deleteKeywordForm();
  changeSourcesForm();
  runTimesForm();
  amountToDisplayForm();
  showGoogleFeed();
  addGoogleFeed();
  removeGoogleFeed();
}

/**
 * Function to add the 'add keyword' form to the settings page.
 */
function addKeywordForm() {
  var cont = document.getElementById('add-keyword');
  cont.innerHTML = "";
  var title = document.createElement('h3');
  title.textContent = 'Add Keyword';
  cont.appendChild(title);

  //Create Form to submit a new Keyword
  var form = document.createElement('form');
  form.name = "add-keyword";
  form.id = "add-keyword-form";
  form.method = "POST";
  form.action = "/#";

  var input = document.createElement('input');
  input.type = "text";
  input.name = "keyword";
  input.id = "add-keyword-form-keyword";
  input.placeholder = "Enter Keyword";

  var submit = document.createElement('input');
  submit.type = "submit";
  submit.name = "submit-add-keyword";

  var message = document.createElement('p');
  message.id = 'add-keyword-message';
  // form.appendChild(label);
  form.appendChild(input);
  form.appendChild(submit);
  cont.appendChild(form);
  cont.appendChild(message);

  //Add Event Listener to Form
  document.getElementById('add-keyword-form').addEventListener('submit', sendKeyword);
}

/**
 * Function to add the 'edit keyword' form to the settings page.
 * The select box will be filled using options from the server.
 * When the user selects a keyword to edit it will be put into the value
 *      of the input box.
 */
function editKeywordForm() {
  var currentKeywords = [];
  socket.on('keywordList', function(list){
    currentKeywords = list;
  });
  console.log(currentKeywords);
  var cont = document.getElementById('edit-keyword');
  cont.innerHTML = "";
  var title = document.createElement('h3');
  title.textContent = 'Edit Keyword';
  cont.appendChild(title);

  //Create Form to submit a new Keyword
  var form = document.createElement('form');
  form.name = "edit-keyword";
  form.id = "edit-keyword-form";
  form.method = "POST";
  form.action = "/#";

  var select = document.createElement('select');
  select.name = "edit";
  select.placeholder = "Enter Keyword";
  select.id = "edit-keyword-select";

  //Show all options
  var list  = keywordList;
  selectKeywordOptions(list, 'edit', select);

  var input = document.createElement('input');
  input.type = "text";
  input.name = "edit-keyword";
  input.placeholder = "Keyword will appear here";
  input.readOnly = true;
  input.id = "edit-keyword-input";

  var submit = document.createElement('input');
  submit.type = "submit";
  submit.name = "submit-edit-keyword";

  var message = document.createElement('p');
  message.id = 'edit-keyword-message';

  form.appendChild(select);
  form.appendChild(input);
  form.appendChild(submit);
  cont.appendChild(form);
  cont.appendChild(message);

  //Add Event Listeners
  document.getElementById('edit-keyword-select').addEventListener('change', updateEditInput);
  document.getElementById('edit-keyword-form').addEventListener('submit', editKeyword);

}

/**
 * Function to add the 'delete keyword' form to the settings page.
 * The select box will be filled using options from the server.
 */
function deleteKeywordForm() {
  var cont = document.getElementById('delete-keyword');
  cont.innerHTML = "";
  var title = document.createElement('h3');
  title.textContent = 'Delete Keyword';
  cont.appendChild(title);

  var form = document.createElement('form');
  form.name = "delete-keyword";
  form.id = 'delete-keyword-form';
  form.method = "POST";
  form.action = "/#";

  var select = document.createElement('select');
  select.name = "delete";
  select.placeholder = "Delete Keyword";
  select.id = "delete-keyword-select";

  var list  = keywordList;
  selectKeywordOptions(list, 'delete', select);

  var submit = document.createElement('input');
  submit.type = "submit";
  submit.value = "Delete Keyword";
  submit.name = "submit-delete-keyword";

  var message = document.createElement('p');
  message.id = 'delete-keyword-message';

  form.appendChild(select);
  form.appendChild(submit);
  cont.appendChild(form);
  cont.appendChild(message);

  //Event Listener for form submit
  document.getElementById('delete-keyword-form').addEventListener('submit', deleteKeyword);
}

/**
 * Function to populate the options within the two keyword select forms.
 * Used when the page is loaded to populate and then run again after a change
 *      occurs to the keywordList.
 */
 function selectKeywordOptions(list, task, select) {
   select.innerHTML = "";
   //Show all options
   var option = document.createElement('option');
   option.setAttribute("hidden", "");
   option.setAttribute("selected", "");
   option.setAttribute("disabled", "");
   option.textContent = "Select a Keyword";
   select.appendChild(option);
   //Loop through each unit
   list.forEach(function (item, index) {
     option = document.createElement('option');
     if (task === 'edit') {
       option.value = item;
     } else if (task === 'delete') {
       option.value = index;
     }
     option.textContent = item;
     select.appendChild(option);
   });
 }


/**
 * Function to add the feedSources form to the settings page.
 * The different sources will be added using items from the server.
 * After a user checks or unchecks an option it will be sent straight to the server.
 */
function changeSourcesForm() {
  var cont = document.getElementById('change-sources');
  cont.innerHTML = "";
  var title = document.createElement('h3');
  title.textContent = 'Feed Sources';
  cont.appendChild(title);

  //Create Form to submit a new Keyword
  var form = document.createElement('form');
  form.name = "change-sources";
  form.id = "change-source-form";
  form.method = "POST";
  form.action = "/#";

  var input = document.createElement('input');
  input.type = "checkbox";
  input.classList.add('checkbox');
  input.checked = true;
  input.name = "feedsToUse";
  input.value = "stack-overflow";

  var label = document.createElement('label');
  label.textContent = "Stack Overflow";
  label.for = "feedsToUse";

  form.appendChild(input);
  form.appendChild(label);
  cont.appendChild(form);
}

/**
 * Function to add the selection of times that the server will attempt to find
 *    articles to the page.
 * These times will be sent to the server as soon as the user has entered them.
 */
function runTimesForm() {
  var cont = document.getElementById('run-times');
  cont.innerHTML = "";
  var title = document.createElement('h3');
  title.textContent = 'Run Frequency';
  cont.appendChild(title);
}

/**
 * Function to add the input of amount of items to display on a single page.
 *    It also adds the input for amount of columns on each page.
 * This will be sent to the server as soon as it is changed. (No submit).
 */
function amountToDisplayForm() {
  var cont = document.getElementById('amount-to-display');
  cont.innerHTML = "";
  var title = document.createElement('h3');
  title.textContent = 'Layout of Articles';
  cont.appendChild(title);

  //Create Amount of Columns First
  var div = document.createElement('div');
  div.classList.add('display-input');

  var select = document.createElement('select');
  select.name = "columns";

  //Show all options
  for (var i = 1; i < 5; i++) {
    var option = document.createElement('option');
    option.value = i;
    if (i === 1) {
      option.textContent = i + " Column";
    } else {
      option.textContent = i + " Columns";
    }
    select.appendChild(option);
  }
  div.appendChild(select);
  cont.appendChild(div);

  //Create amount of elements on a page
  var div = document.createElement('div');
  div.classList.add('display-input');

  var select = document.createElement('select');
  select.name = "columns";

  //Show all options
  for (var i = 0; i < 5; i++) {
    var option = document.createElement('option');
    option.value = i*3;
    option.textContent = i*3;
    select.appendChild(option);
  }
  div.appendChild(select);
  cont.appendChild(div);
}

/**
 * Function to update the input in the edit keyword field
 */
 function updateEditInput() {
   var select = document.getElementById('edit-keyword-select');
   var input = document.getElementById('edit-keyword-input');
   input.readOnly = false;
   input.value = select.value;
 }

 function showGoogleFeed(list = googleFeeds) {
   console.log(list);
   var cont = document.getElementById('show-google-feed');
   cont.innerHTML = '';
   var el = document.createElement('h4');
   el.textContent = "Current Feeds";
   cont.appendChild(el);
   for (var i = 0; i < list.length; i++) {
     var p = document.createElement('p');
     p.textContent = list[i].title;
     cont.append(p);

     var a = document.createElement('a');
     a.textContent = googleFeeds[i].source;
     a.href = googleFeeds[i].source;
     cont.append(a);
   }
 }

 function addGoogleFeed() {
   var cont = document.getElementById('add-google-feed');
   var el = document.createElement('h4');
   el.textContent = "Add Feed";
   cont.appendChild(el);

   //Create Form to submit a new Keyword
   var form = document.createElement('form');
   form.name = "add-google-feed";
   form.id = "add-google-feed-form";
   form.method = "POST";
   form.action = "/#";

   var inputTitle = document.createElement('input');
   inputTitle.type = "text";
   inputTitle.name = "google-form-title";
   inputTitle.id = "add-google-feed-form-feed-title";
   inputTitle.placeholder = "Enter Title";

   var inputURL = document.createElement('input');
   inputURL.type = "text";
   inputURL.name = "google-form-url";
   inputURL.id = "add-google-feed-form-feed-url";
   inputURL.placeholder = "Enter URL";

   var submit = document.createElement('input');
   submit.type = "submit";
   submit.name = "submit-add-google-feed";

   var message = document.createElement('p');
   message.id = 'add-google-form-message';
   // form.appendChild(label);
   form.appendChild(inputTitle);
   form.appendChild(inputURL);
   form.appendChild(submit);
   cont.appendChild(form);
   cont.appendChild(message);

   //Stop form submit
   document.getElementById('add-google-feed-form').addEventListener('submit', sendGoogleForums);
 }

 function removeGoogleFeed() {
   var cont = document.getElementById('remove-google-feed');
   var el = document.createElement('h4');
   el.textContent = "Remove Feed";
   cont.appendChild(el);

   var form = document.createElement('form');
   form.name = "delete-google-feed";
   form.id = 'delete-google-feed-form';
   form.method = "POST";
   form.action = "/#";

   var select = document.createElement('select');
   select.name = "delete-google-feed";
   select.id = "delete-google-feed-select";

   var list  = googleFeeds;
   var titleList = [];
   for (var i = 0; i < list.length; i++) {
     titleList.push(list[i].title);
   }
   selectKeywordOptions(titleList, 'delete', select);

   var submit = document.createElement('input');
   submit.type = "submit";
   submit.value = "Delete Google Feed";
   submit.name = "submit-delete-google-feed";

   var message = document.createElement('p');
   message.id = 'delete-google-feed-message';

   form.appendChild(select);
   form.appendChild(submit);
   cont.appendChild(form);
   cont.appendChild(message);

   //Stop form submit
   document.getElementById('delete-google-feed-form').addEventListener('submit', deleteGoogleForums);
 }

//FUNCTIONS TO SEND FORMS TO SERVER
function sendKeyword(e) {
  var eventId = event.target.id;
  event.preventDefault();
  var newWord = document.getElementById('add-keyword-form-keyword').value;
  var message = document.getElementById('add-keyword-message');
  if (newWord != "" && newWord != null) {
    newWord = newWord.toLowerCase();
    if (!(keywordList.indexOf(newWord) >= 0)) {
      message.textContent = "Success! '" + newWord + "' added to the list of keywords.";
      message.style.color = successColour;
      socket.emit('addKeyword', newWord);
    } else if (keywordList.indexOf(newWord) >= 0){
      message.textContent = "Error: The keyword is already in the list.";
      message.style.color = errorColour;
    } else {
      message.textContent = "Error";
      message.style.color = errorColour;
    }
  } else {
    message.textContent = "Error: Keyword field is blank.";
    message.style.color = errorColour;
  }
}

function editKeyword(e) {
  var eventId = event.target.id;
  event.preventDefault();
  var message = document.getElementById('edit-keyword-message');
  var old = document.getElementById('edit-keyword-select').value;
  var edit = document.getElementById('edit-keyword-input').value;
  edit = edit.toLowerCase();
  console.log(edit);
  if (edit !== null && edit !== "" && old !== null && old !== "") {
    if (edit !== old) {
      var index = keywordList.indexOf(old);
      var json = {
        'index': index,
        'edit': edit
      }
      message.textContent = "Success! '" + old + "' has been replaced with '" +
                              edit + "' in the list of keywords.";
      message.style.color = successColour;
      var list = keywordList;
      list[index] = edit;
      var select = document.getElementById('edit-keyword-select');
      socket.emit('editKeyword', json);
      selectKeywordOptions(list, 'edit', select);
    } else {
      message.textContent = "Error: Old and New Keyword are the same.";
      message.style.color = errorColour;
    }
  } else {
    message.textContent = "Error: Keyword field is blank.";
    message.style.color = errorColour;
  }
}

function deleteKeyword(e) {
  var eventId = event.target.id;
  event.preventDefault();
  var message = document.getElementById('delete-keyword-message');
  var index = document.getElementById('delete-keyword-select').value;
  if (Number.isInteger(parseInt(index))) {
    message.textContent = "Success! The keyword has been removed from the list.";
    message.style.color = successColour;
    var list = keywordList;
    list.splice(index, 1);
    var select = document.getElementById('delete-keyword-select');
    socket.emit('deleteKeyword', index);
    selectKeywordOptions(list, 'delete', select);
  } else {
    message.textContent = "Error: Choose a keyword to delete.";
    message.style.color = errorColour;
  }
}

function sendGoogleForums(e) {
  var eventId = event.target.id;
  event.preventDefault();
  var newTitle = document.getElementById('add-google-feed-form-feed-title').value;
  var newSource = document.getElementById('add-google-feed-form-feed-url').value;
  var message = document.getElementById('add-google-form-message');
  if (newSource != "" && newSource != null) {
    // newSource = newSource.toLowerCase();
    var list  = googleFeeds;
    var sourceList = [];
    for (var i = 0; i < list.length; i++) {
      sourceList.push(list[i].source);
    }
    if (!(sourceList.indexOf(newSource) >= 0)) {
      message.textContent = "Success! '" + newSource + "' added to the list of Google Forums.";
      message.style.color = successColour;
      var json = {'title': newTitle, 'source': newSource};
      socket.emit('addGoogleForum', json);
    } else if (sourceList.indexOf(newSource) >= 0) {
      message.textContent = "Error: The forum is already in the list.";
      message.style.color = errorColour;
    } else {
      message.textContent = "Error";
      message.style.color = errorColour;
      console.log(sourceList.indexOf(newSource) >= 0);
      console.log(newSource);
    }
  } else {
    message.textContent = "Error: input field is blank.";
    message.style.color = errorColour;
  }
}

function deleteGoogleForums(e) {
  var eventId = event.target.id;
  event.preventDefault();
  var message = document.getElementById('delete-google-feed-message');
  var index = document.getElementById('delete-google-feed-select').value;
  if (Number.isInteger(parseInt(index))) {
    message.textContent = "Success! The Google Feed has been removed from the list.";
    message.style.color = successColour;
    var list = googleFeeds;
    var titleList = [];
    var returnList = {};
    for (var i = 0; i < list.length; i++) {
      titleList.push(list[i].title);
    }
    titleList.splice(index, 1);
    var select = document.getElementById('delete-google-feed-select');
    socket.emit('deleteGoogleFeed', index);
    selectKeywordOptions(titleList, 'delete', select);
  } else {
    message.textContent = "Error: Choose a Google Feed to delete.";
    message.style.color = errorColour;
  }
}
