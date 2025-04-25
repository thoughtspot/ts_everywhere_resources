# Sample Client

The sample client is a very basic ThoughtSpot everywhere application that embeds the full ThoughSpot application and does authentication using trusted server authentication.  This client expects the token service in the parent package.  

To use the client you need to:

1. Set the security settings in ThoughtSpot.
2. Deploy the [token service](../README.md).
3. Update and deploy the client.

## Set security settings in ThoughtSpot

You will need to set two settings in the Developer Portal. 

The following example assume you client app uses a URL like `https://myapp.mycompany.com`.

1. Set the CSP visual embed hosts to include the URL for the client application.  In this example, you would add `https://myapp.mycompany.com`.
2. Set the CORS whitelisted domains to include the domain.  For example `myapp.mycompany.com`.

You can find more details on security settings in the [ThoughtSpot Documentation](https://cloud-docs.thoughtspot.com/admin/ts-cloud/security-settings.html)

# Deploy the token service

The instructions for deploying the token service can be found in [that readme](../README.md).

## Update and deploy the client

Finally, you need to deploy your application to a web server.  For the example application, you need to edit `tse.js` and set the `tsURL` and `tokenServiceURL` to use your cluster and token service respectively. 

# Test the Authentication

You should be able to connect to your web app (or the example) and log in to see the full embedded application.  It's recommended to do this with the Developer Tools open in your browser to see any error messages.
