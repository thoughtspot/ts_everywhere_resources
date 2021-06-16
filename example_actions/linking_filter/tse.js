// Add additional imports as needed.
const {
  init,
  AuthType,
  EmbedEvent,
  PinboardEmbed,
  RuntimeFilterOp,
} = tsembed;

import { PinboardContextActionData } from "./dataclasses.js";

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

let columnNameToFilter = ''; // Fill in with the column name you want the values retrieved from and filtered on
let filterValues = [''];  // Global array of filterValues, used in the runtimeFilters when the Pinboard is rendered. Starts blank so no filter is applied

// Function to handle the payload response from the Custom Action 
// Updates the global filterValues array, then re-runs the embedPinboard to reload the original Pinboard with the updated values in the runtimeFilters
const filterData = (payload) => {
  const actionData = PinboardContextActionData.createFromJSON(payload);
  columnName = actionData.columnNames[0];
  filterValues = [];
  filterValues.push(actionData.data[columnNametoFilter][0]);
  embedPinboard();
}

const embedPinboard = () => {

  // Sample embed.  The pinboardId GUID needs to exist in your system.
  const embed = new PinboardEmbed("#embed", {
    frameParams: {},
     pinboardId: "b22eabd5-6fa5-4342-847e-ca2abd5d54cc", // Replace with the GUID of a Pinboard in your instance
     runtimeFilters: [{
          columnName: columnNametoFilter, // eg: color
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

window.onload = embed;
