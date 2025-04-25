/*
 * This is the script to update for the ThoughtSpot Everywhere tutorial.
 */
import {ActionData, tabularDataToHTML} from "./dataclasses.js";

import {
  init,
  Action,
  AppEmbed,
  AuthType,
  EmbedEvent,
  Page,
  PinboardEmbed,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

// TODO - set the following for your URL.
const tsURL = "https://try.thoughtspot.cloud";

// functions to show and hide div sections.
const showDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'flex';
}

const hideDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'none';
}

const clearEmbed = () => {
  const div = document.getElementById("embed");
  div.innerHTML = "";
}

const closeModal = () => {
  const showDataElement = document.getElementById("show-data")
  showDataElement.style.display = "none";  // hide the box.
}

const showData = (payload) => {
  // TODO - add code to handle the custom action callback.
}

// Create and manage the login screen.

const onLogin = () => {
  // The following can be used if you want to use AuthType.Basic
  //const username = document.getElementById('username').value;
  //const password = document.getElementById('password').value;

  // TODO - add code to initialize the connection to ThoughtSpot

  hideDiv('login');
  showDiv('landing-page');
}

const showMainApp = () => {
  // Clears out the page and shows the main app.
  // This can be called from any page to make sure the state is correct.
  clearEmbed(); // just to be sure.
  hideDiv('landing-page');
  showDiv('main-app');
}

// Functions to embed the content based on user selection.

const onSearch = () => {
  showMainApp();

  // TODO replace the alert and return with the proper code to embed search.
  alert("Search not embedded");
}

const onLiveboard = () => {

  showMainApp();

  // TODO replace the alert with the proper embed a liveboard.
  alert("Liveboard not embedded");
}

const onVisualization = () => {
  showMainApp();

  // TODO replace the alert with the proper code to embed a visualization.
  alert("Visualization not embedded");
}

// Embed the full application.
const onFull = () => {
  showMainApp();

  // TODO replace the alert with the proper code the full application.
  alert("Full application not embedded");
}

export { onLogin, onFull, onSearch, onLiveboard, onVisualization };

// Show the URL to connect to.
document.getElementById('ts-url').innerText = 'ThoughtSpot Server: ' + tsURL;

// Hook up the events to the buttons and links.
document.getElementById('login-button').addEventListener('click', onLogin);
document.getElementById('close-modal').addEventListener('click', closeModal);

// Events for buttons
document.getElementById('search-button').addEventListener('click', onSearch);
document.getElementById('liveboard-button').addEventListener('click', onLiveboard);
document.getElementById('viz-button').addEventListener('click', onVisualization);
document.getElementById('full-app-button').addEventListener('click', onFull);

// Events for nav bar
document.getElementById('search-link').addEventListener('click', onSearch);
document.getElementById('liveboard-link').addEventListener('click', onLiveboard);
document.getElementById('visualization-link').addEventListener('click', onVisualization);
document.getElementById('full-application-link').addEventListener('click', onFull);
