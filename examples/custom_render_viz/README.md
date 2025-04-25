custom_viz_template.html is a basic template for using the /pinboarddata API endpoint to render a visualization using a JavaScript charting library.

There is no SSO defined in this script, so you must sign into the ThoughtSpot instance in your browser directly first to establish a session. After that, all content will load smoothly (as long as you get the GUIDs correct).

It uses the dataclasses.js library available here in ts_everywhere_resources/apis to make an easily iterable data structure from the response. There is no particular charting library used within the example - instead it shows how to parse the various columns out of the ThoughtSpot API response to become the inputs for the given charting library you choose.
