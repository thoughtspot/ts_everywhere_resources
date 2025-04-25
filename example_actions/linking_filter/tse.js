/*
This example shows how to implement content linking in liveboards.
This is accomplished by creating a context filter and then using the selected value to refresh the liveboard.
*/

// Add additional imports as needed.
import {
  init,
  AuthType,
  EmbedEvent,
  LiveboardEmbed,
  RuntimeFilterOp,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import { PinboardContextActionData } from "../../apis/dataclasses.js";

const tsURL = "https://try.thoughtspot.cloud/";  // Set to the URL for your system.

const embed = () => {
  tsInit();
  embedPinboard();
}

const tsInit = () => {
  
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None, // In production, use appropriate AuthType for your SSO method
  });
}

let columnNameToFilter = ''; // Global value for the column name that will be used to filter
let filterValues = [''];  // Global array of filterValues, used in the runtimeFilters when the Pinboard is rendered. Starts blank so no filter is applied

// Function to handle the payload response from the Custom Action 
// Updates the global filterValues array, then re-runs the embedPinboard to reload the original Pinboard with the updated values in the runtimeFilters
const filterData = (payload) => {
  const actionData = PinboardContextActionData.createFromJSON(payload);
  columnNameToFilter = actionData.columnNames[0];
  filterValues = [];
  filterValues.push(actionData.data[columnNameToFilter][0]);
  embedPinboard();
}

const embedPinboard = () => {

  // Sample embed.  The pinboardId GUID needs to exist in your system.
  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    pinboardId: "b22eabd5-6fa5-4342-847e-ca2abd5d54cc",
    runtimeFilters: [{
      columnName: columnNameToFilter, // eg: color
      operator: RuntimeFilterOp.EQ,
      values: filterValues // eg: red
    }],
  });

  embed
  .on(EmbedEvent.CustomAction, (payload) => {
    // The id is defined when creating the Custom Action in ThoughtSpot. Checking id attribute allows correct routing of multiple Custom Actions
    if (payload.id === 'filter') {
      filterData(payload);
    }
  })
  .render();

}

document.getElementById('thoughtspot-server').innerHTML = `ThoughtSpot Server: ${tsURL}`;

window.onload = embed;
