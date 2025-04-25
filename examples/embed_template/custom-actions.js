/*
 * This script contains classes and functions for using custom actions.
 */

/**
 * Highlights the JSON.  Taken from https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript.
 * See custom-actions.css for CSS to highlight.
 * @param json
 * @returns {*}
 */
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

/**
 * Shows the payload as JSON.
 * @param payload The JSON payload to show.
 */
const showPayload = (payload) => {
  let json = `${JSON.stringify(payload, null, 2)}`;
  const showDataElement = document.getElementById('modal-data-content');
  showDataElement.innerHTML = syntaxHighlight(json);

  // display the model box.
  const dataElement = document.getElementById('show-data');
  dataElement.style.display = 'block';
}

const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}

export { closeModal, showPayload }
