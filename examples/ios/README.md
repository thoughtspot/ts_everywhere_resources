This is a very basic Swift iOS project, showing how to use the ThoughtSpot REST API to retrieve a Full Access Token, request a listing of Liveboards, then load a page using a WebView embed that loads that Liveboard while maintaing the same WebView within the app so that load times are decent.

It uses Cookieless Trusted Auth, based on the principle of a Long Lived Full Access Token for the user.

/Embedded TS/Embedded TS/ is the main directory

There are three View Controller Scenes in the test app, viewable on `Main`

First View Controller scene allows you to set your ThoughtSpot instance URL, and paste in a Full Access Token.

Use `api/rest/2.0/auth/token/full` to create a token with a long `validity_time_in_sec` property (many days or weeks), then paste it into the token entry box. 

At this point, the Liveboards for the user will be requeste via `/metadata/search`.

When you press "Show Liveboards", the app transitions to `Liveboard Table View Controller` which generates a table view with the available liveboards for the user.

Clicking on any of the Liveboard items in the list transitions to `Liveboard Component View Controller`, which has a WebView that currently points to https://github.com/thoughtspot/tse-auth-token-server-example/blob/main/static/ios_liveboard.html

The code sends the Token, the ThoughtSpot instance URL and the Liveboard GUID to this page, filling in the variables for it to load properly
