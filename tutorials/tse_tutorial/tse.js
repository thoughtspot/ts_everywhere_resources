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
// } from './tsembed.es.js';
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {LiveboardContextActionData} from "./dataclasses.js";

// TODO - set the following for your URL.
const tsURL = "https://training.thoughtspot.cloud";

//------------------------------ Set up TS and authenticate and show app. ----------------------------

// Create and manage the login screen.
const onLogin = () => {
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

// Embed with a custom action.
const onCustomAction = () => {
  showMainApp();

  // TODO replace the following with an AppEmbed component for showing a popup.
  document.getElementById("embed").innerHTML = "<p class='warning'>Custom action not yet embedded.</p>";
}

// Show a pop-up with the product sales for the state selected.
const showDetails = (payload) => {
  const pinboardContextData = LiveboardContextActionData.createFromJSON(payload);

  // Only gets the first column value.
  const filter = pinboardContextData.data[pinboardContextData.columnNames[0]];

  // Now show the details with the filter applied in a popup.
  // TODO - add the code to show the popup with the runtime filter.

  // display the model box.
  const detailsElement = document.getElementById('show-data');
  detailsElement.style.display = 'block';
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

//---------------------------- Controls for the modal popup ----------------------------

const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}

document.getElementById('close-modal').addEventListener('click', closeModal);

