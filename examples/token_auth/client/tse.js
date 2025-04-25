/*
 * The completed script for the ThoughtSpot Everywhere tutorial.  Your solution should look similar.
 * It's recommended to refer to the documentation and Developer Playground to try to get it working before
 * using this file.
 */
import {AppEmbed, AuthType, init, Page,} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

// TODO - set the following for your URL.
const tsURL = "https://try.thoughtspot.cloud";
const tokenServiceURL = "https://tokenserver.mycompany.com";

// functions to show and hide div sections.
const showDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'flex';
}

const hideDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'none';
}

// Global values for authentication.  Ideally store somewhere.
let username;

// Create and manage the login screen.
const onLogin = () => {

  // The following can be used if you want to use AuthType.Basic
  username = document.getElementById('username').value;

  // Only use one of the following.  Both should work.
  initWithServer();
  //initWithCallback();

  hideDiv('login');
  showDiv('main-app');

  onFull();
}

const initWithServer = () => {

  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.AuthServer,
    authEndpoint: tokenServiceURL + "/gettoken/" + username,
    username: username
  });

}

const initWithCallback = () => {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.AuthServer,
    getAuthToken: getAuthToken,
    username: username
  });
}

export const getAuthToken = async () => {
  const tokenURL = tokenServiceURL + "/gettoken/" + username
  console.log("calling token server at " + tokenURL);

  const timeoutSecs = 5 * 1000; // seconds to milliseconds

  const response = await timeout(timeoutSecs, fetch(
    tokenURL,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': "text/plain"
      }
    }
  ))

  // Have to return a promise for the auth SDK.
  //console.log(await response.text());
  return response.text()
}

// Embed the full application.
const onFull = () => {

  const embed = new AppEmbed('#embed', {
    frameParams: {},
    showPrimaryNavbar: false,  // set to true to show the ThoughtSpot navbar
    pageId: Page.Home, // loads the Home tab, but you can start on any main tab - try Page.Search
  });

  embed.render();
}

// Show the URL to connect to.
document.getElementById('ts-url').innerText = 'ThoughtSpot Server: ' + tsURL;
document.getElementById('token-url').innerText = 'Token Service: ' + tokenServiceURL;

// Hook up the events to the buttons and links.
document.getElementById('login-button').addEventListener('click', onLogin);