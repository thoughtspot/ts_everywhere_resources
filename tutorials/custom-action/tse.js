/** Logic for embedding and controlling the application. */
import {
  init,
  Action,
  AuthType,
  EmbedEvent,
  LiveboardEmbed,
  RuntimeFilterOp,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import { getSearchData } from "./rest-api.js";
import { LiveboardContextActionData } from "./dataclasses.js";

const tsURL = "https://training.thoughtspot.cloud";


/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  // TODO 1) Add code to initialize the connection to ThoughtSpot.

  showLiveboard();
}

/** Shows a visualization with a custom action. */
const showLiveboard = () => {

  // TODO 2) Add the visualization for the map.

  // TODO 3) Add handling for the custom action.

}

/** Used to show a pop-up of the given state's data. */
const showDetails = (payload) => {
  const liveboardContextData = LiveboardContextActionData.createFromJSON(payload);

  // Only gets the first column value.
  const filter = liveboardContextData.data[liveboardContextData.columnNames[0]];

  // TODO 4) Add code to embed the detail popup into the #modal-data-content with the runtime filter.

  // display the model box.
  const dataElement = document.getElementById('show-data');
  dataElement.style.display = 'block';
}


//---------------------- UI Function. ----------------------------------------

// Clears the embedded section.
const clearEmbed = () => {
  const div = document.getElementById("embed");
  div.innerHTML = "";
}

// closes the modal element when the close is selected.
const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}

//---------------------- Connect items and functions. ----------------------------------------

document.getElementById('close-modal').addEventListener('click', closeModal);

window.onload = loadApp;
