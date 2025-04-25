/**
 * Basic template to start for embedding examples and tests.
 * The easiest way to get started with the various components is to log into ThoughtSpot and go to the Develop tab.
 * You can then use the Playground to generate embed code that can be copied (with some modification).
 */

// Add additional imports as needed.
import {
  init,
  AuthType,
  PinboardEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

const tsURL = "https://try.thoughtspot.cloud/";  // Set to the URL for your system.

/**
 * Runs the embed steps.  This function is called automatically when the window is loaded.
 * To use, simply uncomment the function you want to include.  Note that only one can be called at a time since they
 * all are displayed in the #embed DOM object.
 */
const embed = () => {
  tsInit();
  embedPinboardViz();
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

let vizId = "7e242033-2db1-41e4-ae2c-dd1488019059";

/**
 * Shows the visualization.  The daily view is chosen by default.
 */
const embedPinboardViz = () => {
  const embed = new PinboardEmbed("#embed", {
    frameParams: { width:"100vw", height:"70vw" },
    pinboardId: "ff942c07-e1b6-4b5d-9d3b-51fac0cd7b8f",
    vizId: vizId,
  });

  embed.render();
}

/**
 * Gets the new, selected visualization and calls to update the visualization.
 */
const changeViz = () => {
  console.log('changing the visualization');
  vizId = document.getElementById('select-visualizations').value;
  embedPinboardViz();
}

document.getElementById('thoughtspot-server').innerHTML = `ThoughtSpot Server: ${tsURL}`;
document.getElementById('select-visualizations').onchange=changeViz;

window.onload = embed;