This example is a single HTML page with configurable JavaScript variables for testing out the 'user_parameters' section of the auth token in ThoughtSpot 9.10.5 and later that used for assigning filters and parameters for ABAC.

Fill out the variables in the top script block of the page.

In 10.4, the /auth/token/custom endpoint is available to pair with the new ability to declare a required filter from the token from within the TML

Adjust via:

let tokenType = "custom"; // options are "custom" - 10.4 and later, and "full", before 10.4


Run the HTML page on a local web server, with a port that has CORS and CSP set within ThoughtSpot Security Settings in the Developer area.

You can configure the token to set Parameters and Filters using the simple example JSON syntax in the bottom left sections of the page.

When you press the "Generate Token" button, the example syntax is translated into the full syntax along with the user credentials to request a token. Once the token request is complete, it appears in the input box automatically.

Alternatively, if you have generated a token a different way (REST API V2.0 Playground, another script), you can simply paste it into the input box.

Press "Load Liveboard" to initialize the LiveboardEmbed component using the token from the input box.
