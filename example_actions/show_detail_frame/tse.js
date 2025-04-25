/**
 * Embeds a saved answer that has a custom action to show more data in the context menu.
 */

// Add additional imports as needed.
import {
  init,
  Action,
  AuthType,
  EmbedEvent,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {
  ContextActionData, SearchData, tabularDataToHTML
} from "./dataclasses.js";

import {getSearchData} from "./rest-api.js";

const tsURL = "https://training.thoughtspot.cloud/";  // Set to the URL for your system.
const wsGIUD = "1b1c237d-9de8-4542-bf1f-0c3157ddb8d2";

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

  const embed = new SearchEmbed("#embed", {
    frameParams: {},
    collapseDataSources: true,
    hiddenActions: [Action.SpotIQAnalyze, Action.Share],
    answerId: "34825e54-d303-4a2e-8c70-4745a442a2bc",
  });

  embed
  .on(EmbedEvent.CustomAction, payload => {
    if (payload.data.id === 'show-details') {
      showDetails(payload);
    }
  })
  .render();
}

const showDetails = (payload) => {
  const actionData = ContextActionData.createFromJSON(payload);

  // This takes advantage of the fact that we know the saved answer.  In a real scenario, we might want to introspect
  // the data to figure out the columns.  For now, we just watn to get the Product Type.
  const productType = actionData.data["Product Type"][0];

  const detailSearch = "[Region] [Store] [Sales] [Product] [Product Type] = '" + productType + "'";
  getSearchData(tsURL, wsGIUD, detailSearch).then(searchResults => {
      console.log(searchResults);
      const searchData = SearchData.createFromJSON(searchResults);

      const embedElement = document.getElementById("embed");
      embedElement.style.height = "60vh";

      const detailsElement = document.getElementById("details");
      detailsElement.innerHTML = tabularDataToHTML(searchData);
      detailsElement.style.display = "block";
    })
    .catch(error => {
      console.error(error);
    });
}

window.onload = embed;