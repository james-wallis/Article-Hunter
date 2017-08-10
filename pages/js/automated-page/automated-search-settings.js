/**
 * JavaScript functions for the settings 'page'.
 * It is in a seperate document from the feeds on the same page for readability
 * Author: James Wallis
 */
'use strict'

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
 */
function clearActiveClass() {
  document.getElementById('setting-icon-list-item').classList.remove('active-feed');
  document.getElementById('stack-overflow-button').classList.remove('active-feed');
  document.getElementById('google-forum-button').classList.remove('active-feed');
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
  var divIDs = ['add-keyword', 'edit-keyword', 'delete-keyword', 'feed-sources', 'run-times', 'amount-to-display'];
  var index = 0;
  for (var i = 0; i < 2; i++) {
    var rowCont = document.createElement('div');
    rowCont.classList.add('col-12');
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
  populateSettings();
}

/**
 * Function to call all 6 functions that add forms onto the settings page.
 */
function populateSettings() {
  addKeywordForm();
  editKeywordForm();
  deleteKeywordForm();
  feedSourcesForm();
  runTimesForm();
  amountToDisplayForm();
}

/**
 * Function to add the 'add keyword' form to the settings page.
 */
function addKeywordForm() {
  var cont = document.getElementById('add-keyword');
  var title = document.createElement('h3');
  title.textContent = 'Add Keyword';
  cont.appendChild(title);

  //Create Form to submit a new Keyword
  var form = document.createElement('form');
  form.name = "add-keyword";
  form.method = "POST";
  form.action = "/#";

  var input = document.createElement('input');
  input.type = "text";
  input.name = "keyword";
  input.placeholder = "Enter Keyword";

  var submit = document.createElement('input');
  submit.type = "submit";
  submit.name = "submit-add-keyword";

  // form.appendChild(label);
  form.appendChild(input);
  form.appendChild(submit);
  cont.appendChild(form);

}

/**
 * Function to add the 'edit keyword' form to the settings page.
 * The select box will be filled using options from the server.
 * When the user selects a keyword to edit it will be put into the value
 *      of the input box.
 */
function editKeywordForm() {
  var cont = document.getElementById('edit-keyword');
  var title = document.createElement('h3');
  title.textContent = 'Edit Keyword';
  cont.appendChild(title);

  //Create Form to submit a new Keyword
  var form = document.createElement('form');
  form.name = "edit-keyword";
  form.method = "POST";
  form.action = "/#";

  var select = document.createElement('select');
  select.name = "edit";
  select.placeholder = "Enter Keyword";

  //Show all options
  for (var i = 0; i < 6; i++) {
    var option = document.createElement('option');
    option.value = "option"+i;
    option.textContent = "Option " + i;
    select.appendChild(option);
  }

  var input = document.createElement('input');
  input.type = "text";
  input.name = "edit-keyword";
  input.placeholder = "Keyword will appear here";

  var submit = document.createElement('input');
  submit.type = "submit";
  submit.name = "submit-edit-keyword";

  form.appendChild(select);
  form.appendChild(input);
  form.appendChild(submit);
  cont.appendChild(form);

}

/**
 * Function to add the 'delete keyword' form to the settings page.
 * The select box will be filled using options from the server.
 */
function deleteKeywordForm() {
  var cont = document.getElementById('delete-keyword');
  var title = document.createElement('h3');
  title.textContent = 'Delete Keyword';
  cont.appendChild(title);

  var form = document.createElement('form');
  form.name = "delete-keyword";
  form.method = "POST";
  form.action = "/#";

  var select = document.createElement('select');
  select.name = "delete";
  select.placeholder = "Delete Keyword";

  //Show all options
  for (var i = 0; i < 6; i++) {
    var option = document.createElement('option');
    option.value = "option"+i;
    option.textContent = "Option " + i;
    select.appendChild(option);
  }

  var submit = document.createElement('input');
  submit.type = "submit";
  submit.value = "Delete Keyword";
  submit.name = "submit-delete-keyword";

  form.appendChild(select);
  form.appendChild(submit);
  cont.appendChild(form);
}

/**
 * Function to add the feedSources form to the settings page.
 * The different sources will be added using items from the server.
 * After a user checks or unchecks an option it will be sent straight to the server.
 */
function feedSourcesForm() {
  var cont = document.getElementById('feed-sources');
  var title = document.createElement('h3');
  title.textContent = 'Feed Sources';
  cont.appendChild(title);

  //Create Form to submit a new Keyword
  var form = document.createElement('form');
  form.name = "change-sources";
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
  var title = document.createElement('h3');
  title.textContent = 'Run Times';
  cont.appendChild(title);
}

/**
 * Function to add the input of amount of items to display on a single page.
 *    It also adds the input for amount of columns on each page.
 * This will be sent to the server as soon as it is changed. (No submit).
 */
function amountToDisplayForm() {
  var cont = document.getElementById('amount-to-display');
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
