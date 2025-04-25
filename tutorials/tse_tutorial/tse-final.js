/*
 * The completed script for the ThoughtSpot Everywhere tutorial.  Your solution should look similar.
 * It's recommended to refer to the documentation and Developer Playground to try to get it working before
 * using this file.
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
  const data = payload.data;
  if (data.id === 'show-data') {
    // For either action, simply display the data as a table.
    const actionData = ActionData.createFromJSON(payload);
    
    const html = tabularDataToHTML(actionData);
    const dataContentElement = document.getElementById('modal-data-content');
    dataContentElement.innerHTML = html;

    const dataElement = document.getElementById('show-data');
    dataElement.style.display = 'block';
  }
  else {
    console.log(`Got unknown custom actions ${data.id}`);
  }
}

// Create and manage the login screen.

const onLogin = () => {
  // The following can be used if you want to use AuthType.Basic
  //const username = document.getElementById('username').value;
  //const password = document.getElementById('password').value;

  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
  });

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

  const embed = new SearchEmbed('#embed', {
    frameParams: {},
    collapseDataSources: false,
    hideResults: false,
    disabledActions: [Action.SpotIQAnalyze],
    disabledActionReason: 'Enterprise feature.',
    hiddenActions: [Action.Download, Action.Share, Action.DownloadAsCsv],
    hideDataSources: false,
  });

  embed
    .on(EmbedEvent.CustomAction, (payload) => {
        showData(payload);
    })
    .render();
}

const onLiveboard = () => {
  showMainApp();

  const embed = new PinboardEmbed("#embed", {
      frameParams: {},
      liveboardId: '2ba03345-d20f-4a10-9509-6e13bbb2e32a',  // TODO - set to your liveboard ID.
      disabledActions: [Action.DownloadAsPdf],
      disabledActionReason: 'Enterprise feature.',
      hiddenActions: [Action.LiveboardInfo]
  });

  embed.render();
}

const onVisualization = () => {
  showMainApp();

  const embed = new PinboardEmbed('#embed', {
    frameParams: {},
    liveboardId: '2ba03345-d20f-4a10-9509-6e13bbb2e32a',  // TODO - set to your liveboard ID.
    vizId: 'e2387c53-b83a-43be-84cd-ebb6292c216b',       // TODO - set to your visualization ID.
    disabledActions: [Action.Download],
    disabledActionReason: 'Enterprise feature.',
    hiddenActions: [Action.SpotIQAnalyze]
  });

  embed.render();
}

// Embed the full application.
const onFull = () => {
  showMainApp();

  const embed = new AppEmbed('#embed', {
    frameParams: {},
    showPrimaryNavbar: false,  // set to true to show the ThoughtSpot navbar
    pageId: Page.Home, // loads the Home tab, but you can start on any main tab - try Page.Search
    disabledActions: [], // list of any actions you don't want the users to use, but still see
    disabledActionReason: 'No sharing allowed.', // tool tip the user will see
    hiddenActions: [] // totally hide a feature from a user
  });

  embed.render();
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
