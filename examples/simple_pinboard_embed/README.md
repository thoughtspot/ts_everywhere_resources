# Simple Embed Example

This script demonstrates how to easily embed single pinboard visualizations that can be called as a service.  This scenario occurs when users want to call a different URL than ThoughtSpot or just want to have a simple API call instead of creating individual embed components.

## Usage

Assuming the file is seployed to server.com, the call would look like:
> http(s)://server.com?pinboardid=&lt;ID&gt;vizid=&lt;ID&gt;

## Files

* index.html - the web page for embedding
* tse.css - a basic style sheet, typically replaced with an application style sheet
* tse.js - the logic to handle embedding the pinboard or visualization