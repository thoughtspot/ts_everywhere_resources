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

import { GetAnswerData, tabularDataToHTML } from './dataclasses.js';

const tsURL = "https://xxx.thoughtspot.cloud/";  // Set to the URL for your system.

/**
 * Runs the embed steps.  This function is called automatically when the window is loaded.
 */
const embed = () => {
  tsInit();
  embedSearch();
}

/**
 * Initializes the connection to ThoughtSpot.  Default is to use no authentication.
 */
const tsInit = () => {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.Basic,
    username: "some.user",
    password: "secret+password",
  });
}

/**
 * Embed search
 */
const embedSearch = () => {
  const embed = new SearchEmbed("#embed", {
    collapseDataSources: true,
    dataSources: ["cd252e5c-b552-49a8-821d-3eadaa049cca"],  // use correct GUID for a worksheet.
    searchOptions: {
      searchTokenString: '[sales] [item type] [product]',   // (optional) use a valid search.
      executeSearch: true,
    },
  });

  embed
  .on(EmbedEvent.CustomAction, async(payload)=> {
    showData(payload);
  })
  .render();
}

async function showData (payload) {
    const offset = 0;
    const batchSize = -1;

    const fetchAnswerData = await payload.answerService.fetchData(offset, batchSize);
    const answerData = GetAnswerData.createFromJSON(fetchAnswerData);
    console.log(answerData);

    const table = tabularDataToHTML(answerData);
    document.getElementById("modal-data-content").innerHTML = table;
    document.getElementById("show-data").style.display = "block";
}

const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}

document.getElementById('thoughtspot-server').innerHTML = `ThoughtSpot Server: ${tsURL}`;
document.getElementById('close-modal').addEventListener('click', closeModal);

window.onload = embed;