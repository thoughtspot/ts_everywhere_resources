# Embed download as CSV

This example shows how to add a custom action to download CSV.  ThoughtSpot allows you to download tabular data as CSV, but not charts.  This custom action adds that capability.  

## Setup

Add a callback custom action that applies to the main action or menu in an answer.  
The name can be anything, but the code expects `download-csv`, so if you use a 
different name, update the code to change the following to your id: 

`payload.id === 'download-csv'`

As is, this example will only work for Search or Saved Answers since the format of the data package for pinboard visualizations is different.  Adding for pinboards would simply require the use of other data classes.

## Solution

First, create a SearchEmbed object with an optional data source.

~~~
const embed = new SearchEmbed("#embed", {
  frameParams: {},
  dataSources: ["cd252e5c-b552-49a8-821d-3eadaa049cca"],
});
~~~

The dataSources contains the ID for a data source to have preselected.  You can find the ID using the Developer Playground.

Now, when rendering, add the hook for the custom action:

~~~
embed
.on(EmbedEvent.CustomAction, (payload) => {
  // The id is defined when creating the Custom Action in ThoughtSpot. 
  // Checking id attribute allows correct routing of multiple Custom Actions
  const downloadActionId = 'download-csv';
 if (payload.id === downloadActionId || payload.data.id === downloadActionId) {
   downloadCSV(payload);
 }
})
.render();
~~~

Now the `downloadCSV()` function will be called when the custom action is selected.  

Finally, the `downloadCSV()` function will handle the content and call to render the pinboard again with updated filters.

~~~
const downloadCSV = (payload) => {

  // Requires dataclasses.js from the /apis folder.
  const actionData = ActionData.createFromJSON(payload);
  const csv = tabularDataToCSV(actionData);

  const encodedUri = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "action_data.csv");
  document.body.appendChild(link); // Required for Firefox

  link.click(); // This will download the data file named "action_data.csv".
}
~~~

Note that this function uses the dataclasses.js file.
