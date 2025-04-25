/**
 * Embeds a saved answer that has a custom action to show more data in the context menu.
 */

// Add additional imports as needed.
import {
  init,
  AuthType,
  EmbedEvent,
  LiveboardEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {
  closeModal,
  showPayload
} from "./custom-actions.js";

// const tsURL = "https://try.thoughtspot.cloud/";  // Set to the URL for your system.
const tsURL = "https://embed-1-do-not-delete.thoughtspotdev.cloud/";

/**
 * Runs the embed steps.  This function is called automatically when the window is loaded.
 * To use, simply uncomment the function you want to include.  Note that only one can be called at a time since they
 * all are displayed in the #embed DOM object.
 */
const embed = () => {
  tsInit();
  embedViz();
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
 * Embeds the pinboard visualization that will have the action to show more details.
 */
const embedViz = () => {

  const embed = new LiveboardEmbed("#embed", {
    frameParams: {height: "70vw", width: "95vw"},
     pinboardId: "32f36678-025d-4c30-80de-0b47f344d688",
     //vizId: "9ccd4a61-1376-4813-87d3-ea0f70bbd242",
    vizId: "579d74ed-41ba-4b3f-bfa2-04becaec8e6e",
  });

  embed
  .on(EmbedEvent.VizPointDoubleClick, payload => {
      cosole.log(payload);
  })
  .on(EmbedEvent.CustomAction, payload => {
    if (payload.id === 'show-more') {
      showPayload(payload)
    }
  })
  .render();
}

document.getElementById('close-modal').addEventListener('click', closeModal);

window.onload = embed;