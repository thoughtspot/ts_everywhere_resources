/*
 * The completed script for the ThoughtSpot Everywhere tutorial.  Your solution should look similar.
 * It's recommended to refer to the documentation and Developer Playground to try to get it working before
 * using this file.
 */
import {
  init,
  Action,
  AppEmbed,
  AuthType,
  EmbedEvent,
  HostEvent,
  LiveboardEmbed,
  Page,
  RuntimeFilterOp,
  SearchEmbed,
} from './tsembed.es.js';
// } from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {getSearchData} from "./rest-api.js";
import {LiveboardContextActionData} from "./dataclasses.js";

// TODO - set the following for your URL.
const tsURL = "https://training.thoughtspot.cloud";

//------------------------------ Set up TS and authenticate and show app. ----------------------------

// Create and manage the login screen.
const onLogin = () => {
  // The following can be used if you want to use AuthType.Basic
  //const username = document.getElementById('username').value;
  //const password = document.getElementById('password').value;

  // TODO add the init() to set up the SDK interface.

  hideDiv('login');
  showMainApp();
}

// Shows the main app.
// This can be called from any page to make sure the state is correct.
const showMainApp = () => {
  showDiv('main-app');
}

//----------------------------------- Functions to embed content . -----------------------------------

const onSearch = () => {
  showMainApp();

  // TODO replace the following with a SearchEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Search not yet embedded.</p>";
}

const onLiveboard = () => {
  showMainApp();

  // TODO replace the following with a LiveboardEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Liveboard not yet embedded.</p>";
}

const onVisualization = () => {
  showMainApp();

  // TODO replace the following with a LiveboardEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Visualization not yet embedded.</p>";
}

// Embed the full application.
const onFull = () => {
  showMainApp();

  // TODO replace the following with an AppEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Full app not yet embedded.</p>";
}

// Embed a custom action.
const onCustomAction = () => {
  showMainApp();

  // TODO replace the following with an AppEmbed component for content linking and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Custom action not yet embedded.</p>";
}

// Updates the global filterValues array, then re-runs the embedLiveboard to reload the original Liveboard with the updated values in the runtimeFilters
const filterData = (embed, payload) => {
  const actionData = LiveboardContextActionData.createFromJSON(payload);
  const columnNameToFilter = actionData.columnNames[0];
  const filterValues = [];
  filterValues.push(actionData.data[columnNameToFilter][0]);

  embed.trigger(HostEvent.UpdateRuntimeFilters, [{
    columnName: columnNameToFilter,
    operator: RuntimeFilterOp.EQ,
    values: filterValues,
  }]);
}

//----------------------------------- Functions to manage the UI. -----------------------------------

// functions to show and hide parts of the UI.
const showDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'flex';
}

const hideDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'none';
}

// Clears the embedded section.
const clearEmbed = () => {
  const div = document.getElementById("embed");
  div.innerHTML = "";
}

//---------------------------- connect UI to code and start the app. ----------------------------

// Show the URL to connect to.
document.getElementById('ts-url').innerText = 'ThoughtSpot Server: ' + tsURL;

// Hook up the events to the buttons and links.
document.getElementById('login-button').addEventListener('click', onLogin);

// Events for nav bar
document.getElementById('search-link').addEventListener('click', onSearch);
document.getElementById('liveboard-link').addEventListener('click', onLiveboard);
document.getElementById('visualization-link').addEventListener('click', onVisualization);
document.getElementById('full-application-link').addEventListener('click', onFull);
document.getElementById('custom-action-link').addEventListener('click', onCustomAction);
