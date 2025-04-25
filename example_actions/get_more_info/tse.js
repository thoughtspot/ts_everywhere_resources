/** Logic for embedding and controlling the application. */
import {
  init,
  AuthType,
  EmbedEvent,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {
  ActionData,
  SearchData
} from "../../apis/dataclasses.js";

import {
  getSearchData
} from "../../apis/rest-api.js";

// const tsURL = "https://try.thoughtspot.cloud";
const tsURL = "https://embed-1-do-not-delete.thoughtspotdev.cloud";
const wsGUID = "f4d3ec3a-c55e-49d0-be5b-4f09f7abe59b";

/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  init ({
    thoughtSpotHost: tsURL,
    authType: AuthType.None
  })

  onSearch();
}

/** Shows the search page. */
const onSearch = () => {
  const embed = new SearchEmbed("#embed", {
    frameParams: {},
    dataSources: [wsGUID],
        searchOptions: {
        searchTokenString: '[Account Balance] [Customer] [Last Contacted].detailed [Account Balance] > 500',
        executeSearch: true,
    },
  });

  embed
    .on(EmbedEvent.CustomAction, (payload) => {
      if (payload.data.id === 'send-email') {
        sendEmail(payload);
      }
    })
    .render();
}

/** send the email from the callback */
const sendEmail = (payload) => {
  const actionData = ActionData.createFromJSON(payload);

  // Verify the customer is in the data or give an error.
  if (! actionData.columnNames.includes("Customer")) {
    alert("The customers must be selected for this action");
  }
  else {
    // get the list of customers.
    const people = "'" + actionData.data['Customer'].join("' '") + "'";

    const search = `[Customer] [Account Balance] [Email] [Customer] in ([Customer] ${people})`;
    getSearchData(tsURL, wsGUID, search).then ((response) => {
      const searchData = SearchData.createFromJSON(response);

      const emails = [];
      for (let idx = 0; idx < searchData.nbrRows; idx++) {
        const customer = searchData.data['Customer'][idx];
        const email_addr = searchData.data['Email'][idx];
        const balance = searchData.data['Total Account Balance'][idx];

        const email = createEmailMessage(customer, email_addr, balance);
        emails.push(email);
      }
      showEmails(emails);
    });
  }
}

/** generate a super simple email message as an example. */
const createEmailMessage = (customer, email, balance) => {
  return `To: ${customer} (${email}), we are contacting you about your account balance of $${balance}.`
}

/** shows the email. */
const showEmails = (emails) => {
  const showDataElement = document.getElementById('modal-data-content');
  showDataElement.innerHTML = emails.join("\n\n");

  // display the model box.
  const dataElement = document.getElementById('show-data');
  dataElement.style.display = 'block';
}

const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}

document.getElementById('close-modal').addEventListener('click', closeModal);
window.onload = loadApp;