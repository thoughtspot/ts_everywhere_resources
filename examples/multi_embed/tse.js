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
  LiveboardEmbed,
  AppEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

const tsURL = "https://try.thoughtspot.cloud/";  // Set to the URL for your system.

/**
 * Runs the embed steps.  This function is called automatically when the window is loaded.
 * To use, simply uncomment the function you want to include.  Note that only one can be called at a time since they
 * all are displayed in the #embed DOM object.
 */
const embed = () => {
  tsInit();
  //embedVisualizations();
  embedLiveboard();
}

const embedLiveboard = () => {

  const embed = new AppEmbed("#full-embed", {
    frameParams: {},
    path: "pinboard/d084c256-e284-4fc4-b80c-111cb606449a",
    disabledActions: [],
    disabledActionReason: "Reason for disabling",
    hiddenActions: [
      Action.Edit,
      Action.EditTitle,
    ],
  });
  embed.render();
}

/**
 * Initializes the connection to ThoughtSpot.  Default is to use no authentication.
 */
const tsInit = () => {
  // Update to reflect a different auth type (with parameters) if necessary.
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
    queueMultiRenders: true,
  });
}

const liveboardID = "d084c256-e284-4fc4-b80c-111cb606449a";
const visualizationIDs = [
  "856edeb8-2c86-4697-8bfb-c4dcee3a679a",
  "ea1baff4-e802-4c53-926f-b0b54534d86f",
  "8982ce51-8a55-417f-b7ab-9dbb1c4ab58a",
  "692d2047-0a5e-49aa-9a14-0e1c01d7ddc9",
];

/**
 * Embeds four visualizations.
 */
const embedVisualizations = () => {

  for (let idx = 0; idx < visualizationIDs.length; idx++) {
    console.log(`embedding ${visualizationIDs[idx]}`);
    const embed = new LiveboardEmbed(`#embed${idx}`, {
    frameParams: {},
      pinboardId: liveboardID,
      vizId: visualizationIDs[idx]
    });
    embed.render();
  }
}

document.getElementById('thoughtspot-server').innerText = `ThoughtSpot Server: ${tsURL}`;
window.onload = embed;