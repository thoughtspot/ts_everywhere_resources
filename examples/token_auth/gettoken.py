"""
This is a demo app for getting a token for a user in a trusted authentication scenario.
"""
from flask import Flask, jsonify
from flask_cors import CORS

import logging
import os
import requests

app = Flask(__name__)
CORS(app=app)

CONFIG_FILE = "gettoken.config"

# constants for API usage.
LOGIN_API = "callosum/v1/tspublic/v1/session/login"

TOKEN_API = "callosum/v1/session/auth/token"
ACCESS_LEVEL = "FULL"

_log = logging.getLogger(__name__)
_log.setLevel(logging.INFO)


class InvalidUsage(Exception):
    """
    Class to provide an error if an API is called incorrectly.
    Taken from Flask documentation: https://flask.palletsprojects.com/en/1.1.x/patterns/apierrors/
    """
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """Handles thrown exceptions."""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


class GetAuthToken:
    """Manges getting an authentication token for a user."""

    def __init__(self, config):
        # TODO add parameters instead of constants.
        self.tsurl = config["ts-url"]
        self.username = config["ts-username"]
        self.password = config["ts-password"]
        self.secret_key = config["ts-secret"]
        self.cookies = None

        self.session = requests.Session()
        self.disable_ssl = True
        if self.disable_ssl:
            self.session.verify = False
        self.session.headers = {"X-Requested-By": "ThoughtSpot"}

    def _get_login_url(self) -> str:
        """Returns a URL for logging in."""
        login_url = f"https://{self.tsurl}/{LOGIN_API}"
        _log.info(login_url)
        return login_url

    def _get_token_url(self) -> str:
        """Returns a url for getting the token for a given user."""
        token_url = f"https://{self.tsurl}/{TOKEN_API}"
        _log.info(token_url)
        return token_url

    def _login(self):
        """Logs in as the admin user for calling the APIs."""
        url = self._get_login_url()
        response = self.session.post(
            url, data={"username": self.username, "password": self.password}
        )

        if response.ok:
            self.cookies = response.cookies
            _log.info(f"Successfully logged in as {self.username}")
        else:
            _log.error(f"Failed to log in as {self.username}.  Status {response.status_code}")
            raise requests.ConnectionError(
                f"Error logging in to TS ({response.status_code})",
                response.text,
            )

    def is_authenticated(self) -> bool:
        """Returns true if the session is authenticated"""
        return self.cookies is not None

    def get_token(self, secret: str, username: str) -> str:
        """
        Gets a token for the user with the username.
        :param secret: The secret key for the cluster.
        :param username: The username to get the token for.
        """
        if not self.is_authenticated():
            try:
                self._login()
            except requests.exceptions.ConnectionError as ce:
                _log.error(f"Unable to log in: {ce}")
                raise InvalidUsage(message="Error accessing the ThoughtSpot cluster.  "
                                   "Check the cluster status and login details.")

        url = self._get_token_url()
        data = {
            "secret_key": secret,
            "username": username,
            "access_level": "FULL"
        }

        response = self.session.post(url=url, data=data)

        if not response.ok:
            _log.error(f"Error getting token for {username}")
            error_msg = f"[{response.status_code}]: {response.text}"
            _log.error(error_msg)

            raise InvalidUsage(message=error_msg)

        return response.text


def read_config():
    """Reads the values from the config file and sets in config."""

    if not os.path.exists(CONFIG_FILE):
        _log.error(f"Can't find configuration file {CONFIG_FILE}")
        exit(-1)

    with open(CONFIG_FILE, "r") as config_file:
        for line in config_file.readlines():
            line = line.split("#")[0]  # strip off comments.
            line = line.strip()  # get rid of any extra spaces at the ends.

            if "=" in line:
                config_token = line.split("=")
                app.config[config_token[0].strip()] = config_token[1].strip()

    _log.info(app.config)
    return app.config


def get_auth_token():
    return GetAuthToken(read_config())


@app.route('/')
def index():
    raise InvalidUsage(message='Use /gettoken/<username>, where <username> is a valid TS user.')


@app.route("/gettoken/<username>", methods=["GET"])
def get_token(username: str) -> str:
    """Gets a token for the given user name."""
    read_config()  # will always use the latest config.
    return get_auth_token().get_token(secret=app.config["ts-secret"], username=username)


if __name__ == '__main__':
    _log.info("starting app")
    app.run(host='0.0.0.0')
