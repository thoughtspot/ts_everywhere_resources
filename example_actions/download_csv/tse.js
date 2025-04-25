/*
This example shows how to embed use a custom action to download data as a CSV file.  This example only works with
main actions in Search and Answers.  It will not work in Context Actions or Liveboard Actions.
 */
// Add additional imports as needed.
import {
  init,
  AuthType,
  EmbedEvent,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

// You need to download dataclasses from the /api folder.
import { ActionData, tabularDataToCSV } from "../../apis/dataclasses.js";

const tsURL = "https://try.thoughtspot.cloud/";  // Set to the URL for your system.

const embed = () => {
  tsInit();
  embedSearch();
}

const tsInit = () => {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
  });
}

// Function to handle the payload response from the Custom Action
// Gets the data and converts to an ActionData object, then converts to CSV and downloads.
const downloadCSV = (payload) => {

  // Requires dataclasses.js from the /apis folder.
  const actionData = ActionData.createFromJSON(payload);
  const csv = tabularDataToCSV(actionData);

  const encodedUri = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "action_data.csv");
  document.body.appendChild(link); // Required for Firefox

  link.click(); // This will download the data file named "action_data.csv".
}

const embedSearch = () => {

  // Data sources GUID must be updated for your environment (or omitted).
  const embed = new SearchEmbed("#embed", {
    frameParams: {},
  });

  embed
  .on(EmbedEvent.CustomAction, (payload) => {
    // The id is defined when creating the Custom Action in ThoughtSpot.
    // Checking id attribute allows correct routing of multiple Custom Actions
    if (payload.data.id === 'download-csv') {
      downloadCSV(payload);
    }
  })
  .render();
}

document.getElementById('thoughtspot-server').innerHTML = `ThoughtSpot Server: ${tsURL}`;

window.onload = embed;