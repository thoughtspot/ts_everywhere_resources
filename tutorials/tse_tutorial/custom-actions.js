/*
 * This script contains classes and functions for using custom actions.
 */
const zip = (arrays) => {
  // combines and inverts arrays, so a = [1, 2, 3], b = [4, 5, 6] becomes [[1,4], [2,5], [3,6]]
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i]
    })
  });
}

class ActionData {
  // Wrapper for the data sent when a custom action is triggered.

  constructor() {
    this._columnNames = [];  // list of the columns in order.
    this._data = {};         // data is stored and indexed by column with the index being column name.
  }

  get nbrRows() {
    // Return the number of rows.  Assumes all columns are of the same length.
    if (this._columnNames && Object.keys(this._data)) {  // make sure there is some data.
      return this._data[this._columnNames[0]]?.length;
    }
    return 0;
  }

  get nbrColumns() {
    // Returns the number of columns.
    return this._columnNames.length;
  }

  static createFromJSON(jsonData) {
    // Creates a new ActionData object from JSON.
    const actionData = new ActionData();

    // Get the column names.
    const nbrCols = jsonData.data.columnsAndData.columns.length;
    for (let colCnt = 0; colCnt < nbrCols; colCnt += 1) {
      actionData._columnNames.push(jsonData.data.columnsAndData.columns[colCnt].column.name);
    }

    // can come in two flavors, so need to get the right data.
    let dataSet;
    dataSet = (Array.isArray(jsonData.data.columnsAndData.data))
      ? jsonData.data.columnsAndData.data[0].columnDataLite
      : jsonData.data.columnsAndData.data.columnDataLite;

    for (let colCnt = 0; colCnt < actionData.nbrColumns; colCnt++) {
      actionData._data[actionData._columnNames[colCnt]] = Array.from(dataSet[colCnt].dataValue);  // shallow copy the data
    }

    return actionData
  }

  getDataAsTable () {
    // returns the data as a table.  The columns will be in the same order as the column headers.
     const arrays = []
     for (const cname of this._columnNames) {
       arrays.push(this._data[cname])
     }

     return zip(arrays);  // returns a two dimensional data array
  }
}

const actionDataToHTML = (actionData) => {
  // Converts an ActionData data to an HTML table.
  let table = '<table class="tabular-data">';

  // Add a header
  table += '<tr>';
  for (const columnName of actionData._columnNames) {
    table += `<th class="tabular-data-th">${columnName}</th>`;
  }
  table += '</tr>';

  const data = actionData.getDataAsTable();
  for (let rnbr = 0; rnbr < actionData.nbrRows; rnbr++) {
    table += '<tr>';
    for (let cnbr = 0; cnbr < actionData.nbrColumns; cnbr++) {
      table += `<td class="tabular-data">${data[rnbr][cnbr]}</td>`;
    }
    table += '</tr>';
  }
  table += '</table>';

  return table;
}

export { ActionData, actionDataToHTML }
