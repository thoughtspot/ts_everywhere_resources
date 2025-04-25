/*
 * The completed script for the ThoughtSpot Everywhere tutorial.  Your solution should look similar.
 * It's recommended to refer to the documentation and Developer Playground to try to get it working before
 * using this file.
 */
import {showDetails} from "./custom-actions.js";

import {
  init,
  Action,
  AppEmbed,
  AuthType,
  EmbedEvent,
  Page,
  LiveboardEmbed,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';
import {getSearchData} from "../rest-api";

// TODO - set the following for your URL.
const tsURL = "https://training.thoughtspot.cloud";

//------------------------------ Set up TS and authenticate and show app. ----------------------------

// Create and manage the login screen.
const onLogin = () => {
  // The following can be used if you want to use AuthType.Basic
  //const username = document.getElementById('username').value;
  //const password = document.getElementById('password').value;

  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
  });

  hideDiv('login');
  showDiv('landing-page');
}

const showMainApp = () => {
  // Clears out the page and shows the main app.
  // This can be called from any page to make sure the state is correct.
  clearEmbed(); // just to be sure.
  hideDiv('landing-page');
  showDiv('main-app');
}

//----------------------------------- Functions to embed content . -----------------------------------

const onSearch = () => {
  showMainApp();

  const embed = new SearchEmbed("#embed", {
    frameParams: {},
    collapseDataSources: true,
    disabledActions: [Action.Download, Action.DownloadAsCsv],
    disabledActionReason: "Enterprise feature",
    hiddenActions: [Action.Share],
    dataSources: ["1b1c237d-9de8-4542-bf1f-0c3157ddb8d2"],
    searchOptions: {
      searchTokenString: '[sales] [product type]',
      executeSearch: true,
    },
  });

  embed
    .on(EmbedEvent.CustomAction, payload => {  // shows the payload for any custom action.
        showPayload(payload);
    })
    .render();
}

const onLiveboard = () => {
  showMainApp();

  const embed = new LiveboardEmbed("#embed", {
      frameParams: {},
      pinboardId: "d084c256-e284-4fc4-b80c-111cb606449a",  // TODO - set to your liveboard ID.
      disabledActions: [Action.DownloadAsPdf],
      disabledActionReason: 'Enterprise feature.',
      hiddenActions: [Action.LiveboardInfo]
  });

  embed.render();
}

const onVisualization = () => {
  showMainApp();

  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardId: "9c3d26af-cf1b-4e89-aa42-f60d34983827",
    vizId: "9564b208-39b9-4349-9f06-3c989a9e1863",
  });

  embed.render();
}

// Embed the full application.
const onFull = () => {
  showMainApp();

  const embed = new AppEmbed('#embed', {
    frameParams: {},
    showPrimaryNavbar: false,  // set to true to show the ThoughtSpot navbar
    pageId: Page.Home, // loads the Home tab, but you can start on any main tab - try Page.Search
    disabledActions: [], // list of any actions you don't want the users to use, but still see
    disabledActionReason: 'No sharing allowed.', // tool tip the user will see
    hiddenActions: [] // totally hide a feature from a user
  });

  embed.render();
}

// Embed a custom action.
const onCustomAction = () => {
  showMainApp();

  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "8d2e93ad-cae8-4c8e-a364-e7966a69a41e",
    //visibleActions: ["show-details"],
    hiddenActions: [],
  });

  embed
    .on(EmbedEvent.CustomAction, payload => {
      if (payload.id === 'show-details') {
        showDetails(payload);
      }
    })
    .render();
}

// Embed an example of using the SearchData api and highcharts.
const onCustomChart = () => {
  showMainApp();

  const worksheetID = "1b1c237d-9de8-4542-bf1f-0c3157ddb8d2";  // GUID for Sample Retail - Apparel - Developer WS
  const search = "[sales] [product type] [product] top 15";

  getSearchData(tsURL, worksheetID, search).then(data => {
    console.log(data);

    // Get the indexes of the columns in the data.
    const salesIdx = data.columnNames.findIndex(v => v == 'Total Sales');
    const productTypeIdx = data.columnNames.findIndex(v => v == 'Product Type');
    const productIdx = data.columnNames.findIndex(v => v == 'Product');

    // convert the resulting data to the series for the HighChart.  Format is:
    // [
    //   { name: '<product type>', data: [{ name: <product>, value: <sales> }, ... ]}
    //   { name: '<product type>', data: [{ name: <product>, value: <sales> }, ... ]}
    // ]

    const series = {}
    for (const r of data.data) {
      const productType = r[productTypeIdx]
      if (! Object.keys(series).includes(productType)) {
        series[productType] = []
      }
      // Combines all the data items to the key for each series.
      series[productType].push({ name: r[productIdx], value: r[salesIdx]/1000});
    }

    // Now need to as the chart series.
    const chartSeries = []
    for (const productType of Object.keys(series)) {
      chartSeries.push({name: productType, data: series[productType]})
    }

    // Render the chart.
    Highcharts.chart('embed', {
      chart: {
        type: 'packedbubble'
        /* height: '80%'*/
      },
      title: {
        text: 'Sales of product by product type'
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> ${point.value:.1f}M</sub>'
      },
      plotOptions: {
        packedbubble: {
          minSize: '20%',
          maxSize: '40%',
          zMin: 0,
          zMax: 1000,
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 250
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        }
      },
      series: chartSeries
    });
  });

}

//----------------------------------- Functions to manage the UI. -----------------------------------

// functions to show and hide parts of the UI.
const showDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'flex';
}

const hideDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'none';
}

// Clears the embedded section.
const clearEmbed = () => {
  const div = document.getElementById("embed");
  div.innerHTML = "";
}

// closes the modal element when the close is selected.
const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}

//---------------------------- connect UI to code and start the app. ----------------------------

// Show the URL to connect to.
document.getElementById('ts-url').innerText = 'ThoughtSpot Server: ' + tsURL;

// Hook up the events to the buttons and links.
document.getElementById('login-button').addEventListener('click', onLogin);
document.getElementById('close-modal').addEventListener('click', closeModal);

// Events for buttons
document.getElementById('search-button').addEventListener('click', onSearch);
document.getElementById('liveboard-button').addEventListener('click', onLiveboard);
document.getElementById('viz-button').addEventListener('click', onVisualization);
document.getElementById('full-app-button').addEventListener('click', onFull);
document.getElementById('custom-chart-button').addEventListener('click', onCustomChart);

// Events for nav bar
document.getElementById('search-link').addEventListener('click', onSearch);
document.getElementById('liveboard-link').addEventListener('click', onLiveboard);
document.getElementById('visualization-link').addEventListener('click', onVisualization);
document.getElementById('full-application-link').addEventListener('click', onFull);
document.getElementById('custom-action-link').addEventListener('click', onCustomAction);
document.getElementById('custom-chart-link').addEventListener('click', onCustomChart);
