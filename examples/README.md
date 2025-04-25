# Quick examples of embedding

`custom_demo`: examples where single HTML page contains all code to demo embedding

`custom_render_viz`: single HTML page example using V1 Liveboard Data API to retrieve data and render chart with JS charting library 

`embed_template`: template divided into HTML, CSS and ThoughtSpot Visual Embed SDK JavaScript files

`multi_embed`: variation of embed_template showing embedding multiple objects in a single page

`simple_pinboard_embed`: variation of embed_template showing the simplest possible embedding of one Liveboard into a page

# Trusted Authentication
Trusted Authentication is the most common SSO mechanism for embedding ThoughtSpot into a web application. It is documented at https://developers.thoughtspot.com/docs/trusted-auth

`token_auth`: A sample Token Request Service implemented in Python / Flash, including a troubleshooting HTML page that can be deployed on any computer to confirm the basics of Trusted Authenication are configured

An implementation of a Token Request Service using Node.js, Express and Axios is available https://github.com/thoughtspot/node-token-auth-server-example. 
