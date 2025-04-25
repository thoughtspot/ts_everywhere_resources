/** Logic for embedding and controlling the application. */
import {
  init,
  Action,
  AuthType,
  EmbedEvent,
  LiveboardEmbed,
  RuntimeFilterOp,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import { getSearchData } from "./rest-api.js";
import { LiveboardContextActionData } from "./dataclasses.js";

// const tsURL = "https://try.thoughtspot.cloud";
const tsURL = "https://training.thoughtspot.cloud";


/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None
  });

  showLiveboard();
}

/** Shows a visualization with a custom action. */
const showLiveboard = () => {
  clearEmbed();

  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "8d2e93ad-cae8-4c8e-a364-e7966a69a41e",
    visibleActions: ['show-details'],
  });

  embed
    .on(EmbedEvent.CustomAction, payload => {
      if (payload.id === 'show-details') {
        showDetails(payload);
      }
    })
    .render();
}

/** Used to show a pop-up of the given state's data. */
const showDetails = (payload) => {
  const liveboardContextData = LiveboardContextActionData.createFromJSON(payload);

  // Only gets the first column value.
  const filter = liveboardContextData.data[liveboardContextData.columnNames[0]];
  // Now show the details with the filter applied in a popup.
  const embed = new LiveboardEmbed("#modal-data-content", {
    frameParams: {},
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "96db6db8-662a-45b5-bc70-00341d75846b",
    runtimeFilters: [{
          columnName: 'state',
          operator: RuntimeFilterOp.IN,
          values: filter
     }],
     visibleActions: [],
  });
  embed.render();

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
