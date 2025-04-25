/*
 * This script contains classes and functions for using custom actions.
 */
import {
  PinboardContextActionData
} from "../../apis/dataclasses.js";

import {
  PinboardEmbed,
  RuntimeFilterOp,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

/**
 * Shows the payload as JSON.  This only works with context actions on pinboards.
 * @param payload The JSON payload to show.
 */
const showPayload = (payload) => {
  const pinboardContextData = PinboardContextActionData.createFromJSON(payload);

  // Only gets the first column value.
  const filter = pinboardContextData.data[pinboardContextData.columnNames[0]];
  // Now show the details with the filter applied in a popup.
  const embed = new PinboardEmbed("#embed-popup", {
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
