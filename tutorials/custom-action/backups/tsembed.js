(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mixpanel-browser')) :
    typeof define === 'function' && define.amd ? define(['exports', 'mixpanel-browser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tsembed = {}, global.mixpanel));
}(this, (function (exports, mixpanel) { 'use strict';

    /**
     * Copyright (c) 2020
     *
     * Common utility functions for ThoughtSpot Visual Embed SDK
     *
     * @summary Utils
     * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
     */
    /**
     * Construct a runtime filters query string from the given filters.
     * Refer to the following docs for more details on runtime filter syntax:
     * https://cloud-docs.thoughtspot.com/admin/ts-cloud/apply-runtime-filter.html
     * https://cloud-docs.thoughtspot.com/admin/ts-cloud/runtime-filter-operators.html
     * @param runtimeFilters
     */
    const getFilterQuery = (runtimeFilters) => {
        if (runtimeFilters && runtimeFilters.length) {
            const filters = runtimeFilters.map((filter, valueIndex) => {
                const index = valueIndex + 1;
                const filterExpr = [];
                filterExpr.push(`col${index}=${filter.columnName}`);
                filterExpr.push(`op${index}=${filter.operator}`);
                filterExpr.push(filter.values.map((value) => `val${index}=${value}`).join('&'));
                return filterExpr.join('&');
            });
            return `${filters.join('&')}`;
        }
        return null;
    };
    /**
     * Convert a value to a string representation to be sent as a query
     * parameter to the ThoughtSpot app.
     * @param value Any parameter value
     */
    const serializeParam = (value) => {
        // do not serialize primitive types
        if (typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean') {
            return value;
        }
        return JSON.stringify(value);
    };
    /**
     * Convert a value to a string:
     * in case of an array, we convert it to CSV.
     * in case of any other type, we directly return the value.
     * @param value
     */
    const paramToString = (value) => Array.isArray(value) ? value.join(',') : value;
    /**
     * Return a query param string composed from the given params object
     * @param queryParams
     */
    const getQueryParamString = (queryParams, shouldSerializeParamValues = false) => {
        const qp = [];
        const params = Object.keys(queryParams);
        params.forEach((key) => {
            const val = queryParams[key];
            if (val !== undefined) {
                const serializedValue = shouldSerializeParamValues
                    ? serializeParam(val)
                    : paramToString(val);
                qp.push(`${key}=${serializedValue}`);
            }
        });
        if (qp.length) {
            return qp.join('&');
        }
        return null;
    };
    /**
     * Get a string representation of a dimension value in CSS
     * If numeric, it is considered in pixels.
     * @param value
     */
    const getCssDimension = (value) => {
        if (typeof value === 'number') {
            return `${value}px`;
        }
        return value;
    };
    /**
     * Append a string to a URL's hash fragment
     * @param url A URL
     * @param stringToAppend The string to append to the URL hash
     */
    const appendToUrlHash = (url, stringToAppend) => {
        let outputUrl = url;
        const encStringToAppend = encodeURIComponent(stringToAppend);
        if (url.indexOf('#') >= 0) {
            outputUrl = `${outputUrl}${encStringToAppend}`;
        }
        else {
            outputUrl = `${outputUrl}#${encStringToAppend}`;
        }
        return outputUrl;
    };

    /**
     * Copyright (c) 2020
     *
     * TypeScript type definitions for ThoughtSpot Visual Embed SDK
     *
     * @summary Type definitions for Embed SDK
     * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
     */
    (function (AuthType) {
        /**
         * No authentication. Use this only for testing purposes.
         */
        AuthType["None"] = "None";
        /**
         * SSO using SAML
         */
        AuthType["SSO"] = "SSO_SAML";
        /**
         * Trusted authentication server
         */
        AuthType["AuthServer"] = "AuthServer";
        /**
         * Use the ThoughtSpot login API to authenticate to the cluster directly.
         *
         * Warning: This feature is primarily intended for developer testing. It is
         * strongly advised not to use this authentication method in production.
         */
        AuthType["Basic"] = "Basic";
    })(exports.AuthType || (exports.AuthType = {}));
    (function (RuntimeFilterOp) {
        /**
         * Equals
         */
        RuntimeFilterOp["EQ"] = "EQ";
        /**
         * Does not equal
         */
        RuntimeFilterOp["NE"] = "NE";
        /**
         * Less than
         */
        RuntimeFilterOp["LT"] = "LT";
        /**
         * Less than or equal to
         */
        RuntimeFilterOp["LE"] = "LE";
        /**
         * Greater than
         */
        RuntimeFilterOp["GT"] = "GT";
        /**
         * Greater than or equal to
         */
        RuntimeFilterOp["GE"] = "GE";
        /**
         * Contains
         */
        RuntimeFilterOp["CONTAINS"] = "CONTAINS";
        /**
         * Begins with
         */
        RuntimeFilterOp["BEGINS_WITH"] = "BEGINS_WITH";
        /**
         * Ends with
         */
        RuntimeFilterOp["ENDS_WITH"] = "ENDS_WITH";
        /**
         * Between, inclusive of higher value
         */
        RuntimeFilterOp["BW_INC_MAX"] = "BW_INC_MAX";
        /**
         * Between, inclusive of lower value
         */
        RuntimeFilterOp["BW_INC_MIN"] = "BW_INC_MIN";
        /**
         * Between, inclusive of both higher and lower value
         */
        RuntimeFilterOp["BW_INC"] = "BW_INC";
        /**
         * Between, non-inclusive
         */
        RuntimeFilterOp["BW"] = "BW";
        /**
         * Is included in this list of values
         */
        RuntimeFilterOp["IN"] = "IN";
    })(exports.RuntimeFilterOp || (exports.RuntimeFilterOp = {}));
    (function (EmbedEvent) {
        /**
         * Rendering has initialized.
         * @return timestamp - The timestamp when the event was generated.
         */
        EmbedEvent["Init"] = "init";
        /**
         * Authentication has either succeeded or failed.
         * @return isLoggedIn - A Boolean specifying whether authentication was successful.
         */
        EmbedEvent["AuthInit"] = "authInit";
        /**
         * The iFrame has loaded. This only refers to the iFrame load event
         * and does not mean the ThoughtSpot app has completed loading.
         * @return timestamp - The timestamp when the event was generated.
         */
        EmbedEvent["Load"] = "load";
        /**
         * Data pertaining to answer or pinboard is received
         * @return data - The answer or pinboard data
         */
        EmbedEvent["Data"] = "data";
        /**
         * Search/answer/pinboard filters have been applied/updated
         * @hidden
         */
        EmbedEvent["FiltersChanged"] = "filtersChanged";
        /**
         * Search query has been updated
         * @hidden
         */
        EmbedEvent["QueryChanged"] = "queryChanged";
        /**
         * A drill down operation has been performed.
         * @return additionalFilters - Any additional filters applied
         * @return drillDownColumns - The columns on which drill down was performed
         * @return nonFilteredColumns - The columns that were not filtered
         */
        EmbedEvent["Drilldown"] = "drillDown";
        /**
         * One or more data sources have been selected.
         * @return dataSourceIds - the list of data sources
         */
        EmbedEvent["DataSourceSelected"] = "dataSourceSelected";
        /**
         * A custom action has been triggered
         * @return actionId - The id of the custom action
         * @return data - The answer or pinboard data
         */
        EmbedEvent["CustomAction"] = "customAction";
        /**
         * An error has occurred.
         * @return error - An error object or message
         */
        EmbedEvent["Error"] = "Error";
        /**
         * The embedded object has sent an alert
         * @return alert - An alert object
         */
        EmbedEvent["Alert"] = "alert";
        /**
         * The ThoughtSpot auth session has expired.
         * @hidden
         */
        EmbedEvent["AuthExpire"] = "ThoughtspotAuthExpired";
        /**
         * The height of the embedded pinboard or visualization has been computed.
         * @return data - The height of the embedded pinboard or visualization
         */
        EmbedEvent["EmbedHeight"] = "EMBED_HEIGHT";
        /**
         * The v1 event type for Data
         * @hidden
         */
        EmbedEvent["V1Data"] = "exportVizDataToParent";
        /**
         * Emitted when the embed does not have cookie access. This
         * happens on Safari where third-party cookies are blocked by default.
         *
         * @version 1.1.0
         */
        EmbedEvent["NoCookieAccess"] = "noCookieAccess";
        /**
         * Emitted when SAML is complete
         * @private
         * @hidden
         */
        EmbedEvent["SAMLComplete"] = "samlComplete";
    })(exports.EmbedEvent || (exports.EmbedEvent = {}));
    (function (HostEvent) {
        /**
         * Trigger a search
         * @param dataSourceIds - The list of data source GUIDs
         * @param searchQuery - The search query
         */
        HostEvent["Search"] = "search";
        /**
         * Apply filters
         * @hidden
         */
        HostEvent["Filter"] = "filter";
        /**
         * Reload the answer or visualization
         * @hidden
         */
        HostEvent["Reload"] = "reload";
    })(exports.HostEvent || (exports.HostEvent = {}));
    (function (DataSourceVisualMode) {
        /**
         * Data source panel is hidden.
         */
        DataSourceVisualMode["Hidden"] = "hide";
        /**
         * Data source panel is collapsed, but the user can manually expand it.
         */
        DataSourceVisualMode["Collapsed"] = "collapse";
        /**
         * Data source panel is expanded, but the user can manually collapse it.
         */
        DataSourceVisualMode["Expanded"] = "expand";
    })(exports.DataSourceVisualMode || (exports.DataSourceVisualMode = {}));
    /**
     * The query params passed down to the embedded ThoughtSpot app
     * containing configuration and/or visual information.
     */
    // eslint-disable-next-line no-shadow
    var Param;
    (function (Param) {
        Param["DataSources"] = "dataSources";
        Param["DataSourceMode"] = "dataSourceMode";
        Param["DisableActions"] = "disableAction";
        Param["DisableActionReason"] = "disableHint";
        Param["SearchQuery"] = "searchQuery";
        Param["HideActions"] = "hideAction";
        Param["EnableVizTransformations"] = "enableVizTransform";
        Param["EnableSearchAssist"] = "enableSearchAssist";
        Param["HideResult"] = "hideResult";
        Param["UseLastSelectedDataSource"] = "useLastSelectedSources";
        Param["Tag"] = "tag";
        Param["searchTokenString"] = "searchTokenString";
        Param["executeSearch"] = "executeSearch";
    })(Param || (Param = {}));
    (function (Action) {
        Action["Save"] = "save";
        Action["Update"] = "update";
        Action["SaveUntitled"] = "saveUntitled";
        Action["SaveAsView"] = "saveAsView";
        Action["MakeACopy"] = "makeACopy";
        Action["EditACopy"] = "editACopy";
        Action["CopyLink"] = "embedDocument";
        Action["PinboardSnapshot"] = "pinboardSnapshot";
        Action["ResetLayout"] = "resetLayout";
        Action["Schedule"] = "schedule";
        Action["SchedulesList"] = "schedule-list";
        Action["Share"] = "share";
        Action["AddFilter"] = "addFilter";
        Action["ConfigureFilter"] = "configureFilter";
        Action["AddFormula"] = "addFormula";
        Action["SearchOnTop"] = "searchOnTop";
        Action["SpotIQAnalyze"] = "spotIQAnalyze";
        Action["ExplainInsight"] = "explainInsight";
        Action["SpotIQFollow"] = "spotIQFollow";
        Action["ShareViz"] = "shareViz";
        Action["ReplaySearch"] = "replaySearch";
        Action["ShowUnderlyingData"] = "showUnderlyingData";
        Action["Download"] = "download";
        Action["DownloadAsPdf"] = "downloadAsPdf";
        Action["DownloadAsCsv"] = "downloadAsCSV";
        Action["DownloadAsXlsx"] = "downloadAsXLSX";
        Action["DownloadTrace"] = "downloadTrace";
        Action["ExportTML"] = "exportTSL";
        Action["ImportTML"] = "importTSL";
        Action["UpdateTML"] = "updateTSL";
        Action["EditTML"] = "editTSL";
        Action["Present"] = "present";
        Action["ToggleSize"] = "toggleSize";
        Action["Edit"] = "edit";
        Action["EditTitle"] = "editTitle";
        Action["Remove"] = "delete";
        Action["Ungroup"] = "ungroup";
        Action["Describe"] = "describe";
        Action["Relate"] = "relate";
        Action["CustomizeHeadlines"] = "customizeHeadlines";
        Action["PinboardInfo"] = "pinboardInfo";
        Action["SendAnswerFeedback"] = "sendFeedback";
        Action["CustomAction"] = "customAction";
        Action["DownloadEmbraceQueries"] = "downloadEmbraceQueries";
        Action["Pin"] = "pin";
        Action["AnalysisInfo"] = "analysisInfo";
        Action["Subscription"] = "subscription";
        Action["Explore"] = "explore";
        Action["DrillInclude"] = "context-menu-item-include";
        Action["DrillExlude"] = "context-menu-item-exclude";
        Action["CopyToClipboard"] = "context-menu-item-copy-to-clipboard";
        Action["DrillEdit"] = "context-menu-item-edit";
        Action["EditMeasure"] = "context-menu-item-edit-measure";
        Action["Separator"] = "context-menu-item-separator";
        Action["DrillDown"] = "DRILL";
    })(exports.Action || (exports.Action = {}));

    const ERROR_MESSAGE = {
        INVALID_THOUGHTSPOT_HOST: 'Error parsing ThoughtSpot host. Please provide a valid URL.',
        PINBOARD_VIZ_ID_VALIDATION: 'Please provide either pinboardId or both pinboarId and vizId',
    };

    /**
     * Copyright (c) 2020
     *
     * Utilities related to reading configuration objects
     *
     * @summary Config-related utils
     * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
     */
    const urlRegex = new RegExp([
        '(^(https?:)//)?',
        '(([^:/?#]*)(?::([0-9]+))?)',
        '(/{0,1}[^?#]*)',
        '(\\?[^#]*|)',
        '(#.*|)$', // hash
    ].join(''));
    /**
     * Parse and construct the ThoughtSpot hostname or IP address
     * from the embed configuration object.
     * @param config
     */
    const getThoughtSpotHost = (config) => {
        const urlParts = config.thoughtSpotHost.match(urlRegex);
        if (!urlParts) {
            throw new Error(ERROR_MESSAGE.INVALID_THOUGHTSPOT_HOST);
        }
        const protocol = urlParts[2] || window.location.protocol;
        const host = urlParts[3];
        let path = urlParts[6];
        // Lose the trailing / if any
        if (path.charAt(path.length - 1) === '/') {
            path = path.substring(0, path.length - 1);
        }
        // const urlParams = urlParts[7];
        // const hash = urlParts[8];
        return `${protocol}//${host}${path}`;
    };
    const getV2BasePath = (config) => {
        if (config.basepath) {
            return config.basepath;
        }
        const tsHost = getThoughtSpotHost(config);
        // This is to handle when the developer is developing in their local environment.
        if (tsHost.includes('://localhost')) {
            return '';
        }
        return 'v2';
    };
    /**
     * It is a good idea to keep URLs under 2000 chars.
     * If this is ever breached, since we pass view configuration through
     * URL params, we would like to log a warning.
     * Reference: https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
     */
    const URL_MAX_LENGTH = 2000;
    /**
     * The default CSS dimensions of the embedded app
     */
    const DEFAULT_EMBED_WIDTH = '100%';
    const DEFAULT_EMBED_HEIGHT = '100%';

    let loggedInStatus = false;
    let samlAuthWindow = null;
    let samlCompletionPromise = null;
    const SSO_REDIRECTION_MARKER_GUID = '5e16222e-ef02-43e9-9fbd-24226bf3ce5b';
    const EndPoints = {
        AUTH_VERIFICATION: '/callosum/v1/session/info',
        SSO_LOGIN_TEMPLATE: (targetUrl) => `/callosum/v1/saml/login?targetURLPath=${targetUrl}`,
        TOKEN_LOGIN: '/callosum/v1/session/login/token',
        BASIC_LOGIN: '/callosum/v1/session/login',
    };
    /**
     * Check if we are logged into the ThoughtSpot cluster
     * @param thoughtSpotHost The ThoughtSpot cluster hostname or IP
     */
    async function isLoggedIn(thoughtSpotHost) {
        const authVerificationUrl = `${thoughtSpotHost}${EndPoints.AUTH_VERIFICATION}`;
        let response;
        try {
            response = await fetch(authVerificationUrl, {
                credentials: 'include',
            });
        }
        catch (e) {
            return false;
        }
        return response.status === 200;
    }
    /**
     * Check if we are stuck at the SSO redirect URL
     */
    function isAtSSORedirectUrl() {
        return window.location.href.indexOf(SSO_REDIRECTION_MARKER_GUID) >= 0;
    }
    /**
     * Remove the SSO redirect URL marker
     */
    function removeSSORedirectUrlMarker() {
        // Note (sunny): This will leave a # around even if it was not in the URL
        // to begin with. Trying to remove the hash by changing window.location will reload
        // the page which we don't want. We'll live with adding an unnecessary hash to the
        // parent page URL until we find any use case where that creates an issue.
        window.location.hash = window.location.hash.replace(SSO_REDIRECTION_MARKER_GUID, '');
    }
    /**
     * Perform token based authentication
     * @param embedConfig The embed configuration
     */
    const doTokenAuth = async (embedConfig) => {
        const { thoughtSpotHost, username, authEndpoint, getAuthToken, } = embedConfig;
        if (!authEndpoint && !getAuthToken) {
            throw new Error('Either auth endpoint or getAuthToken function must be provided');
        }
        const loggedIn = await isLoggedIn(thoughtSpotHost);
        if (!loggedIn) {
            let authToken = null;
            if (getAuthToken) {
                authToken = await getAuthToken();
            }
            else {
                authToken = await fetch(authEndpoint).then((response) => response.text());
            }
            await fetch(`${thoughtSpotHost}${EndPoints.TOKEN_LOGIN}?username=${username}&auth_token=${authToken}`, {
                credentials: 'include',
            });
            loggedInStatus = false;
        }
        loggedInStatus = true;
    };
    /**
     * Perform basic authentication to the ThoughtSpot cluster using the cluster
     * credentials.
     *
     * Warning: This feature is primarily intended for developer testing. It is
     * strongly advised not to use this authentication method in production.
     * @param embedConfig The embed configuration
     */
    const doBasicAuth = async (embedConfig) => {
        const { thoughtSpotHost, username, password } = embedConfig;
        const loggedIn = await isLoggedIn(thoughtSpotHost);
        if (!loggedIn) {
            const response = await fetch(`${thoughtSpotHost}${EndPoints.BASIC_LOGIN}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-requested-by': 'ThoughtSpot',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                credentials: 'include',
            });
            loggedInStatus = response.status === 200;
        }
        loggedInStatus = true;
    };
    async function samlPopupFlow(ssoURL) {
        document.body.insertAdjacentHTML('beforeend', '<div id="ts-saml-auth"></div>');
        const authElem = document.getElementById('ts-saml-auth');
        samlCompletionPromise =
            samlCompletionPromise ||
                new Promise((resolve, reject) => {
                    window.addEventListener('message', (e) => {
                        if (e.data.type === exports.EmbedEvent.SAMLComplete) {
                            e.source.close();
                            resolve();
                        }
                    });
                });
        authElem.addEventListener('click', () => {
            if (samlAuthWindow === null || samlAuthWindow.closed) {
                samlAuthWindow = window.open(ssoURL, '_blank', 'location=no,height=570,width=520,scrollbars=yes,status=yes');
            }
            else {
                samlAuthWindow.focus();
            }
        }, { once: true });
        authElem.click();
        return samlCompletionPromise;
    }
    /**
     * Perform SAML authentication
     * @param embedConfig The embed configuration
     */
    const doSamlAuth = async (embedConfig) => {
        const { thoughtSpotHost } = embedConfig;
        const loggedIn = await isLoggedIn(thoughtSpotHost);
        if (loggedIn) {
            if (isAtSSORedirectUrl()) {
                removeSSORedirectUrlMarker();
            }
            loggedInStatus = true;
            return;
        }
        // we have already tried authentication and it did not succeed, restore
        // the current URL to the original one and invoke the callback.
        if (isAtSSORedirectUrl()) {
            removeSSORedirectUrlMarker();
            loggedInStatus = false;
            return;
        }
        // redirect for SSO, when the SSO authentication is done, this page will be loaded
        // again and the same JS will execute again.
        const ssoRedirectUrl = embedConfig.noRedirect
            ? `${thoughtSpotHost}/v2/#/embed/saml-complete`
            : appendToUrlHash(window.location.href, SSO_REDIRECTION_MARKER_GUID);
        // bring back the page to the same URL
        const ssoEndPoint = `${EndPoints.SSO_LOGIN_TEMPLATE(encodeURIComponent(ssoRedirectUrl))}`;
        const ssoURL = `${thoughtSpotHost}${ssoEndPoint}`;
        if (embedConfig.noRedirect) {
            await samlPopupFlow(ssoURL);
            return;
        }
        window.location.href = ssoURL;
    };
    /**
     * Perform authentication on the ThoughtSpot cluster
     * @param embedConfig The embed configuration
     */
    const authenticate = async (embedConfig) => {
        const { authType } = embedConfig;
        switch (authType) {
            case exports.AuthType.SSO:
                return doSamlAuth(embedConfig);
            case exports.AuthType.AuthServer:
                return doTokenAuth(embedConfig);
            case exports.AuthType.Basic:
                return doBasicAuth(embedConfig);
            default:
                return Promise.resolve();
        }
    };
    /**
     * Check if we are authenticated to the ThoughtSpot cluster
     */
    const isAuthenticated = () => loggedInStatus;

    const EndPoints$1 = {
        CONFIG: '/callosum/v1/system/config',
    };
    const MIXPANEL_EVENT = {
        VISUAL_SDK_RENDER_START: 'visual-sdk-render-start',
        VISUAL_SDK_CALLED_INIT: 'visual-sdk-called-init',
        VISUAL_SDK_IFRAME_LOAD_PERFORMANCE: 'visual-sdk-iframe-load-performance',
    };
    let isEventCollectorOn = false;
    const eventCollectorQueue = [];
    function setEventCollectorOn() {
        isEventCollectorOn = true;
    }
    function getEventCollectorOnValue() {
        return isEventCollectorOn;
    }
    /**
     * Pushes the event with its Property key-value map to mixpanel.
     * @param eventId
     * @param eventProps
     */
    async function uploadMixpanelEvent(eventId, eventProps = {}) {
        if (!getEventCollectorOnValue()) {
            eventCollectorQueue.push({ eventId, eventProps });
            return Promise.resolve();
        }
        return new Promise(() => mixpanel.track(eventId, eventProps));
    }
    function emptyQueue() {
        eventCollectorQueue.forEach((event) => {
            uploadMixpanelEvent(event.eventId, event.eventProps);
        });
    }
    async function initMixpanel(config) {
        const { thoughtSpotHost } = config;
        return fetch(`${thoughtSpotHost}${EndPoints$1.CONFIG}`)
            .then((response) => response.json())
            .then((data) => {
            const token = data.mixpanelAccessToken;
            if (token) {
                mixpanel.init(token);
                setEventCollectorOn();
                emptyQueue();
                uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_CALLED_INIT, {
                    authType: config.authType,
                    host: config.thoughtSpotHost,
                });
            }
        });
    }

    /**
     * Copyright (c) 2021
     *
     * Base classes
     *
     * @summary Base classes
     * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
     */
    let config = {};
    let authPromise;
    /**
     * The event id map from v2 event names to v1 event id
     * v1 events are the classic embed events implemented in Blink v1
     * We cannot rename v1 event types to maintain backward compatibility
     * @internal
     */
    const V1EventMap = {
        [exports.EmbedEvent.Data]: [exports.EmbedEvent.V1Data],
    };
    /**
     * Perform authentication on the ThoughtSpot app as applicable.
     */
    const handleAuth = () => {
        const authConfig = {
            ...config,
            thoughtSpotHost: getThoughtSpotHost(config),
        };
        authPromise = authenticate(authConfig);
    };
    /**
     * Initialize the ThoughtSpot embed settings globally and perform
     * authentication if applicable.
     * @param embedConfig The configuration object containing ThoughtSpot host,
     * authentication mechanism and so on.
     */
    const init = (embedConfig) => {
        config = embedConfig;
        handleAuth();
        //initMixpanel(embedConfig);  // bdb - causes errors in this function.
    };
    /**
     * Base class for embedding v2 experience
     * Note: the v2 version of ThoughtSpot Blink is built on the new stack:
     * React+GraphQL
     */
    class TsEmbed {
        constructor(domSelector, viewConfig) {
            this.el = this.getDOMNode(domSelector);
            // TODO: handle error
            this.thoughtSpotHost = getThoughtSpotHost(config);
            this.thoughtSpotV2Base = getV2BasePath(config);
            this.eventHandlerMap = new Map();
            this.isError = false;
            this.viewConfig = viewConfig;
        }
        /**
         * Gets a reference to the root DOM node where
         * the embedded content will appear.
         * @param domSelector
         */
        getDOMNode(domSelector) {
            return typeof domSelector === 'string'
                ? document.querySelector(domSelector)
                : domSelector;
        }
        /**
         * Throws error encountered during initialization.
         */
        throwInitError() {
            this.handleError('You need to init the ThoughtSpot SDK module first');
        }
        /**
         * Handles errors within the SDK
         * @param error The error message or object
         */
        handleError(error) {
            this.isError = true;
            this.executeCallbacks(exports.EmbedEvent.Error, {
                error,
            });
            // Log error
            console.log(error);
        }
        /**
         * Extracts the type field from the event payload
         * @param event The window message event
         */
        getEventType(event) {
            var _a, _b;
            // eslint-disable-next-line no-underscore-dangle
            return ((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) || ((_b = event.data) === null || _b === void 0 ? void 0 : _b.__type);
        }
        /**
         * Adds a global event listener to window for "message" events.
         * ThoughtSpot detects if a particular event is targeted to this
         * embed instance through an identifier contained in the payload,
         * and executes the registered callbacks accordingly.
         */
        subscribeToEvents() {
            window.addEventListener('message', (event) => {
                const eventType = this.getEventType(event);
                if (event.source === this.iFrame.contentWindow) {
                    this.executeCallbacks(eventType, event.data);
                }
            });
        }
        /**
         * Constructs the base URL string to load the ThoughtSpot app.
         */
        getEmbedBasePath(queryString) {
            const basePath = [
                this.thoughtSpotHost,
                this.thoughtSpotV2Base,
                queryString,
            ]
                .filter((x) => x.length > 0)
                .join('/');
            return `${basePath}#/embed`;
        }
        /**
         * Constructs the base URL string to load v1 of the ThoughtSpot app.
         * This is used for embedding pinboards, visualizations, and full application.
         * @param queryString The query string to append to the URL.
         * @param isAppEmbed A Boolean parameter to specify if you are embedding
         * the full application.
         */
        getV1EmbedBasePath(queryString, showPrimaryNavbar = false, isAppEmbed = false) {
            const queryStringFrag = queryString ? `&${queryString}` : '';
            const primaryNavParam = `&primaryNavHidden=${!showPrimaryNavbar}`;
            const queryParams = `?embedApp=true${isAppEmbed ? primaryNavParam : ''}${queryStringFrag}`;
            let path = `${this.thoughtSpotHost}/${queryParams}#`;
            if (!isAppEmbed) {
                path = `${path}/embed`;
            }
            return path;
        }
        /**
         * Renders the embedded ThoughtSpot app in an iframe and sets up
         * event listeners.
         * @param url
         * @param frameOptions
         */
        renderIFrame(url, frameOptions) {
            if (this.isError) {
                return;
            }
            if (!this.thoughtSpotHost) {
                this.throwInitError();
            }
            if (url.length > URL_MAX_LENGTH) ;
            const initTimestamp = Date.now();
            this.executeCallbacks(exports.EmbedEvent.Init, {
                data: {
                    timestamp: initTimestamp,
                },
            });
            uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_RENDER_START);
            authPromise === null || authPromise === void 0 ? void 0 : authPromise.then(() => {
                this.executeCallbacks(exports.EmbedEvent.AuthInit, {
                    data: { isLoggedIn: isAuthenticated() },
                });
                this.iFrame = this.iFrame || document.createElement('iframe');
                this.iFrame.src = url;
                // according to screenfull.js documentation
                // allowFullscreen, webkitallowfullscreen and mozallowfullscreen must be true
                this.iFrame.allowFullscreen = true;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.iFrame.webkitallowfullscreen = true;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.iFrame.mozallowfullscreen = true;
                const width = getCssDimension((frameOptions === null || frameOptions === void 0 ? void 0 : frameOptions.width) || DEFAULT_EMBED_WIDTH);
                const height = getCssDimension((frameOptions === null || frameOptions === void 0 ? void 0 : frameOptions.height) || DEFAULT_EMBED_HEIGHT);
                this.iFrame.style.width = `${width}`;
                this.iFrame.style.height = `${height}`;
                this.iFrame.style.border = '0';
                this.iFrame.name = 'ThoughtSpot Embedded Analytics';
                this.iFrame.addEventListener('load', () => {
                    const loadTimestamp = Date.now();
                    this.executeCallbacks(exports.EmbedEvent.Load, {
                        data: {
                            timestamp: loadTimestamp,
                        },
                    });
                    uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_IFRAME_LOAD_PERFORMANCE, {
                        timeTookToLoad: loadTimestamp - initTimestamp,
                    });
                });
                this.el.innerHTML = '';
                this.el.appendChild(this.iFrame);
                this.subscribeToEvents();
            }).catch((error) => {
                this.handleError(error);
            });
        }
        /**
         * Sets the height of the iframe
         * @param height The height in pixels
         */
        setIFrameHeight(height) {
            this.iFrame.style.height = `${height}px`;
        }
        /**
         * Executes all registered event handlers for a particular event type
         * @param eventType The event type
         * @param data The payload invoked with the event handler
         */
        executeCallbacks(eventType, data) {
            const callbacks = this.eventHandlerMap.get(eventType) || [];
            callbacks.forEach((callback) => callback(data));
        }
        /**
         * Returns the ThoughtSpot hostname or IP address.
         */
        getThoughtSpotHost() {
            return this.thoughtSpotHost;
        }
        /**
         * Gets the v1 event type (if applicable) for the EmbedEvent type
         * @param eventType The v2 event type
         * @returns The corresponding v1 event type if one exists
         * or else the v2 event type itself
         */
        getCompatibleEventType(eventType) {
            return V1EventMap[eventType] || eventType;
        }
        /**
         * Registers an event listener to trigger an alert when the ThoughtSpot app
         * sends an event of a particular message type to the host application.
         *
         * @param messageType The message type
         * @param callback A callback function
         */
        on(messageType, callback) {
            if (this.isRendered) {
                this.handleError('Please register event handlers before calling render');
            }
            const callbacks = this.eventHandlerMap.get(messageType) || [];
            callbacks.push(callback);
            this.eventHandlerMap.set(messageType, callbacks);
            return this;
        }
        /**
         * Triggers an event to the embedded app
         * @param messageType The event type
         * @param data The payload to send with the message
         */
        trigger(messageType, data) {
            this.iFrame.contentWindow.postMessage({
                type: messageType,
                data,
            }, this.thoughtSpotHost);
            return this;
        }
        /**
         * Marks the ThoughtSpot object to have been rendered
         * Needs to be overridden by subclasses to do the actual
         * rendering of the iframe.
         * @param args
         */
        render() {
            this.isRendered = true;
            return this;
        }
    }
    /**
     * Base class for embedding v1 experience
     * Note: The v1 version of ThoughtSpot Blink works on the AngularJS stack
     * which is currently under migration to v2
     */
    class V1Embed extends TsEmbed {
        constructor(domSelector, viewConfig) {
            super(domSelector, viewConfig);
            this.viewConfig = viewConfig;
        }
        /**
         * Render the app in an iframe and set up event handlers
         * @param iframeSrc
         */
        renderV1Embed(iframeSrc) {
            this.renderIFrame(iframeSrc, this.viewConfig.frameParams);
        }
        // @override
        on(messageType, callback) {
            const eventType = this.getCompatibleEventType(messageType);
            return super.on(eventType, callback);
        }
    }

    /**
     * Copyright (c) 2021
     *
     * Full application embedding
     * https://docs.thoughtspot.com/visual-embed-sdk/release/en/?pageid=full-embed
     *
     * @summary Full app embed
     * @module
     * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
     */
    (function (Page) {
        /**
         * Home page
         */
        Page["Home"] = "home";
        /**
         * Search page
         */
        Page["Search"] = "search";
        /**
         * Saved answers listing page
         */
        Page["Answers"] = "answers";
        /**
         * Pinboards listing page
         */
        Page["Pinboards"] = "pinboards";
        /**
         * Data management page
         */
        Page["Data"] = "data";
    })(exports.Page || (exports.Page = {}));
    /**
     * Embeds full ThoughtSpot experience in a host application.
     * @Category App Embed
     */
    class AppEmbed extends V1Embed {
        // eslint-disable-next-line no-useless-constructor
        constructor(domSelector, viewConfig) {
            super(domSelector, viewConfig);
        }
        /**
         * Constructs a map of parameters to be passed on to the
         * embedded pinboard or visualization.
         */
        getEmbedParams() {
            const params = {};
            const { disabledActions, disabledActionReason, hiddenActions, tag, } = this.viewConfig;
            if (disabledActions === null || disabledActions === void 0 ? void 0 : disabledActions.length) {
                params[Param.DisableActions] = disabledActions;
            }
            if (disabledActionReason) {
                params[Param.DisableActionReason] = disabledActionReason;
            }
            if (hiddenActions === null || hiddenActions === void 0 ? void 0 : hiddenActions.length) {
                params[Param.HideActions] = hiddenActions;
            }
            if (tag) {
                params[Param.Tag] = tag;
            }
            const queryParams = getQueryParamString(params, true);
            return queryParams;
        }
        /**
         * Constructs the URL of the ThoughtSpot app page to be rendered.
         * @param pageId The ID of the page to be embedded.
         */
        getIFrameSrc(pageId, runtimeFilters) {
            const filterQuery = getFilterQuery(runtimeFilters || []);
            const queryParams = this.getEmbedParams();
            const queryString = [filterQuery, queryParams]
                .filter(Boolean)
                .join('&');
            const url = `${this.getV1EmbedBasePath(queryString, this.viewConfig.showPrimaryNavbar, true)}/${pageId}`;
            return url;
        }
        /**
         * Gets the ThoughtSpot route of the page for a particular page ID.
         * @param pageId The identifier for a page in the ThoughtSpot app.
         */
        getPageRoute(pageId) {
            switch (pageId) {
                case exports.Page.Search:
                    return 'answer';
                case exports.Page.Answers:
                    return 'answers';
                case exports.Page.Pinboards:
                    return 'pinboards';
                case exports.Page.Data:
                    return 'data/tables';
                case exports.Page.Home:
                default:
                    return 'home';
            }
        }
        /**
         * Formats the path provided by the user.
         * @param path The URL path.
         * @returns The URL path that the embedded app understands.
         */
        formatPath(path) {
            if (!path) {
                return null;
            }
            // remove leading slash
            if (path.indexOf('/') === 0) {
                return path.substring(1);
            }
            return path;
        }
        /**
         * Renders the embedded application pages in the ThoughtSpot app.
         * @param renderOptions An object containing the page ID
         * to be embedded.
         */
        render() {
            super.render();
            const { pageId, runtimeFilters, path } = this.viewConfig;
            const pageRoute = this.formatPath(path) || this.getPageRoute(pageId);
            const src = this.getIFrameSrc(pageRoute, runtimeFilters);
            this.renderV1Embed(src);
            return this;
        }
    }

    /**
     * Copyright (c) 2021
     *
     * Embed a ThoughtSpot pinboard or visualization
     * https://docs.thoughtspot.com/visual-embed-sdk/release/en/?pageid=embed-a-viz
     *
     * @summary Pinboard & visualization embed
     * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
     */
    /**
     * Embed a ThoughtSpot pinboard or visualization
     * @Category Pinboards and Charts
     */
    class PinboardEmbed extends V1Embed {
        // eslint-disable-next-line no-useless-constructor
        constructor(domSelector, viewConfig) {
            super(domSelector, viewConfig);
            /**
             * Set the iframe height as per the computed height received
             * from the ThoughtSpot app.
             * @param data The event payload
             */
            this.updateIFrameHeight = (data) => {
                this.setIFrameHeight(data.data);
            };
        }
        /**
         * Construct a map of params to be passed on to the
         * embedded pinboard or visualization.
         */
        getEmbedParams() {
            const params = {};
            const { disabledActions, disabledActionReason, hiddenActions, enableVizTransformations, } = this.viewConfig;
            if (disabledActions === null || disabledActions === void 0 ? void 0 : disabledActions.length) {
                params[Param.DisableActions] = disabledActions;
            }
            if (disabledActionReason) {
                params[Param.DisableActionReason] = disabledActionReason;
            }
            if (hiddenActions === null || hiddenActions === void 0 ? void 0 : hiddenActions.length) {
                params[Param.HideActions] = hiddenActions;
            }
            if (enableVizTransformations !== undefined) {
                params[Param.EnableVizTransformations] = enableVizTransformations.toString();
            }
            const queryParams = getQueryParamString(params, true);
            return queryParams;
        }
        /**
         * Construct the URL of the embedded ThoughtSpot pinboard or visualization
         * to be loaded within the iframe.
         * @param pinboardId The GUID of the pinboard.
         * @param vizId The optional GUID of a visualization within the pinboard.
         * @param runtimeFilters A list of runtime filters to be applied to
         * the pinboard or visualization on load.
         */
        getIFrameSrc(pinboardId, vizId, runtimeFilters) {
            const filterQuery = getFilterQuery(runtimeFilters || []);
            const queryParams = this.getEmbedParams();
            const queryString = [filterQuery, queryParams]
                .filter(Boolean)
                .join('&');
            let url = `${this.getV1EmbedBasePath(queryString, true, false)}/viz/${pinboardId}`;
            if (vizId) {
                url = `${url}/${vizId}`;
            }
            return url;
        }
        /**
         * Render an embedded ThoughtSpot pinboard or visualization
         * @param renderOptions An object specifying the pinboard ID,
         * visualization ID and the runtime filters.
         */
        render() {
            const { pinboardId, vizId, runtimeFilters } = this.viewConfig;
            if (!pinboardId && !vizId) {
                this.handleError(ERROR_MESSAGE.PINBOARD_VIZ_ID_VALIDATION);
            }
            if (this.viewConfig.fullHeight === true) {
                this.on(exports.EmbedEvent.EmbedHeight, this.updateIFrameHeight);
            }
            super.render();
            const src = this.getIFrameSrc(pinboardId, vizId, runtimeFilters);
            this.renderV1Embed(src);
            return this;
        }
    }

    /**
     * Copyright (c) 2021
     *
     * Embed ThoughtSpot search or a saved answer
     *
     * @summary Search embed
     * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
     */
    /**
     * Embed ThoughtSpot search
     *
     * @Category Search Embed
     */
    class SearchEmbed extends TsEmbed {
        constructor(domSelector, viewConfig) {
            super(domSelector);
            this.viewConfig = viewConfig;
        }
        /**
         * Get the state of the data sources panel that the embedded
         * ThoughtSpot search will be initialized with.
         */
        getDataSourceMode() {
            let dataSourceMode = exports.DataSourceVisualMode.Expanded;
            if (this.viewConfig.collapseDataSources === true) {
                dataSourceMode = exports.DataSourceVisualMode.Collapsed;
            }
            if (this.viewConfig.hideDataSources === true) {
                dataSourceMode = exports.DataSourceVisualMode.Hidden;
            }
            return dataSourceMode;
        }
        /**
         * Construct the URL of the embedded ThoughtSpot search to be
         * loaded in the iframe
         * @param answerId The GUID of a saved answer
         * @param dataSources A list of data source GUIDs
         * @param searchQuery A search query to be generated on load
         */
        getIFrameSrc(answerId, dataSources, searchQuery) {
            const { disabledActions, disabledActionReason, hiddenActions, hideResults, enableSearchAssist, searchOptions, } = this.viewConfig;
            const answerPath = answerId ? `saved-answer/${answerId}` : 'answer';
            const queryParams = {};
            if (dataSources && dataSources.length) {
                queryParams[Param.DataSources] = JSON.stringify(dataSources);
            }
            if (searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.searchTokenString) {
                queryParams[Param.searchTokenString] = encodeURIComponent(searchOptions.searchTokenString);
                if (searchOptions.executeSearch) {
                    queryParams[Param.executeSearch] = true;
                }
            }
            if (searchQuery) {
                queryParams[Param.SearchQuery] = encodeURIComponent(searchQuery);
            }
            if (enableSearchAssist) {
                queryParams[Param.EnableSearchAssist] = true;
            }
            if (hideResults) {
                queryParams[Param.HideResult] = true;
            }
            if (disabledActions === null || disabledActions === void 0 ? void 0 : disabledActions.length) {
                queryParams[Param.DisableActions] = disabledActions;
            }
            if (disabledActionReason) {
                queryParams[Param.DisableActionReason] = disabledActionReason;
            }
            if (hiddenActions === null || hiddenActions === void 0 ? void 0 : hiddenActions.length) {
                queryParams[Param.HideActions] = hiddenActions;
            }
            queryParams[Param.DataSourceMode] = this.getDataSourceMode();
            queryParams[Param.UseLastSelectedDataSource] = false;
            let query = '';
            const queryParamsString = getQueryParamString(queryParams, true);
            if (queryParamsString) {
                query = `?${queryParamsString}`;
            }
            return `${this.getEmbedBasePath(query)}/${answerPath}`;
        }
        /**
         * Render the embedded ThoughtSpot search
         */
        render() {
            super.render();
            const { answerId, dataSources, searchQuery } = this.viewConfig;
            const src = this.getIFrameSrc(answerId, dataSources, searchQuery);
            this.renderIFrame(src, this.viewConfig.frameParams);
            return this;
        }
    }

    exports.AppEmbed = AppEmbed;
    exports.PinboardEmbed = PinboardEmbed;
    exports.SearchEmbed = SearchEmbed;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
