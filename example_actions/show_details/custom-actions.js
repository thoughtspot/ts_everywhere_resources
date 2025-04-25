/*
 * This script contains classes and functions for using custom actions.
 */
import {
  LiveboardContextActionData
} from "/apis/dataclasses.js";

import {
  LiveboardEmbed,
  RuntimeFilterOp,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

/**
 * Shows the payload as JSON.  This only works with context actions on liveboards.
 * @param payload The JSON payload to show.
 */
const showPayload = (payload) => {
  const liveboardContextData = LiveboardContextActionData.createFromJSON(payload);

  // Only gets the first column value.
  const filter = liveboardContextData.data[liveboardContextData.columnNames[0]];
  // Now show the details with the filter applied in a popup.
  const embed = new LiveboardEmbed("#embed-popup", {
    frameParams: { width: "80vw", height: "60vw" },
    disabledActions: [],
    disabledActionReason: "Reason for disabling",
    hiddenActions: [],
    pinboardId: "32f36678-025d-4c30-80de-0b47f344d688",
    vizId: "579d74ed-41ba-4b3f-bfa2-04becaec8e6e",
    runtimeFilters: [{
          columnName: 'state',
          operator: RuntimeFilterOp.EQ,
          values: [filter]
     }],
   });
  embed.render();

  // display the model box.
  const dataElement = document.getElementById('show-data');
  dataElement.style.display = 'block';
}

const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}

export { closeModal, showPayload }
