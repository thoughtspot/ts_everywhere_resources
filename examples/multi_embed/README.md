# Embed template

This template provides the basics to experiment with embedding in ThoughtSpot.  
It includes the following files:

## index.html
  
This file is the basic web page for embedding.  It controls the layout and control for the app.  Most importantly, it contains an element (with ID "embed") to embed content into and imports the ThoughtSpot SDK and also the tse.js file that has contains the application logic. 

## tse.css

This file is a basic style sheet for the application.  It sets some basic colors and fonts.  Changes to this file will only modify the look of the application.

## tse.js

This JavaScript file provides the common framework components for embedding.  It contains the init() call used to initialize the ThoughtSpot connection with no login, along with empty starter functions for embedding.  Note that the example is designed such that it can only demonstrate a single embedded component at a time since there is only one embed DOM object.
