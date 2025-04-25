/**
 * This file contains Javascript wrappers for common API calls that are used with embedding scenarios.
 */

/**
 * Calls the ThoughtSpot logout service.
 * @param tsurl The URL for the ThoughtSpot cluster.
 * @returns {Promise<void>} The call to complete the logout.  Can usually be ignored.
 */
export const tsLogout = async (tsurl) => {
  console.log("Logging out from ThoughtSpot");
  const logoutURL = tsurl + "/callosum/v1/tspublic/v1/session/logout";

  await fetch(logoutURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-By': 'ThoughtSpot'
    },
    credentials: 'include'
  })
    .then(response => console.log("Logged out from ThoughtSpot"))
    .catch(error => console.error(error));
}

/**
 * Returns a list of pinboards that the user has access to.
 * Example:
   getPinboardList(tsurl).then(json, {
     // do something with the list.
   });
 * @param tsurl The URL for the ThoughtSpot cluster.
 * @returns {Promise<any>}  A promise with the list.
 */
export const getPinboardList = async (tsurl) => {
  // Returns the list of pinboards so the user can display them.
  const pinboardMetadataListURL = tsurl + "/callosum/v1/tspublic/v1/metadata/listobjectheaders?" +
    "type=PINBOARD_ANSWER_BOOK" +
    "&batchsize=-1";

  return await fetch(
    pinboardMetadataListURL, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "X-Requested-By": "ThoughtSpot"
      },
      credentials: "include"
    })
    .then(response =>  response.json())
    .then(data => data)
    .catch(error => {
      console.error("Unable to get the pinboard list: " + error)
    });
}

/**
 * Returns a list of GUIDs for a pinboard with a given name or an empty list if not found.
 * Example:
 * getPinboardGUIDs('<tsurl>', '<pinboard-name>').then (pinboardGUIDs => {
 *     // use the list.
 * });
 * @param tsurl URL for the ThoughtSpot cluster.
 * @param pinboardName Name of the pinboard to match.
 * @returns str[] A list of GUIDs (or empty list).
 */
export const getPinboardGUIDs = async (tsurl, pinboardName) => {

    console.log(`Getting pinboard GUIDs from ${tsurl}`)
    const pinboardGUIDs = [];
    await getPinboardList(tsurl).then(pinboards => {
        for (let idx = 0; idx < pinboards.length; idx++) {
          if (pinboards[idx].name === pinboardName) {
            pinboardGUIDs.push(pinboards[idx].id);
          }
        }
    });
    console.log(`got pinboard IDs [${pinboardGUIDs}]`)
    return pinboardGUIDs;
}

/**
 * Returns a promise with the list of visualizations for the given pinboard.
 * Example:
    getPinboardList(tsurl, pinboardId).then(pinboards => {
      // do something with the list of pinboards.
    });
 * @param tsurl The URL for the ThoughtSpot cluster.
 * @param pinboardId The GUID for the pinboard to get data for.
 * @returns {Promise<any>}
 */
export const getVisualizationList = async (tsurl, pinboardId) => {
  const vizMetadataListURL = tsurl + "/callosum/v1/tspublic/v1/metadata/listvizheaders?id=" + pinboardId;

  return await fetch(
    vizMetadataListURL, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "X-Requested-By": "ThoughtSpot"
      },
      credentials: "include"
    })
    .then(response =>  response.json())
    .then(data => data)
    .catch(error => {
      console.error("Unable to get the visualization list for pinboard " + pinboardId + ": " + error)
    });
}

/**
 * Returns a list of GUIDs for a pinboard visualization with a given name or an empty list if not found.
 * Example:
 * getPinboardVizGUIDs('<tsurl>', '<pinboardGUID>', '<vizName>').then (vizGUIDs => {
 *     // use the list.
 * });
 * @param tsurl URL for the ThoughtSpot cluster.
 * @param pinboardGUID The GUID for the pinboard.
 * @param vizName Name of the visualization to match.
 * @returns str[] A list of GUIDs (or empty list).
 */
export const getPinboardVizGUIDs = async (tsurl, pinboardGUID, vizName) => {

  console.log(`Getting viz GUIDs from ${tsurl} for viz ${pinboardGUID}::${vizName}`);
  const vizGUIDs = [];
  await getVisualizationList(tsurl, pinboardGUID).then(vizList => {
    for (let idx = 0; idx < vizList.length; idx++) {
      if (vizList[idx].name === vizName) {
        vizGUIDs.push(vizList[idx].id);
      }
    }
  });
  console.log(`got viz IDs [${vizGUIDs}]`)
  return vizGUIDs;
}

/**
 * Returns an array of worksheet metadata objects.
 * Example:
 * getPinboardVizGUIDs('<tsurl>').then (worksheets => {
 *     // use the list.
 * });
 * @param tsurl URL to ThoughtSpot.
 * @returns {Promise<any>}
 */
export const getWorksheetList = async (tsurl) => {
  const worksheetMetadataListURL = encodeURI(tsurl + "/callosum/v1/tspublic/v1/metadata/listobjectheaders?" +
    "type=LOGICAL_TABLE&" +
    "subtypes=[WORKSHEET]" +
    "&batchsize=-1"
  );

  return await fetch(
    worksheetMetadataListURL, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "X-Requested-By": "ThoughtSpot"
      },
      credentials: "include"
    })
    .then(response =>  response.json())
    .then(data => data)
    .catch(error => {
      console.error("Unable to get the list of worksheets: " + error);
    });
}

/**
 * Returns a list of GUIDs for a pinboard visualization with a given name or an empty list if not found.
 * Example:
 * getPinboardVizGUIDs('<tsurl>', '<pinboardGUID>', '<vizName>').then (vizGUIDs => {
 *     // use the list.
 * });
 * @param tsurl URL for the ThoughtSpot cluster.
 * @param worksheetName Name of the worksheet to match.
 * @returns str[] A list of GUIDs (or empty list).
 */
export const getWorksheetGUIDs = async (tsurl, worksheetName) => {

  console.log(`Getting viz GUIDs from ${tsurl} for worksheet ${worksheetName}`);
  const worksheetGUIDs = [];
  await getWorksheetList(tsurl).then(worksheetList => {
    for (let idx = 0; idx < worksheetList.length; idx++) {
      if (worksheetList[idx].name === worksheetName) {
        worksheetGUIDs.push(worksheetList[idx].id);
      }
    }
  });
  console.log(`got worksheet IDs [${worksheetGUIDs}]`)
  return worksheetGUIDs;
}

/**
 * Returns the data object for the pinboard and all of the vizualizations specified, or all if not specified.
 * Currently returns a JSON object as defined in
 * https://docs.thoughtspot.com/latest/app-integrate/reference/pinboarddata.html
 * Example:
     getPinboardData(tsurl, pinboardId, vizId).then((response) => {
       const pinboardData = PinboardData.createFromJSON(response);
       const firstVizId = Object.keys(pinboardData.vizData)[0];
       const html = tabularDataToHTML(pinboardData.vizData[firstVizId]);
       // display the table in the application.
     });
 * @param tsurl The URL for the ThoughtSpot cluster.
 * @param pinboardId The GUID for the pinboard to get data for.
 * @param vizIds Optional GUIDs to only get certain visualizations.  String or array.
 * @returns {Promise<any|void>} A promise that will return the data in JSON form.
 */
export const getPinboardData = async (tsurl, pinboardId, vizIds) => {
  console.log(`Getting data from pinboard ${pinboardId} and visualization(s) ${vizIds}`)
  let getPinboardDataURL = `${tsurl}/callosum/v1/tspublic/v1/pinboarddata?batchSize=-1&id=${pinboardId}`;

  if (vizIds) { // if vizIds were specified, they are optional
    if (! (Array.isArray(vizIds))) { // assume is a string and convert to an array.
      vizIds = [vizIds];
    }

    // TODO add handling for invalid types.  Currently only support string and array.
    const formattedVizIds = `["${vizIds.join('","')}"]`;
    getPinboardDataURL += '&vizid=' + formattedVizIds;
  }

  return await fetch(
    encodeURI(getPinboardDataURL), {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "X-Requested-By": "ThoughtSpot"
      },
      credentials: "include"
    })
    .then(response =>  response.json())
    .then(data => data)
    .catch(error => {
      console.error(`Unable to get the visualization list for pinboard ${pinboardId}: ${error}`);
    });
}

/**
 * Calls the search data API and returns a promise that can be used to get the search data JSON object.
 * Example:
      getSearchData(tsurl, worksheetId, search).then((response) => {
          const searchData = SearchData.createFromJSON(response);
          const html = tabularDataToHTML(searchData);
          // display the table in the application.
      });
 * @param tsurl The URL for the ThoughtSpot cluster.
 * @param worksheetId The GUID for the worksheet to search against.
 * @param search The search using the proper format (see TS documentation).
 * @returns {Promise<any|void>} A promise that will return the data in JSON form.
 */
export const getSearchData = async (tsurl, worksheetId, search) => {
  console.log(`Getting data from the SearchAPI from worksheet ${worksheetId} with search ${search}`);
  let getSearchDataURL = `${tsurl}/callosum/v1/tspublic/v1/searchdata?`;
  getSearchDataURL += `"batchSize=-1&data_source_guid=${worksheetId}&query_string=${search}`;

  return await fetch(
    encodeURI(getSearchDataURL), {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "X-Requested-By": "ThoughtSpot"
      },
      credentials: "include",
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error(`Error getting search data ${error}`));
}
