/**
 * Basic template to start for embedding examples and tests.
 * The easiest way to get started with the various components is to log into ThoughtSpot and go to the Develop tab.
 * You can then use the Playground to generate embed code that can be copied (with some modification).
 */

// Add additional imports as needed.
import {
  init,
  Action,
  AuthType,
  EmbedEvent,
  LiveboardEmbed,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {
  closeModal,
  showPayload
} from "./custom-actions.js";

const tsURL = "https://try.thoughtspot.cloud/";  // Set to the URL for your system.

/**
 * Runs the embed steps.  This function is called automatically when the window is loaded.
 * To use, simply uncomment the function you want to include.  Note that only one can be called at a time since they
 * all are displayed in the #embed DOM object.
 */
const embed = () => {
  tsInit();
  embedSearch();
  //embedPinboard();
  //embedPinboardViz();
  //embedFull();
}

/**
 * Initializes the connection to ThoughtSpot.  Default is to use no authentication.
 */
const tsInit = () => {
  // Update to reflect a different auth type (with parameters) if necessary.
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
  });
}

/**
 * Basic search embed with no datasource or filters.
 */
const embedSearch = () => {
  const embed = new SearchEmbed("#embed", {
    frameParams: {}
  });

  console.log("rendering embed");
  embed
    .on(EmbedEvent.CustomAction, (payload) => {
       showPayload(payload);
    })
    .render();
}

/**
 * Add a LiveboardEmbed component and render.
 */
const embedLiveboard = () => {
  // Add pinboard embed here.
}

/**
 * Add a LiveboardEmbed component with a vizId and render.
 */
const embedPinboardViz = () => {
  // Add pinboard viz embed here.
}

/**
 * Embeds the full application.  Add a full embed component with flags and render.
 */
const embedFull = () => {
  // Add full embed here.
}

document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('thoughtspot-server').innerHTML = `ThoughtSpot Server: ${tsURL}`;

window.onload = embed;