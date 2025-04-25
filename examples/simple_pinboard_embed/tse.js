/*
 * This script provides an example of embedding a visualization.
 * Called as http(s)://server.com?pinboardid=<ID>&vizid=<ID>
 * Example: http://localhost:8000/?pinboardid=bf2b2c6d-d29d-49f3-814c-00a3c40e77b0&vizid=01c02cf4-4a54-45fc-a469-bccb899e9ae6
 */

const {
  init,
  PinboardEmbed,
  AuthType,
} = tsembed;

// URL to connect to.
const tsURL = "https://try.thoughtspot.cloud/"

const onLoad = () => {
  console.log("running the embed");
  // runs the script after the window has loaded.
  tsInit();
  const params = getParameters();
  tsEmbed(...params);
}

const tsInit = () => {
  // initialize the connection to ThoughtSpot.
  console.log(`initializing the connect to ${tsURL}`);
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
  });
}

const getParameters = () => {
  // Gets the parameters from the location.
  // Called as http(s)://server.com?pinboardid=<ID>&vizid=<ID>
  // Returns an array: [pinboardId, vizId];
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return [urlParams.get('pinboardid'), urlParams.get('vizid')];
}

const tsEmbed = (pinboardId, vizId) => {
  // Embeds the visualization.
  console.log(`Embedding pinboard ${pinboardId}, viz ${vizId}`);

  if (!pinboardId || pinboardId === "" || !vizId || vizId === "") {
    console.error("Pinboard and viz IDs must be provided.");
    return
  }

  const embed = new PinboardEmbed('#embed', {
    frameParams: {},
    pinboardId: pinboardId,
    vizId: vizId,
  });
  embed.render();
}

// Call the script.
window.onload = onLoad;