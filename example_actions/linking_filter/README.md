# Embed content linking example

This example shows how to implement content linking in pinboards.  This is accomplished by creating a context filter and then using the selected value to refresh the pinboard.

## Setup

Add a callback custom action that applies to context menus in a pinboard.  The
name can be anything, but the code expects `filter`, so if you use a 
different name, update the code to change the following to your id: 

`payload.id === 'filter'`

## Solution

First, use two variables to keep track of the filters, e.g.
~~~
let columnName = '';
let values = [''];
~~~

Next, create a LiveboardEmbed that uses these variables:

~~~
const embed = new LiveboardEmbed("#embed", {
  frameParams: {},
   pinboardId: "b22eabd5-6fa5-4342-847e-ca2abd5d54cc",
   runtimeFilters: [{
        columnName: columnName, // eg: color
        operator: RuntimeFilterOp.EQ,
        values: values // eg: red
   }],
});
~~~

The pinboardId is the ID for the pinboard to be filtered.  You can find the ID using the Developer Playground.

Now, when rendering, add the hook for the custom action:

~~~
  embed
  .on(EmbedEvent.CustomAction, (payload) => {
    if (payload.id === 'filter') {
      filterData(payload);
    }
  })
  .render();
~~~

Now the `filterData()` function will be called when the custom action is selected.  

Finally, the `filterData()` function will handle the content and call to render the pinboard again with updated filters.

~~~
const filterData = (payload) => {
  const actionData = PinboardContextActionData.createFromJSON(payload);
  columnName = actionData.columnNames[0];
  values = [];
  values.push(actionData.data[columnName][0]);
  embedPinboard();
}
~~~

Note that this function uses the dataclasses.js file.
