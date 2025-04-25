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
  LiveboardEmbed,
  Page,
  RuntimeFilterOp,
  SearchEmbed,
} from './tsembed.es.js';
// } from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {LiveboardContextActionData} from "./dataclasses.js";

// TODO - set the following for your URL.
const tsURL = "https://training.thoughtspot.cloud";

//------------------------------ Set up TS and authenticate and show app. ----------------------------

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
  showMainApp();
}

const showMainApp = () => {
  // Shows the main app.
  // This can be called from any page to make sure the state is correct.
  showDiv('main-app');
}

//----------------------------------- Functions to embed content . -----------------------------------

const onSearch = () => {
  showMainApp();

  const embed = new SearchEmbed("#embed", {
    frameParams: {},
    collapseDataSources: true,
    disabledActions: [Action.Download, Action.DownloadAsCsv],
    disabledActionReason: "Enterprise feature",
    hiddenActions: [Action.Share],
    dataSources: ["1b1c237d-9de8-4542-bf1f-0c3157ddb8d2"],
    searchOptions: {
      searchTokenString: '[sales] [product type]',
      executeSearch: true,
    },
  });

  embed
    .on(EmbedEvent.CustomAction, payload => {  // shows the payload for any custom action.
        showPayload(payload);
    })
    .render();
}

const onLiveboard = () => {
  showMainApp();

  const embed = new LiveboardEmbed("#embed", {
      frameParams: {},
      liveboardV2: true,
      liveboardId: "fda23eef-4edc-4a1a-884c-1570d2b3b079",  // TODO - set to your liveboard ID.
      disabledActions: [Action.DownloadAsPdf],
      disabledActionReason: 'Enterprise feature.',
      hiddenActions: [Action.LiveboardInfo]
  });

  embed.render();
}

const onVisualization = () => {
  showMainApp();

  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardV2: true,
    liveboardId: "fda23eef-4edc-4a1a-884c-1570d2b3b079",  // TODO - set to your liveboard ID.
    vizId: "dcbf0121-dc91-40ae-9a5c-e480d47eebfa",
  });

  embed.render();
}

// Embed the full application.
const onFull = () => {
  showMainApp();

  const embed = new AppEmbed('#embed', {
    frameParams: {},
    liveboardV2: false,
    showPrimaryNavbar: false,  // set to true to show the ThoughtSpot navbar
    pageId: Page.Home, // loads the Home tab, but you can start on any main tab - try Page.Search
    disabledActions: [], // list of any actions you don't want the users to use, but still see
    disabledActionReason: 'No sharing allowed.', // tool tip the user will see
    hiddenActions: [] // totally hide a feature from a user
  });

  embed.render();
}

// Embed with a custom action.
const onCustomAction = () => {
  showMainApp();

  const embed = new LiveboardEmbed("#embed", {
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "8d2e93ad-cae8-4c8e-a364-e7966a69a41e",
  });

  embed
    .on(EmbedEvent.CustomAction, payload => {
      if (payload.id === 'show-details' || payload.data.id === 'show-details') {
        showDetails(payload);
      }
    })
    .render();
}

// Show a pop-up with the product sales for the state selected.
const showDetails = (payload) => {
  const pinboardContextData = LiveboardContextActionData.createFromJSON(payload);

  // Only gets the first column value.
  const filter = pinboardContextData.data[pinboardContextData.columnNames[0]];

  // Now show the details with the filter applied in a popup.
  const popupEmbed = new LiveboardEmbed("#show-details", {
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "96db6db8-662a-45b5-bc70-00341d75846b",
    runtimeFilters: [{
      columnName: 'state',
      operator: RuntimeFilterOp.EQ,
      values: [filter]
    }],
  });
  popupEmbed.render();

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