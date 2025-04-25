# Get Token Service

This project is a simple Flask service that will act as a trusted authentication service for ThoughtSpot.  

*__This service is intended as an example and not a product-ready solution.  In particular, it only demonstrates the use of the ThoughtSpot API.  In a production solution you would need to verify that the request was from a valid source, and the user is authenticated in your application to avoid calls on behalf of other users.__*

Calls to the service are in the form of `https://<URL>:5000/gettoken/<username>`
where:
* username - Name of the ThoughtSpot user to get a token for.  This user must already exist in ThoughtSpot.

The service will grant FULL access to whatever the user has permissions to access.

## Python Dependencies
* Python 3 (virtual environment recommended)
* flask
* flask_cors
* requests

## Deploy and Configure

Before using Trusted Authentication, you need to enable it.  This can be done from the Developer Security Settings as described in the [Documentation](https://cloud-docs.thoughtspot.com/admin/ts-cloud/trusted-authentication.html)

This service should be deployed to an environment that is

1. Accessible to the embedding application that will need to use token authentication
2. Have access to the ThoughtSpot cluster APIs (usually via HTTPS)
3. Has Python3 installed and can load the packages above.

### Steps to deploy and run

1. Create a folder on the server (e.g. AWS) that will host the gettoken service.  Navigate to this folder, e.g. `cd tokenservice`
2. Create a virtual environment using `python3 -m venv ./venv`.  While this step isn't technically required, it is recommended to avoid conflicts in package dependencies.
3. Deploy the `gettoken.py`, `gettoken.config`, `start_flask.sh` scripts to the new folder.
4. Modify the `gettoken.config` file to have the proper settings for your ThoughtSpot cluster.
5. Modify `start_flask.sh` to point to have the correct folder information.

### Run
You should now be able to run `bash start_flask.sh` to start the server.  The server listens on port 5000. 

### Troubleshoot
The `trusted_auth_tester.html` page in this repo can be used to isolate issues while implementing Trusted Authentication. You must have the correct CORS and CSP settings to allow embedding from wherever you host this tester page.

## Notes

* The user must exist on the target ThoughtSpot server, or you will get an error.
* Passwords aren't supported, so as long as the user exists, a valid token will be returned.  In production environments you would authenticate the user in the embedding application.
* All users get FULL access.

## Contact
Primary author is [Bill Back](https://github.com/billdback-ts)
