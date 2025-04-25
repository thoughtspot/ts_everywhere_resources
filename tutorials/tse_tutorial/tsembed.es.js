/**
 * Copyright (c) 2023
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
function getRedirectUrl(url, stringToAppend, path = '') {
    const targetUrl = path ? new URL(path, window.location.origin).href : url;
    return appendToUrlHash(targetUrl, stringToAppend);
}
const getEncodedQueryParamsString = (queryString) => {
    if (!queryString) {
        return queryString;
    }
    return btoa(queryString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};
const getOffsetTop = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY;
};
const embedEventStatus = {
    START: 'start',
    END: 'end',
};
const setAttributes = (element, attributes) => {
    Object.keys(attributes).forEach((key) => {
        element.setAttribute(key, attributes[key].toString());
    });
};
const isCloudRelease = (version) => version.endsWith('.cl');
/* For Search Embed: ReleaseVersionInBeta */
const checkReleaseVersionInBeta = (releaseVersion, suppressBetaWarning) => {
    if (releaseVersion !== '' && !isCloudRelease(releaseVersion)) {
        const splittedReleaseVersion = releaseVersion.split('.');
        const majorVersion = Number(splittedReleaseVersion[0]);
        const isBetaVersion = majorVersion < 8;
        return !suppressBetaWarning && isBetaVersion;
    }
    return false;
};
const getCustomisations = (embedConfig, viewConfig) => {
    var _a, _b, _c, _d;
    const customCssUrlFromEmbedConfig = embedConfig.customCssUrl;
    const customizationsFromViewConfig = viewConfig.customizations;
    const customizationsFromEmbedConfig = embedConfig.customizations ||
        embedConfig.customisations;
    const customizations = {
        style: {
            ...customizationsFromEmbedConfig === null || customizationsFromEmbedConfig === void 0 ? void 0 : customizationsFromEmbedConfig.style,
            ...customizationsFromViewConfig === null || customizationsFromViewConfig === void 0 ? void 0 : customizationsFromViewConfig.style,
            customCSS: {
                ...(_a = customizationsFromEmbedConfig === null || customizationsFromEmbedConfig === void 0 ? void 0 : customizationsFromEmbedConfig.style) === null || _a === void 0 ? void 0 : _a.customCSS,
                ...(_b = customizationsFromViewConfig === null || customizationsFromViewConfig === void 0 ? void 0 : customizationsFromViewConfig.style) === null || _b === void 0 ? void 0 : _b.customCSS,
            },
            customCSSUrl: ((_c = customizationsFromViewConfig === null || customizationsFromViewConfig === void 0 ? void 0 : customizationsFromViewConfig.style) === null || _c === void 0 ? void 0 : _c.customCSSUrl) ||
                ((_d = customizationsFromEmbedConfig === null || customizationsFromEmbedConfig === void 0 ? void 0 : customizationsFromEmbedConfig.style) === null || _d === void 0 ? void 0 : _d.customCSSUrl) ||
                customCssUrlFromEmbedConfig,
        },
        content: {
            ...customizationsFromEmbedConfig === null || customizationsFromEmbedConfig === void 0 ? void 0 : customizationsFromEmbedConfig.content,
            ...customizationsFromViewConfig === null || customizationsFromViewConfig === void 0 ? void 0 : customizationsFromViewConfig.content,
        },
    };
    return customizations;
};
/**
 * Gets a reference to the DOM node given
 * a selector.
 * @param domSelector
 */
function getDOMNode(domSelector) {
    return typeof domSelector === 'string'
        ? document.querySelector(domSelector)
        : domSelector;
}

/**
 * Copyright (c) 2023
 *
 * TypeScript type definitions for ThoughtSpot Visual Embed SDK
 *
 * @summary Type definitions for Embed SDK
 * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
 */
/**
 * The authentication mechanism for allowing access to the
 * the embedded app
 */
// eslint-disable-next-line no-shadow
var AuthType;
(function (AuthType) {
    /**
     * No authentication on the SDK. Passthrough to the embedded App. Alias for `Passthrough`.
     */
    AuthType["None"] = "None";
    /**
     * Passthrough SSO to the embedded App within the iframe. Requires least configuration, but may not
     * be supported by all IDPs. This will behave like `None` if SSO is not configured on ThoughtSpot.
     * @version: SDK: 1.15.0 | ThouhgtSpot: 8.8.0.cl
     */
    AuthType["EmbeddedSSO"] = "EmbeddedSSO";
    /**
     * SSO using SAML
     * @deprecated Use {@link SAMLRedirect} instead
     * @hidden
     */
    AuthType["SSO"] = "SSO_SAML";
    /**
     * SSO using SAML
     * @deprecated Use {@link SAMLRedirect} instead
     * @hidden
     */
    AuthType["SAML"] = "SSO_SAML";
    /**
     * SSO using SAML
     * Will make the host application redirect to the SAML Idp.
     */
    AuthType["SAMLRedirect"] = "SSO_SAML";
    /**
     * SSO using OIDC
     * @hidden
     * @deprecated Use {@link OIDCRedirect} instead
     */
    AuthType["OIDC"] = "SSO_OIDC";
    /**
     * SSO using OIDC
     * Will make the host application redirect to the OIDC Idp.
     */
    AuthType["OIDCRedirect"] = "SSO_OIDC";
    /**
     * Trusted authentication server
     * @hidden
     * @deprecated Use {@link TrustedAuth} instead
     */
    AuthType["AuthServer"] = "AuthServer";
    /**
     * Trusted authentication server, Use you own authentication server
     * which returns a bearer token, generated using the secret_key obtained from
     * ThoughtSpot.
     */
    AuthType["TrustedAuthToken"] = "AuthServer";
    /**
     * Use the ThoughtSpot login API to authenticate to the cluster directly.
     *
     * Warning: This feature is primarily intended for developer testing. It is
     * strongly advised not to use this authentication method in production.
     */
    AuthType["Basic"] = "Basic";
})(AuthType || (AuthType = {}));
/**
 * A map of the supported runtime filter operations
 */
// eslint-disable-next-line no-shadow
var RuntimeFilterOp;
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
})(RuntimeFilterOp || (RuntimeFilterOp = {}));
/**
 * Event types emitted by the embedded ThoughtSpot application.
 */
// eslint-disable-next-line no-shadow
var EmbedEvent;
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
     * The embed object container has loaded.
     * @return timestamp - The timestamp when the event was generated.
     */
    EmbedEvent["Load"] = "load";
    /**
     * Data pertaining to answer or Liveboard is received
     * @return data - The answer or Liveboard data
     */
    EmbedEvent["Data"] = "data";
    /**
     * Search/answer/Liveboard filters have been applied/updated
     * @hidden
     */
    EmbedEvent["FiltersChanged"] = "filtersChanged";
    /**
     * Search query has been updated
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
     * One or more data columns have been selected.
     * @return columnIds - the list of columns
     * @version SDK: 1.10.0 | ThoughtSpot: 8.2.0.cl, 8.4.1-sw
     */
    EmbedEvent["AddRemoveColumns"] = "addRemoveColumns";
    /**
     * A custom action has been triggered
     * @return actionId - The id of the custom action
     * @return data - The answer or Liveboard data
     */
    EmbedEvent["CustomAction"] = "customAction";
    /**
     * A double click has been triggered on table/chart
     * @return ContextMenuInputPoints - data point that is double clicked
     * @version SDK: 1.5.0 | ThoughtSpot: ts7.oct.cl, 7.2.1
     */
    EmbedEvent["VizPointDoubleClick"] = "vizPointDoubleClick";
    /**
     * A click has been triggered on table/chart
     * @return ContextMenuInputPoints - data point that is clicked
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["VizPointClick"] = "vizPointClick";
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
     */
    EmbedEvent["AuthExpire"] = "ThoughtspotAuthExpired";
    /**
     * ThoughtSpot failed to validate the auth session.
     * @hidden
     */
    EmbedEvent["AuthFailure"] = "ThoughtspotAuthFailure";
    /**
     * ThoughtSpot failed to validate the auth session.
     * @hidden
     */
    EmbedEvent["AuthLogout"] = "ThoughtspotAuthLogout";
    /**
     * The height of the embedded Liveboard or visualization has been computed.
     * @return data - The height of the embedded Liveboard or visualization
     * @hidden
     */
    EmbedEvent["EmbedHeight"] = "EMBED_HEIGHT";
    /**
     * The center of visible iframe viewport is calculated.
     * @return data - The center of the visible Iframe viewport.
     * @hidden
     */
    EmbedEvent["EmbedIframeCenter"] = "EmbedIframeCenter";
    /**
     * Detects the route change.
     */
    EmbedEvent["RouteChange"] = "ROUTE_CHANGE";
    /**
     * The v1 event type for Data
     * @hidden
     */
    EmbedEvent["V1Data"] = "exportVizDataToParent";
    /**
     * Emitted when the embed does not have cookie access. This
     * happens on Safari where third-party cookies are blocked by default.
     *
     * @version SDK: 1.1.0 | ThoughtSpot: ts7.may.cl, 7.2.1
     */
    EmbedEvent["NoCookieAccess"] = "noCookieAccess";
    /**
     * Emitted when SAML is complete
     * @private
     * @hidden
     */
    EmbedEvent["SAMLComplete"] = "samlComplete";
    /**
     * Emitted when any modal is opened in the app
     * @version SDK: 1.6.0 | ThoughtSpot: ts8.nov.cl, 8.4.1-sw
     */
    EmbedEvent["DialogOpen"] = "dialog-open";
    /**
     * Emitted when any modal is closed in the app
     * @version SDK: 1.6.0 | ThoughtSpot: ts8.nov.cl, 8.4.1-sw
     */
    EmbedEvent["DialogClose"] = "dialog-close";
    /**
     * Emitted when the Liveboard shell loads.
     * You can use this event as a hook to trigger
     * other events on the rendered Liveboard.
     * @version SDK: 1.9.1 | ThoughtSpot: 8.1.0.cl, 8.4.1-sw
     */
    EmbedEvent["LiveboardRendered"] = "PinboardRendered";
    /**
     * This can be used to register an event listener which
     * is triggered on all events.
     * @Version SDK: 1.10.0 | ThoughtSpot: 8.2.0.cl, 8.4.1-sw
     */
    EmbedEvent["ALL"] = "*";
    /**
     * Emitted when answer is saved in the app
     * @Version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["Save"] = "save";
    /**
     * Emitted when the download action is triggered on an answer
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["Download"] = "download";
    /**
     * Emitted when the Download as PDF action is triggered on an answer
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["DownloadAsPdf"] = "downloadAsPdf";
    /**
     * Emitted when the Download as CSV action is triggered on an answer
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["DownloadAsCsv"] = "downloadAsCsv";
    /**
     * Emitted when the Download as XLSX action is triggered on an answer
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["DownloadAsXlsx"] = "downloadAsXlsx";
    /**
     * Emitted when an answer is deleted in the app
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["AnswerDelete"] = "answerDelete";
    /**
     * Emitted when an answer is pinned to a Liveboard
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["Pin"] = "pin";
    /**
     * Emitted when SpotIQ analysis is triggered
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["SpotIQAnalyze"] = "spotIQAnalyze";
    /**
     * Emitted when a user shares an object with another user or group
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["Share"] = "share";
    /**
     * Emitted when a user clicks the Include action to include a specific value or data on a chart or table
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["DrillInclude"] = "context-menu-item-include";
    /**
     * Emitted when a user clicks the Exclude action to exclude a specific value or data on a chart or table
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["DrillExclude"] = "context-menu-item-exclude";
    /**
     * Emitted when copied column value on the app
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["CopyToClipboard"] = "context-menu-item-copy-to-clipboard";
    /**
     * Emitted when a user clicks the Update TML action
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["UpdateTML"] = "updateTSL";
    /**
     * Emitted when a user clicks the Edit TML action
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["EditTML"] = "editTSL";
    /**
     * Emitted when ExportTML trigger in answer on the app
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["ExportTML"] = "exportTSL";
    /**
     * Emitted when an answer is saved as a view
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["SaveAsView"] = "saveAsView";
    /**
     * Emitted when copy of existing answer on the app
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["CopyAEdit"] = "copyAEdit";
    /**
     * Emitted when a user clicks Show underlying data on an answe
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["ShowUnderlyingData"] = "showUnderlyingData";
    /**
     * Emitted when an answer is switched to a chart or table view
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    EmbedEvent["AnswerChartSwitcher"] = "answerChartSwitcher";
    /**
     * Internal event to communicate the initial settings back to the TS APP
     * @hidden
     */
    EmbedEvent["APP_INIT"] = "appInit";
    /**
     * Emitted when a user clicks Show Liveboard details on a Liveboard
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["LiveboardInfo"] = "pinboardInfo";
    /**
     * Emitted when a user clicks on the Favorite icon on a Liveboard
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["AddToFavorites"] = "addToFavorites";
    /**
     * Emitted when a user clicks Schedule on a Liveboard
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["Schedule"] = "subscription";
    /**
     * Emitted when a user clicks Edit on a Liveboard or visualization
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["Edit"] = "edit";
    /**
     * Emitted when a user clicks Make a copy on a Liveboard
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["MakeACopy"] = "makeACopy";
    /**
     * Emitted when a user clicks Present on a Liveboard or visualization
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["Present"] = "present";
    /**
     * Emitted when a user clicks Delete on a Liveboard
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["Delete"] = "delete";
    /**
     * Emitted when a user clicks Manage schedules on a Liveboard
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["SchedulesList"] = "schedule-list";
    /**
     * Emitted when a user clicks Cancel in edit mode on a Liveboard
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["Cancel"] = "cancel";
    /**
     * Emitted when a user clicks Explore on a visualization
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["Explore"] = "explore";
    /**
     * Emitted when a user clicks Copy link action on a visualization
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    EmbedEvent["CopyLink"] = "embedDocument";
})(EmbedEvent || (EmbedEvent = {}));
/**
 * Event types that can be triggered by the host application
 * to the embedded ThoughtSpot app
 *
 * To trigger an event use the corresponding
 * {@link LiveboardEmbed.trigger} or {@link AppEmbed.trigger} or {@link SearchEmbed.trigger} method.
 */
// eslint-disable-next-line no-shadow
var HostEvent;
(function (HostEvent) {
    /**
     * Trigger a search
     * @param - dataSourceIds - The list of data source GUIDs
     * @param - searchQuery - The search query
     * @example
     * searchEmbed.trigger(HostEvent.Search, {
     * searchQuery: "[sales] by [item type],
     * "dataSourceIds: ["cd252e5c-b552-49a8-821d-3eadaa049cca"]
     * })
     */
    HostEvent["Search"] = "search";
    /**
     * Trigger a drill on certain points by certain column
     * @param - points - an object containing selectedPoints/clickedPoints
     *              eg. { selectedPoints: []}
     * @param - columnGuid - a string guid of the column to drill by. This is optional,
     *                     if not provided it will auto drill by the configured column.
     * @example searchEmbed.trigger(HostEvent.DrillDown, {
     * points: clickedPointData,
     * autoDrillDown: true,
     * })
     * @version SDK: 1.5.0 | ThoughtSpot: ts7.oct.cl, 7.2.1
     */
    HostEvent["DrillDown"] = "triggerDrillDown";
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
    /**
     * Set the visible visualizations on a Liveboard.
     * @param - an array of ids of visualizations to show, the ids not passed
     *          will be hidden.
     * @example
     * liveboardEmbed.trigger(HostEvent.SetVisibleVizs, ['730496d6-6903-4601-937e-2c691821af3c', 'd547ec54-2a37-4516-a222-2b06719af726'])
     * @version SDK: 1.6.0 | ThoughtSpot: ts8.nov.cl, 8.4.1-sw
     */
    HostEvent["SetVisibleVizs"] = "SetPinboardVisibleVizs";
    /**
     * Update the runtime filters. The runtime filters passed here are extended
     * on to the existing runtime filters if they exist.
     * @param - {@link RuntimeFilter}[] an array of {@link RuntimeFilter} Types.
     * @example
     * liveboardEmbed.trigger(HostEvent.UpdateRuntimeFilters, [
     * {columnName: "state",operator: RuntimeFilterOp.EQ,values: ["michigan"]},
     * {columnName: "item type",operator: RuntimeFilterOp.EQ,values: ["Jackets"]}
     * ])
     * @version SDK: 1.9.0 | ThoughtSpot: 8.1.0.cl, 8.4.1-sw
     */
    HostEvent["UpdateRuntimeFilters"] = "UpdateRuntimeFilters";
    /**
     * Navigate to a specific page in App embed without any reload.
     * This is the same as calling `appEmbed.navigateToPage(path, true)`
     * @param - path - the path to navigate to (can be a number[1/-1] to go forward/back)
     * @example appEmbed.navigateToPage(-1)
     * @version SDK: 1.12.0 | ThoughtSpot 8.4.0.cl, 8.4.1-sw
     */
    HostEvent["Navigate"] = "Navigate";
    /**
     * Gets the current pinboard content.
     * @example liveboardEmbed.trigger(HostEvent.getExportRequestForCurrentPinboard)
     * @version SDK: 1.13.0 | ThoughtSpot: 8.5.0.cl, 8.8.1-sw
     */
    HostEvent["getExportRequestForCurrentPinboard"] = "getExportRequestForCurrentPinboard";
    /**
     * Triggers the Pin action on an embedded object
     * @param - incase of Liveboard embed, takes in an object with vizId as a key
     * can be left empty for search and visualization embeds
     * @example
     * liveboardEmbed.trigger(HostEvent.Pin, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.Pin)
     * searchEmbed.trigger(HostEvent.Pin)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["Pin"] = "pin";
    /**
     * Triggers the Show Liveboard details action on a Liveboard
     * @example liveboardEmbed.trigger(HostEvent.LiveboardInfo)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["LiveboardInfo"] = "pinboardInfo";
    /**
     * Triggers the Schedule action on a Liveboard
     * @example liveboardEmbed.trigger(HostEvent.Schedule)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["Schedule"] = "subscription";
    /**
     * Triggers the Manage schedule action on a Liveboard
     * @example liveboardEmbed.trigger(HostEvent.ScheduleList)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["SchedulesList"] = "schedule-list";
    /**
     * Triggers the Export TML action on a Liveboard
     * @example liveboardEmbed.trigger(HostEvent.ExportTML)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["ExportTML"] = "exportTSL";
    /**
     * Triggers the Edit TML action on a Liveboard
     * @example liveboardEmbed.trigger(HostEvent.EditTML)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["EditTML"] = "editTSL";
    /**
     * Triggers the Update TML action on a Liveboard
     * @example liveboardEmbed.trigger(HostEvent.UpdateTML)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["UpdateTML"] = "updateTSL";
    /**
     * Triggers the Download PDF action on a Liveboard
     * @example liveboardEmbed.trigger(HostEvent.DownloadAsPDF)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["DownloadAsPdf"] = "downloadAsPdf";
    /**
     * Triggers the Make a copy action on a Liveboard, search or visualization
     * @example
     * liveboardEmbed.trigger(HostEvent.MakeACopy, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.MakeACopy)
     * searchEmbed.trigger(HostEvent.MakeACopy)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["MakeACopy"] = "makeACopy";
    /**
     * Triggers the Delete action on a Liveboard
     * @example appEmbed.trigger(HostEvent.Remove)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["Remove"] = "delete";
    /**
     * Triggers the Explore action on a visualization
     * @param - an object with vizId as a key
     * @example liveboardEmbed.trigger(HostEvent.Explore, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["Explore"] = "explore";
    /**
     * Triggers the Create alert action on a visualization
     * @param - an object with vizId as a key
     * @example liveboardEmbed.trigger(HostEvent.CreateMonitor {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["CreateMonitor"] = "createMonitor";
    /**
     * Triggers the Manage alert action on a visualization
     * @param - an object with vizId as a key
     * @example liveboardEmbed.trigger(HostEvent.ManageMonitor, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["ManageMonitor"] = "manageMonitor";
    /**
     * Triggers the Edit action on a Liveboard or visualization
     * @param - object - to trigger the action for a specfic visualization in Liveboard embed, pass in vizId as a key
     * @example
     * liveboardEmbed.trigger(HostEvent.Edit)
     * liveboardEmbed.trigger(HostEvent.Edit, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger((HostEvent.Edit)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["Edit"] = "edit";
    /**
     * Triggers the Copy link action on a Liveboard or visualization
     * @param - object - to trigger the action for a specfic visualization in Liveboard embed, pass in vizId as a key
     * @example
     * liveboardEmbed.trigger(HostEvent.CopyLink)
     * liveboardEmbed.trigger(HostEvent.CopyLink, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger((HostEvent.CopyLink)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["CopyLink"] = "embedDocument";
    /**
     * Triggers the Present action on a Liveboard or visualization
     * @param - object - to trigger the action for a specfic visualization in Liveboard embed, pass in vizId as a key
     * @example
     * liveboardEmbed.trigger(HostEvent.Present)
     * liveboardEmbed.trigger(HostEvent.Present, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger((HostEvent.Present)
     * @version SDK: 1.15.0 | ThoughtSpot: 8.7.0.cl, 8.8.1-sw
     */
    HostEvent["Present"] = "present";
    /**
     * Get TML for the current search.
     * @example searchEmbed.trigger(HostEvent.GetTML)
     * @version SDK: 1.18.0 | ThoughtSpot: 8.10.0.cl, 9.0.1-sw
     */
    HostEvent["GetTML"] = "getTML";
    /**
     * Triggers the ShowUnderlyingData action on visualization or search
     * @param - an object with vizId as a key
     * @example
     * liveboardEmbed.trigger(HostEvent.ShowUnderlyingData, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.ShowUnderlyingData)
     * searchEmbed.trigger(HostEvent.ShowUnderlyingData)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["ShowUnderlyingData"] = "showUnderlyingData";
    /**
     * Triggers the Delete action on visualization or search
     * @param - incase of Liveboard embed, takes in an object with vizId as a key
     * can be left empty for search and visualization embeds
     * @example
     * liveboardEmbed.trigger(HostEvent.Delete, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.Delete)
     * searchEmbed.trigger(HostEvent.Delete)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["Delete"] = "delete";
    /**
     * Triggers the SpotIQAnalyze action on visualization or search
     * @param - incase of Liveboard embed, takes in an object with vizId as a key
     * can be left empty for search and visualization embeds
     * @example
     * liveboardEmbed.trigger(HostEvent.SpotIQAnalyze, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.SpotIQAnalyze)
     * searchEmbed.trigger(HostEvent.SpotIQAnalyze)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["SpotIQAnalyze"] = "spotIQAnalyze";
    /**
     * Triggers the Download action on visualization or search when Displaymode is Chart
     * @example
     * liveboardEmbed.trigger(HostEvent.Download, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.Download)
     * searchEmbed.trigger(HostEvent.Download)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["Download"] = "download";
    /**
     * Triggers the downloadAsCSV action on visualization or search when Displaymode is Table
     * @example
     * liveboardEmbed.trigger(HostEvent.DownloadAsCsv, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.DownloadAsCsv)
     * searchEmbed.trigger(HostEvent.DownloadAsCsv)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["DownloadAsCsv"] = "downloadAsCSV";
    /**
     * Triggers the downloadAsXLSX action on visualization or search when Displaymode is Table
     * @example
     * liveboardEmbed.trigger(HostEvent.DownloadAsXlsx, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.DownloadAsXlsx)
     * searchEmbed.trigger(HostEvent.DownloadAsXlsx)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["DownloadAsXlsx"] = "downloadAsXLSX";
    /**
     * Triggers the Share action on a liveboard or answer
     * @example
     * liveboardEmbed.trigger(HostEvent.Share)
     * searchEmbed.trigger(HostEvent.Share)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["Share"] = "share";
    /**
     * Trigger the Save action on a liveboard or answer
     * @example
     * liveboardEmbed.trigger(HostEvent.Save)
     * searchEmbed.trigger(HostEvent.Save)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["Save"] = "save";
    /**
     * Triggers the SyncToSheets action on visualization
     * @param - an object with vizId as a key
     * @example
     * liveboardEmbed.trigger(HostEvent.SyncToSheets, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.SyncToSheets)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["SyncToSheets"] = "sync-to-sheets";
    /**
     * Triggers the SyncToOtherApps action on visualization
     * @param - an object with vizId as a key
     * @example
     * liveboardEmbed.trigger(HostEvent.SyncToOtherApps, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.SyncToOtherApps)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["SyncToOtherApps"] = "sync-to-other-apps";
    /**
     * Triggers the ManagePipelines action on visualization
     * @param - an object with vizId as a key
     * @example
     * liveboardEmbed.trigger(HostEvent.ManagePipelines, {vizId: '730496d6-6903-4601-937e-2c691821af3c'})
     * vizEmbed.trigger(HostEvent.ManagePipelines)
     * @version SDK: 1.19.0 | ThoughtSpot: 9.0.0.cl, 9.0.1-sw
     */
    HostEvent["ManagePipelines"] = "manage-pipeline";
})(HostEvent || (HostEvent = {}));
/**
 * The different visual modes that the data sources panel within
 * search could appear in, i.e., hidden, collapsed, or expanded.
 */
// eslint-disable-next-line no-shadow
var DataSourceVisualMode;
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
})(DataSourceVisualMode || (DataSourceVisualMode = {}));
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
    Param["ForceTable"] = "forceTable";
    Param["preventLiveboardFilterRemoval"] = "preventPinboardFilterRemoval";
    Param["SearchQuery"] = "searchQuery";
    Param["HideActions"] = "hideAction";
    Param["HideObjects"] = "hideObjects";
    Param["HostAppUrl"] = "hostAppUrl";
    Param["EnableVizTransformations"] = "enableVizTransform";
    Param["EnableSearchAssist"] = "enableSearchAssist";
    Param["HideResult"] = "hideResult";
    Param["UseLastSelectedDataSource"] = "useLastSelectedSources";
    Param["Tag"] = "tag";
    Param["searchTokenString"] = "searchTokenString";
    Param["executeSearch"] = "executeSearch";
    Param["fullHeight"] = "isFullHeightPinboard";
    Param["livedBoardEmbed"] = "isLiveboardEmbed";
    Param["searchEmbed"] = "isSearchEmbed";
    Param["vizEmbed"] = "isVizEmbed";
    Param["Version"] = "sdkVersion";
    Param["ViewPortHeight"] = "viewPortHeight";
    Param["ViewPortWidth"] = "viewPortWidth";
    Param["VisibleActions"] = "visibleAction";
    Param["CustomCSSUrl"] = "customCssUrl";
    Param["DisableLoginRedirect"] = "disableLoginRedirect";
    Param["visibleVizs"] = "pinboardVisibleVizs";
    Param["LiveboardV2Enabled"] = "isPinboardV2Enabled";
    Param["ShowAlerts"] = "showAlerts";
    Param["Locale"] = "locale";
    Param["CustomStyle"] = "customStyle";
    Param["ForceSAMLAutoRedirect"] = "forceSAMLAutoRedirect";
    // eslint-disable-next-line @typescript-eslint/no-shadow
    Param["AuthType"] = "authType";
})(Param || (Param = {}));
/**
 * The list of actions that can be performed on visual ThoughtSpot
 * entities, such as answers and Liveboards.
 */
// eslint-disable-next-line no-shadow
var Action;
(function (Action) {
    Action["Save"] = "save";
    /**
     * @hidden
     */
    Action["Update"] = "update";
    /**
     * @hidden
     */
    Action["SaveUntitled"] = "saveUntitled";
    Action["SaveAsView"] = "saveAsView";
    Action["MakeACopy"] = "makeACopy";
    Action["EditACopy"] = "editACopy";
    Action["CopyLink"] = "embedDocument";
    /**
     * @hidden
     */
    Action["ResetLayout"] = "resetLayout";
    Action["Schedule"] = "subscription";
    Action["SchedulesList"] = "schedule-list";
    Action["Share"] = "share";
    Action["AddFilter"] = "addFilter";
    Action["ConfigureFilter"] = "configureFilter";
    /**
     * @hidden
     */
    Action["AddFormula"] = "addFormula";
    /**
     * @hidden
     */
    Action["SearchOnTop"] = "searchOnTop";
    Action["SpotIQAnalyze"] = "spotIQAnalyze";
    /**
     * @hidden
     */
    Action["ExplainInsight"] = "explainInsight";
    /**
     * @hidden
     */
    Action["SpotIQFollow"] = "spotIQFollow";
    Action["ShareViz"] = "shareViz";
    /**
     * @hidden
     */
    Action["ReplaySearch"] = "replaySearch";
    Action["ShowUnderlyingData"] = "showUnderlyingData";
    Action["Download"] = "download";
    Action["DownloadAsPdf"] = "downloadAsPdf";
    Action["DownloadAsCsv"] = "downloadAsCSV";
    Action["DownloadAsXlsx"] = "downloadAsXLSX";
    /**
     * @hidden
     */
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
    /**
     * @hidden
     */
    Action["Ungroup"] = "ungroup";
    /**
     * @hidden
     */
    Action["Describe"] = "describe";
    /**
     * @hidden
     */
    Action["Relate"] = "relate";
    /**
     * @hidden
     */
    Action["CustomizeHeadlines"] = "customizeHeadlines";
    /**
     * @hidden
     */
    Action["PinboardInfo"] = "pinboardInfo";
    Action["LiveboardInfo"] = "pinboardInfo";
    /**
     * @hidden
     */
    Action["SendAnswerFeedback"] = "sendFeedback";
    /**
     * @hidden
     */
    Action["DownloadEmbraceQueries"] = "downloadEmbraceQueries";
    Action["Pin"] = "pin";
    /**
     * @hidden
     */
    Action["AnalysisInfo"] = "analysisInfo";
    Action["Subscription"] = "subscription";
    Action["Explore"] = "explore";
    Action["DrillInclude"] = "context-menu-item-include";
    Action["DrillExclude"] = "context-menu-item-exclude";
    Action["CopyToClipboard"] = "context-menu-item-copy-to-clipboard";
    Action["CopyAndEdit"] = "context-menu-item-copy-and-edit";
    /**
     * @hidden
     */
    Action["DrillEdit"] = "context-menu-item-edit";
    Action["EditMeasure"] = "context-menu-item-edit-measure";
    Action["Separator"] = "context-menu-item-separator";
    /**
     * @hidden
     */
    Action["DrillDown"] = "DRILL";
    Action["RequestAccess"] = "requestAccess";
    Action["QueryDetailsButtons"] = "queryDetailsButtons";
    /**
     * @version SDK: 1.9.0 | ThoughtSpot: 8.1.0.cl, 8.4.1-sw
     */
    Action["AnswerDelete"] = "onDeleteAnswer";
    /**
     * @version SDK: 1.9.0 | ThoughtSpot: 8.1.0.cl, 8.4.1-sw
     */
    Action["AnswerChartSwitcher"] = "answerChartSwitcher";
    /**
     * @version SDK: 1.9.0 | ThoughtSpot: 8.1.0.cl, 8.4.1-sw
     */
    Action["AddToFavorites"] = "addToFavorites";
    /**
     * @version SDK: 1.9.0 | ThoughtSpot: 8.1.0.cl, 8.4.1-sw
     */
    Action["EditDetails"] = "editDetails";
    /**
     * @version SDK: 1.11.0 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    Action["CreateMonitor"] = "createMonitor";
    /**
     * @version SDK: 1.11.1 | ThoughtSpot: 8.3.0.cl, 8.4.1-sw
     */
    Action["ReportError"] = "reportError";
    Action["SyncToSheets"] = "sync-to-sheets";
    Action["SyncToOtherApps"] = "sync-to-other-apps";
    Action["ManagePipelines"] = "manage-pipeline";
})(Action || (Action = {}));
// eslint-disable-next-line no-shadow
var OperationType;
(function (OperationType) {
    OperationType["GetChartWithData"] = "GetChartWithData";
    OperationType["GetTableWithHeadlineData"] = "GetTableWithHeadlineData";
})(OperationType || (OperationType = {}));
var PrefetchFeatures;
(function (PrefetchFeatures) {
    PrefetchFeatures["FullApp"] = "FullApp";
    PrefetchFeatures["SearchEmbed"] = "SearchEmbed";
    PrefetchFeatures["LiveboardEmbed"] = "LiveboardEmbed";
    PrefetchFeatures["VizEmbed"] = "VizEmbed";
})(PrefetchFeatures || (PrefetchFeatures = {}));

const ERROR_MESSAGE = {
    INVALID_THOUGHTSPOT_HOST: 'Error parsing ThoughtSpot host. Please provide a valid URL.',
    LIVEBOARD_VIZ_ID_VALIDATION: 'Please provide either liveboardId or pinboardId',
    TRIGGER_TIMED_OUT: 'Trigger timedout in getting response',
    SEARCHEMBED_BETA_WRANING_MESSAGE: 'Search Embed is in Beta in this release.',
};

/**
 * Copyright (c) 2023
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
    // This is to handle when e2e's. Search is run on pods for comp-blink-test-pipeline
    // with baseUrl=https://localhost:8443.
    // This is to handle when the developer is developing in their local environment.
    if (tsHost.includes('://localhost') && !tsHost.includes(':8443')) {
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

var Config = {
    DEBUG: false,
    LIB_VERSION: '2.45.0'
};

// since es6 imports are static and we run unit tests from the console, window won't be defined when importing this file
var window$1;
if (typeof(window) === 'undefined') {
    var loc = {
        hostname: ''
    };
    window$1 = {
        navigator: { userAgent: '' },
        document: {
            location: loc,
            referrer: ''
        },
        screen: { width: 0, height: 0 },
        location: loc
    };
} else {
    window$1 = window;
}

/*
 * Saved references to long variable names, so that closure compiler can
 * minimize file size.
 */

var ArrayProto = Array.prototype;
var FuncProto = Function.prototype;
var ObjProto = Object.prototype;
var slice = ArrayProto.slice;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;
var windowConsole = window$1.console;
var navigator = window$1.navigator;
var document$1 = window$1.document;
var windowOpera = window$1.opera;
var screen = window$1.screen;
var userAgent = navigator.userAgent;
var nativeBind = FuncProto.bind;
var nativeForEach = ArrayProto.forEach;
var nativeIndexOf = ArrayProto.indexOf;
var nativeMap = ArrayProto.map;
var nativeIsArray = Array.isArray;
var breaker = {};
var _ = {
    trim: function(str) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
};

// Console override
var console$1 = {
    /** @type {function(...*)} */
    log: function() {
        if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
            try {
                windowConsole.log.apply(windowConsole, arguments);
            } catch (err) {
                _.each(arguments, function(arg) {
                    windowConsole.log(arg);
                });
            }
        }
    },
    /** @type {function(...*)} */
    warn: function() {
        if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
            var args = ['Mixpanel warning:'].concat(_.toArray(arguments));
            try {
                windowConsole.warn.apply(windowConsole, args);
            } catch (err) {
                _.each(args, function(arg) {
                    windowConsole.warn(arg);
                });
            }
        }
    },
    /** @type {function(...*)} */
    error: function() {
        if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
            var args = ['Mixpanel error:'].concat(_.toArray(arguments));
            try {
                windowConsole.error.apply(windowConsole, args);
            } catch (err) {
                _.each(args, function(arg) {
                    windowConsole.error(arg);
                });
            }
        }
    },
    /** @type {function(...*)} */
    critical: function() {
        if (!_.isUndefined(windowConsole) && windowConsole) {
            var args = ['Mixpanel error:'].concat(_.toArray(arguments));
            try {
                windowConsole.error.apply(windowConsole, args);
            } catch (err) {
                _.each(args, function(arg) {
                    windowConsole.error(arg);
                });
            }
        }
    }
};

var log_func_with_prefix = function(func, prefix) {
    return function() {
        arguments[0] = '[' + prefix + '] ' + arguments[0];
        return func.apply(console$1, arguments);
    };
};
var console_with_prefix = function(prefix) {
    return {
        log: log_func_with_prefix(console$1.log, prefix),
        error: log_func_with_prefix(console$1.error, prefix),
        critical: log_func_with_prefix(console$1.critical, prefix)
    };
};


// UNDERSCORE
// Embed part of the Underscore Library
_.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) {
        return nativeBind.apply(func, slice.call(arguments, 1));
    }
    if (!_.isFunction(func)) {
        throw new TypeError();
    }
    args = slice.call(arguments, 2);
    bound = function() {
        if (!(this instanceof bound)) {
            return func.apply(context, args.concat(slice.call(arguments)));
        }
        var ctor = {};
        ctor.prototype = func.prototype;
        var self = new ctor();
        ctor.prototype = null;
        var result = func.apply(self, args.concat(slice.call(arguments)));
        if (Object(result) === result) {
            return result;
        }
        return self;
    };
    return bound;
};

/**
 * @param {*=} obj
 * @param {function(...*)=} iterator
 * @param {Object=} context
 */
_.each = function(obj, iterator, context) {
    if (obj === null || obj === undefined) {
        return;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
            if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
                return;
            }
        }
    } else {
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                if (iterator.call(context, obj[key], key, obj) === breaker) {
                    return;
                }
            }
        }
    }
};

_.extend = function(obj) {
    _.each(slice.call(arguments, 1), function(source) {
        for (var prop in source) {
            if (source[prop] !== void 0) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

_.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
};

// from a comment on http://dbj.org/dbj/?p=286
// fails on only one very rare and deliberate custom object:
// var bomb = { toString : undefined, valueOf: function(o) { return "function BOMBA!"; }};
_.isFunction = function(f) {
    try {
        return /^\s*\bfunction\b/.test(f);
    } catch (x) {
        return false;
    }
};

_.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
};

_.toArray = function(iterable) {
    if (!iterable) {
        return [];
    }
    if (iterable.toArray) {
        return iterable.toArray();
    }
    if (_.isArray(iterable)) {
        return slice.call(iterable);
    }
    if (_.isArguments(iterable)) {
        return slice.call(iterable);
    }
    return _.values(iterable);
};

_.map = function(arr, callback, context) {
    if (nativeMap && arr.map === nativeMap) {
        return arr.map(callback, context);
    } else {
        var results = [];
        _.each(arr, function(item) {
            results.push(callback.call(context, item));
        });
        return results;
    }
};

_.keys = function(obj) {
    var results = [];
    if (obj === null) {
        return results;
    }
    _.each(obj, function(value, key) {
        results[results.length] = key;
    });
    return results;
};

_.values = function(obj) {
    var results = [];
    if (obj === null) {
        return results;
    }
    _.each(obj, function(value) {
        results[results.length] = value;
    });
    return results;
};

_.include = function(obj, target) {
    var found = false;
    if (obj === null) {
        return found;
    }
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
        return obj.indexOf(target) != -1;
    }
    _.each(obj, function(value) {
        if (found || (found = (value === target))) {
            return breaker;
        }
    });
    return found;
};

_.includes = function(str, needle) {
    return str.indexOf(needle) !== -1;
};

// Underscore Addons
_.inherit = function(subclass, superclass) {
    subclass.prototype = new superclass();
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclass.prototype;
    return subclass;
};

_.isObject = function(obj) {
    return (obj === Object(obj) && !_.isArray(obj));
};

_.isEmptyObject = function(obj) {
    if (_.isObject(obj)) {
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
    return false;
};

_.isUndefined = function(obj) {
    return obj === void 0;
};

_.isString = function(obj) {
    return toString.call(obj) == '[object String]';
};

_.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
};

_.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
};

_.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};

_.encodeDates = function(obj) {
    _.each(obj, function(v, k) {
        if (_.isDate(v)) {
            obj[k] = _.formatDate(v);
        } else if (_.isObject(v)) {
            obj[k] = _.encodeDates(v); // recurse
        }
    });
    return obj;
};

_.timestamp = function() {
    Date.now = Date.now || function() {
        return +new Date;
    };
    return Date.now();
};

_.formatDate = function(d) {
    // YYYY-MM-DDTHH:MM:SS in UTC
    function pad(n) {
        return n < 10 ? '0' + n : n;
    }
    return d.getUTCFullYear() + '-' +
        pad(d.getUTCMonth() + 1) + '-' +
        pad(d.getUTCDate()) + 'T' +
        pad(d.getUTCHours()) + ':' +
        pad(d.getUTCMinutes()) + ':' +
        pad(d.getUTCSeconds());
};

_.strip_empty_properties = function(p) {
    var ret = {};
    _.each(p, function(v, k) {
        if (_.isString(v) && v.length > 0) {
            ret[k] = v;
        }
    });
    return ret;
};

/*
 * this function returns a copy of object after truncating it.  If
 * passed an Array or Object it will iterate through obj and
 * truncate all the values recursively.
 */
_.truncate = function(obj, length) {
    var ret;

    if (typeof(obj) === 'string') {
        ret = obj.slice(0, length);
    } else if (_.isArray(obj)) {
        ret = [];
        _.each(obj, function(val) {
            ret.push(_.truncate(val, length));
        });
    } else if (_.isObject(obj)) {
        ret = {};
        _.each(obj, function(val, key) {
            ret[key] = _.truncate(val, length);
        });
    } else {
        ret = obj;
    }

    return ret;
};

_.JSONEncode = (function() {
    return function(mixed_val) {
        var value = mixed_val;
        var quote = function(string) {
            var escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; // eslint-disable-line no-control-regex
            var meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ?
                '"' + string.replace(escapable, function(a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c :
                        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        };

        var str = function(key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0; // The loop counter.
            var k = ''; // The member key.
            var v = ''; // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' :
                            gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                                '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' :
                        gap ? '{' + partial.join(',') + '' +
                        mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });
    };
})();

/**
 * From https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
 * Slightly modified to throw a real Error rather than a POJO
 */
_.JSONDecode = (function() {
    var at, // The index of the current character
        ch, // The current character
        escapee = {
            '"': '"',
            '\\': '\\',
            '/': '/',
            'b': '\b',
            'f': '\f',
            'n': '\n',
            'r': '\r',
            't': '\t'
        },
        text,
        error = function(m) {
            var e = new SyntaxError(m);
            e.at = at;
            e.text = text;
            throw e;
        },
        next = function(c) {
            // If a c parameter is provided, verify that it matches the current character.
            if (c && c !== ch) {
                error('Expected \'' + c + '\' instead of \'' + ch + '\'');
            }
            // Get the next character. When there are no more characters,
            // return the empty string.
            ch = text.charAt(at);
            at += 1;
            return ch;
        },
        number = function() {
            // Parse a number value.
            var number,
                string = '';

            if (ch === '-') {
                string = '-';
                next('-');
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
            if (ch === '.') {
                string += '.';
                while (next() && ch >= '0' && ch <= '9') {
                    string += ch;
                }
            }
            if (ch === 'e' || ch === 'E') {
                string += ch;
                next();
                if (ch === '-' || ch === '+') {
                    string += ch;
                    next();
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
            }
            number = +string;
            if (!isFinite(number)) {
                error('Bad number');
            } else {
                return number;
            }
        },

        string = function() {
            // Parse a string value.
            var hex,
                i,
                string = '',
                uffff;
            // When parsing for string values, we must look for " and \ characters.
            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    }
                    if (ch === '\\') {
                        next();
                        if (ch === 'u') {
                            uffff = 0;
                            for (i = 0; i < 4; i += 1) {
                                hex = parseInt(next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        } else if (typeof escapee[ch] === 'string') {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else {
                        string += ch;
                    }
                }
            }
            error('Bad string');
        },
        white = function() {
            // Skip whitespace.
            while (ch && ch <= ' ') {
                next();
            }
        },
        word = function() {
            // true, false, or null.
            switch (ch) {
                case 't':
                    next('t');
                    next('r');
                    next('u');
                    next('e');
                    return true;
                case 'f':
                    next('f');
                    next('a');
                    next('l');
                    next('s');
                    next('e');
                    return false;
                case 'n':
                    next('n');
                    next('u');
                    next('l');
                    next('l');
                    return null;
            }
            error('Unexpected "' + ch + '"');
        },
        value, // Placeholder for the value function.
        array = function() {
            // Parse an array value.
            var array = [];

            if (ch === '[') {
                next('[');
                white();
                if (ch === ']') {
                    next(']');
                    return array; // empty array
                }
                while (ch) {
                    array.push(value());
                    white();
                    if (ch === ']') {
                        next(']');
                        return array;
                    }
                    next(',');
                    white();
                }
            }
            error('Bad array');
        },
        object = function() {
            // Parse an object value.
            var key,
                object = {};

            if (ch === '{') {
                next('{');
                white();
                if (ch === '}') {
                    next('}');
                    return object; // empty object
                }
                while (ch) {
                    key = string();
                    white();
                    next(':');
                    if (Object.hasOwnProperty.call(object, key)) {
                        error('Duplicate key "' + key + '"');
                    }
                    object[key] = value();
                    white();
                    if (ch === '}') {
                        next('}');
                        return object;
                    }
                    next(',');
                    white();
                }
            }
            error('Bad object');
        };

    value = function() {
        // Parse a JSON value. It could be an object, an array, a string,
        // a number, or a word.
        white();
        switch (ch) {
            case '{':
                return object();
            case '[':
                return array();
            case '"':
                return string();
            case '-':
                return number();
            default:
                return ch >= '0' && ch <= '9' ? number() : word();
        }
    };

    // Return the json_parse function. It will have access to all of the
    // above functions and variables.
    return function(source) {
        var result;

        text = source;
        at = 0;
        ch = ' ';
        result = value();
        white();
        if (ch) {
            error('Syntax error');
        }

        return result;
    };
})();

_.base64Encode = function(data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = _.utf8Encode(data);

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
};

_.utf8Encode = function(string) {
    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    var utftext = '',
        start,
        end;
    var stringl = 0,
        n;

    start = end = 0;
    stringl = string.length;

    for (n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if ((c1 > 127) && (c1 < 2048)) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
};

_.UUID = (function() {

    // Time/ticks information
    // 1*new Date() is a cross browser version of Date.now()
    var T = function() {
        var d = 1 * new Date(),
            i = 0;

        // this while loop figures how many browser ticks go by
        // before 1*new Date() returns a new number, ie the amount
        // of ticks that go by per millisecond
        while (d == 1 * new Date()) {
            i++;
        }

        return d.toString(16) + i.toString(16);
    };

    // Math.Random entropy
    var R = function() {
        return Math.random().toString(16).replace('.', '');
    };

    // User agent entropy
    // This function takes the user agent string, and then xors
    // together each sequence of 8 bytes.  This produces a final
    // sequence of 8 bytes which it returns as hex.
    var UA = function() {
        var ua = userAgent,
            i, ch, buffer = [],
            ret = 0;

        function xor(result, byte_array) {
            var j, tmp = 0;
            for (j = 0; j < byte_array.length; j++) {
                tmp |= (buffer[j] << j * 8);
            }
            return result ^ tmp;
        }

        for (i = 0; i < ua.length; i++) {
            ch = ua.charCodeAt(i);
            buffer.unshift(ch & 0xFF);
            if (buffer.length >= 4) {
                ret = xor(ret, buffer);
                buffer = [];
            }
        }

        if (buffer.length > 0) {
            ret = xor(ret, buffer);
        }

        return ret.toString(16);
    };

    return function() {
        var se = (screen.height * screen.width).toString(16);
        return (T() + '-' + R() + '-' + UA() + '-' + se + '-' + T());
    };
})();

// _.isBlockedUA()
// This is to block various web spiders from executing our JS and
// sending false tracking data
var BLOCKED_UA_STRS = [
    'ahrefsbot',
    'baiduspider',
    'bingbot',
    'bingpreview',
    'facebookexternal',
    'petalbot',
    'pinterest',
    'screaming frog',
    'yahoo! slurp',
    'yandexbot',

    // a whole bunch of goog-specific crawlers
    // https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
    'adsbot-google',
    'apis-google',
    'duplexweb-google',
    'feedfetcher-google',
    'google favicon',
    'google web preview',
    'google-read-aloud',
    'googlebot',
    'googleweblight',
    'mediapartners-google',
    'storebot-google'
];
_.isBlockedUA = function(ua) {
    var i;
    ua = ua.toLowerCase();
    for (i = 0; i < BLOCKED_UA_STRS.length; i++) {
        if (ua.indexOf(BLOCKED_UA_STRS[i]) !== -1) {
            return true;
        }
    }
    return false;
};

/**
 * @param {Object=} formdata
 * @param {string=} arg_separator
 */
_.HTTPBuildQuery = function(formdata, arg_separator) {
    var use_val, use_key, tmp_arr = [];

    if (_.isUndefined(arg_separator)) {
        arg_separator = '&';
    }

    _.each(formdata, function(val, key) {
        use_val = encodeURIComponent(val.toString());
        use_key = encodeURIComponent(key);
        tmp_arr[tmp_arr.length] = use_key + '=' + use_val;
    });

    return tmp_arr.join(arg_separator);
};

_.getQueryParam = function(url, param) {
    // Expects a raw URL

    param = param.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regexS = '[\\?&]' + param + '=([^&#]*)',
        regex = new RegExp(regexS),
        results = regex.exec(url);
    if (results === null || (results && typeof(results[1]) !== 'string' && results[1].length)) {
        return '';
    } else {
        var result = results[1];
        try {
            result = decodeURIComponent(result);
        } catch(err) {
            console$1.error('Skipping decoding for malformed query param: ' + result);
        }
        return result.replace(/\+/g, ' ');
    }
};


// _.cookie
// Methods partially borrowed from quirksmode.org/js/cookies.html
_.cookie = {
    get: function(name) {
        var nameEQ = name + '=';
        var ca = document$1.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },

    parse: function(name) {
        var cookie;
        try {
            cookie = _.JSONDecode(_.cookie.get(name)) || {};
        } catch (err) {
            // noop
        }
        return cookie;
    },

    set_seconds: function(name, value, seconds, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
        var cdomain = '',
            expires = '',
            secure = '';

        if (domain_override) {
            cdomain = '; domain=' + domain_override;
        } else if (is_cross_subdomain) {
            var domain = extract_domain(document$1.location.hostname);
            cdomain = domain ? '; domain=.' + domain : '';
        }

        if (seconds) {
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = '; expires=' + date.toGMTString();
        }

        if (is_cross_site) {
            is_secure = true;
            secure = '; SameSite=None';
        }
        if (is_secure) {
            secure += '; secure';
        }

        document$1.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
    },

    set: function(name, value, days, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
        var cdomain = '', expires = '', secure = '';

        if (domain_override) {
            cdomain = '; domain=' + domain_override;
        } else if (is_cross_subdomain) {
            var domain = extract_domain(document$1.location.hostname);
            cdomain = domain ? '; domain=.' + domain : '';
        }

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }

        if (is_cross_site) {
            is_secure = true;
            secure = '; SameSite=None';
        }
        if (is_secure) {
            secure += '; secure';
        }

        var new_cookie_val = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
        document$1.cookie = new_cookie_val;
        return new_cookie_val;
    },

    remove: function(name, is_cross_subdomain, domain_override) {
        _.cookie.set(name, '', -1, is_cross_subdomain, false, false, domain_override);
    }
};

var _localStorageSupported = null;
var localStorageSupported = function(storage, forceCheck) {
    if (_localStorageSupported !== null && !forceCheck) {
        return _localStorageSupported;
    }

    var supported = true;
    try {
        storage = storage || window.localStorage;
        var key = '__mplss_' + cheap_guid(8),
            val = 'xyz';
        storage.setItem(key, val);
        if (storage.getItem(key) !== val) {
            supported = false;
        }
        storage.removeItem(key);
    } catch (err) {
        supported = false;
    }

    _localStorageSupported = supported;
    return supported;
};

// _.localStorage
_.localStorage = {
    is_supported: function(force_check) {
        var supported = localStorageSupported(null, force_check);
        if (!supported) {
            console$1.error('localStorage unsupported; falling back to cookie store');
        }
        return supported;
    },

    error: function(msg) {
        console$1.error('localStorage error: ' + msg);
    },

    get: function(name) {
        try {
            return window.localStorage.getItem(name);
        } catch (err) {
            _.localStorage.error(err);
        }
        return null;
    },

    parse: function(name) {
        try {
            return _.JSONDecode(_.localStorage.get(name)) || {};
        } catch (err) {
            // noop
        }
        return null;
    },

    set: function(name, value) {
        try {
            window.localStorage.setItem(name, value);
        } catch (err) {
            _.localStorage.error(err);
        }
    },

    remove: function(name) {
        try {
            window.localStorage.removeItem(name);
        } catch (err) {
            _.localStorage.error(err);
        }
    }
};

_.register_event = (function() {
    // written by Dean Edwards, 2005
    // with input from Tino Zijdel - crisp@xs4all.nl
    // with input from Carl Sverre - mail@carlsverre.com
    // with input from Mixpanel
    // http://dean.edwards.name/weblog/2005/10/add-event/
    // https://gist.github.com/1930440

    /**
     * @param {Object} element
     * @param {string} type
     * @param {function(...*)} handler
     * @param {boolean=} oldSchool
     * @param {boolean=} useCapture
     */
    var register_event = function(element, type, handler, oldSchool, useCapture) {
        if (!element) {
            console$1.error('No valid element provided to register_event');
            return;
        }

        if (element.addEventListener && !oldSchool) {
            element.addEventListener(type, handler, !!useCapture);
        } else {
            var ontype = 'on' + type;
            var old_handler = element[ontype]; // can be undefined
            element[ontype] = makeHandler(element, handler, old_handler);
        }
    };

    function makeHandler(element, new_handler, old_handlers) {
        var handler = function(event) {
            event = event || fixEvent(window.event);

            // this basically happens in firefox whenever another script
            // overwrites the onload callback and doesn't pass the event
            // object to previously defined callbacks.  All the browsers
            // that don't define window.event implement addEventListener
            // so the dom_loaded handler will still be fired as usual.
            if (!event) {
                return undefined;
            }

            var ret = true;
            var old_result, new_result;

            if (_.isFunction(old_handlers)) {
                old_result = old_handlers(event);
            }
            new_result = new_handler.call(element, event);

            if ((false === old_result) || (false === new_result)) {
                ret = false;
            }

            return ret;
        };

        return handler;
    }

    function fixEvent(event) {
        if (event) {
            event.preventDefault = fixEvent.preventDefault;
            event.stopPropagation = fixEvent.stopPropagation;
        }
        return event;
    }
    fixEvent.preventDefault = function() {
        this.returnValue = false;
    };
    fixEvent.stopPropagation = function() {
        this.cancelBubble = true;
    };

    return register_event;
})();


var TOKEN_MATCH_REGEX = new RegExp('^(\\w*)\\[(\\w+)([=~\\|\\^\\$\\*]?)=?"?([^\\]"]*)"?\\]$');

_.dom_query = (function() {
    /* document.getElementsBySelector(selector)
    - returns an array of element objects from the current document
    matching the CSS selector. Selectors can contain element names,
    class names and ids and can be nested. For example:

    elements = document.getElementsBySelector('div#main p a.external')

    Will return an array of all 'a' elements with 'external' in their
    class attribute that are contained inside 'p' elements that are
    contained inside the 'div' element which has id="main"

    New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
    See http://www.w3.org/TR/css3-selectors/#attribute-selectors

    Version 0.4 - Simon Willison, March 25th 2003
    -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
    -- Opera 7 fails

    Version 0.5 - Carl Sverre, Jan 7th 2013
    -- Now uses jQuery-esque `hasClass` for testing class name
    equality.  This fixes a bug related to '-' characters being
    considered not part of a 'word' in regex.
    */

    function getAllChildren(e) {
        // Returns all children of element. Workaround required for IE5/Windows. Ugh.
        return e.all ? e.all : e.getElementsByTagName('*');
    }

    var bad_whitespace = /[\t\r\n]/g;

    function hasClass(elem, selector) {
        var className = ' ' + selector + ' ';
        return ((' ' + elem.className + ' ').replace(bad_whitespace, ' ').indexOf(className) >= 0);
    }

    function getElementsBySelector(selector) {
        // Attempt to fail gracefully in lesser browsers
        if (!document$1.getElementsByTagName) {
            return [];
        }
        // Split selector in to tokens
        var tokens = selector.split(' ');
        var token, bits, tagName, found, foundCount, i, j, k, elements, currentContextIndex;
        var currentContext = [document$1];
        for (i = 0; i < tokens.length; i++) {
            token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
            if (token.indexOf('#') > -1) {
                // Token is an ID selector
                bits = token.split('#');
                tagName = bits[0];
                var id = bits[1];
                var element = document$1.getElementById(id);
                if (!element || (tagName && element.nodeName.toLowerCase() != tagName)) {
                    // element not found or tag with that ID not found, return false
                    return [];
                }
                // Set currentContext to contain just this element
                currentContext = [element];
                continue; // Skip to next token
            }
            if (token.indexOf('.') > -1) {
                // Token contains a class selector
                bits = token.split('.');
                tagName = bits[0];
                var className = bits[1];
                if (!tagName) {
                    tagName = '*';
                }
                // Get elements matching tag, filter them for class selector
                found = [];
                foundCount = 0;
                for (j = 0; j < currentContext.length; j++) {
                    if (tagName == '*') {
                        elements = getAllChildren(currentContext[j]);
                    } else {
                        elements = currentContext[j].getElementsByTagName(tagName);
                    }
                    for (k = 0; k < elements.length; k++) {
                        found[foundCount++] = elements[k];
                    }
                }
                currentContext = [];
                currentContextIndex = 0;
                for (j = 0; j < found.length; j++) {
                    if (found[j].className &&
                        _.isString(found[j].className) && // some SVG elements have classNames which are not strings
                        hasClass(found[j], className)
                    ) {
                        currentContext[currentContextIndex++] = found[j];
                    }
                }
                continue; // Skip to next token
            }
            // Code to deal with attribute selectors
            var token_match = token.match(TOKEN_MATCH_REGEX);
            if (token_match) {
                tagName = token_match[1];
                var attrName = token_match[2];
                var attrOperator = token_match[3];
                var attrValue = token_match[4];
                if (!tagName) {
                    tagName = '*';
                }
                // Grab all of the tagName elements within current context
                found = [];
                foundCount = 0;
                for (j = 0; j < currentContext.length; j++) {
                    if (tagName == '*') {
                        elements = getAllChildren(currentContext[j]);
                    } else {
                        elements = currentContext[j].getElementsByTagName(tagName);
                    }
                    for (k = 0; k < elements.length; k++) {
                        found[foundCount++] = elements[k];
                    }
                }
                currentContext = [];
                currentContextIndex = 0;
                var checkFunction; // This function will be used to filter the elements
                switch (attrOperator) {
                    case '=': // Equality
                        checkFunction = function(e) {
                            return (e.getAttribute(attrName) == attrValue);
                        };
                        break;
                    case '~': // Match one of space seperated words
                        checkFunction = function(e) {
                            return (e.getAttribute(attrName).match(new RegExp('\\b' + attrValue + '\\b')));
                        };
                        break;
                    case '|': // Match start with value followed by optional hyphen
                        checkFunction = function(e) {
                            return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')));
                        };
                        break;
                    case '^': // Match starts with value
                        checkFunction = function(e) {
                            return (e.getAttribute(attrName).indexOf(attrValue) === 0);
                        };
                        break;
                    case '$': // Match ends with value - fails with "Warning" in Opera 7
                        checkFunction = function(e) {
                            return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length);
                        };
                        break;
                    case '*': // Match ends with value
                        checkFunction = function(e) {
                            return (e.getAttribute(attrName).indexOf(attrValue) > -1);
                        };
                        break;
                    default:
                        // Just test for existence of attribute
                        checkFunction = function(e) {
                            return e.getAttribute(attrName);
                        };
                }
                currentContext = [];
                currentContextIndex = 0;
                for (j = 0; j < found.length; j++) {
                    if (checkFunction(found[j])) {
                        currentContext[currentContextIndex++] = found[j];
                    }
                }
                // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
                continue; // Skip to next token
            }
            // If we get here, token is JUST an element (not a class or ID selector)
            tagName = token;
            found = [];
            foundCount = 0;
            for (j = 0; j < currentContext.length; j++) {
                elements = currentContext[j].getElementsByTagName(tagName);
                for (k = 0; k < elements.length; k++) {
                    found[foundCount++] = elements[k];
                }
            }
            currentContext = found;
        }
        return currentContext;
    }

    return function(query) {
        if (_.isElement(query)) {
            return [query];
        } else if (_.isObject(query) && !_.isUndefined(query.length)) {
            return query;
        } else {
            return getElementsBySelector.call(this, query);
        }
    };
})();

_.info = {
    campaignParams: function() {
        var campaign_keywords = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(' '),
            kw = '',
            params = {};
        _.each(campaign_keywords, function(kwkey) {
            kw = _.getQueryParam(document$1.URL, kwkey);
            if (kw.length) {
                params[kwkey] = kw;
            }
        });

        return params;
    },

    searchEngine: function(referrer) {
        if (referrer.search('https?://(.*)google.([^/?]*)') === 0) {
            return 'google';
        } else if (referrer.search('https?://(.*)bing.com') === 0) {
            return 'bing';
        } else if (referrer.search('https?://(.*)yahoo.com') === 0) {
            return 'yahoo';
        } else if (referrer.search('https?://(.*)duckduckgo.com') === 0) {
            return 'duckduckgo';
        } else {
            return null;
        }
    },

    searchInfo: function(referrer) {
        var search = _.info.searchEngine(referrer),
            param = (search != 'yahoo') ? 'q' : 'p',
            ret = {};

        if (search !== null) {
            ret['$search_engine'] = search;

            var keyword = _.getQueryParam(referrer, param);
            if (keyword.length) {
                ret['mp_keyword'] = keyword;
            }
        }

        return ret;
    },

    /**
     * This function detects which browser is running this script.
     * The order of the checks are important since many user agents
     * include key words used in later checks.
     */
    browser: function(user_agent, vendor, opera) {
        vendor = vendor || ''; // vendor is undefined for at least IE9
        if (opera || _.includes(user_agent, ' OPR/')) {
            if (_.includes(user_agent, 'Mini')) {
                return 'Opera Mini';
            }
            return 'Opera';
        } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
            return 'BlackBerry';
        } else if (_.includes(user_agent, 'IEMobile') || _.includes(user_agent, 'WPDesktop')) {
            return 'Internet Explorer Mobile';
        } else if (_.includes(user_agent, 'SamsungBrowser/')) {
            // https://developer.samsung.com/internet/user-agent-string-format
            return 'Samsung Internet';
        } else if (_.includes(user_agent, 'Edge') || _.includes(user_agent, 'Edg/')) {
            return 'Microsoft Edge';
        } else if (_.includes(user_agent, 'FBIOS')) {
            return 'Facebook Mobile';
        } else if (_.includes(user_agent, 'Chrome')) {
            return 'Chrome';
        } else if (_.includes(user_agent, 'CriOS')) {
            return 'Chrome iOS';
        } else if (_.includes(user_agent, 'UCWEB') || _.includes(user_agent, 'UCBrowser')) {
            return 'UC Browser';
        } else if (_.includes(user_agent, 'FxiOS')) {
            return 'Firefox iOS';
        } else if (_.includes(vendor, 'Apple')) {
            if (_.includes(user_agent, 'Mobile')) {
                return 'Mobile Safari';
            }
            return 'Safari';
        } else if (_.includes(user_agent, 'Android')) {
            return 'Android Mobile';
        } else if (_.includes(user_agent, 'Konqueror')) {
            return 'Konqueror';
        } else if (_.includes(user_agent, 'Firefox')) {
            return 'Firefox';
        } else if (_.includes(user_agent, 'MSIE') || _.includes(user_agent, 'Trident/')) {
            return 'Internet Explorer';
        } else if (_.includes(user_agent, 'Gecko')) {
            return 'Mozilla';
        } else {
            return '';
        }
    },

    /**
     * This function detects which browser version is running this script,
     * parsing major and minor version (e.g., 42.1). User agent strings from:
     * http://www.useragentstring.com/pages/useragentstring.php
     */
    browserVersion: function(userAgent, vendor, opera) {
        var browser = _.info.browser(userAgent, vendor, opera);
        var versionRegexs = {
            'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
            'Microsoft Edge': /Edge?\/(\d+(\.\d+)?)/,
            'Chrome': /Chrome\/(\d+(\.\d+)?)/,
            'Chrome iOS': /CriOS\/(\d+(\.\d+)?)/,
            'UC Browser' : /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
            'Safari': /Version\/(\d+(\.\d+)?)/,
            'Mobile Safari': /Version\/(\d+(\.\d+)?)/,
            'Opera': /(Opera|OPR)\/(\d+(\.\d+)?)/,
            'Firefox': /Firefox\/(\d+(\.\d+)?)/,
            'Firefox iOS': /FxiOS\/(\d+(\.\d+)?)/,
            'Konqueror': /Konqueror:(\d+(\.\d+)?)/,
            'BlackBerry': /BlackBerry (\d+(\.\d+)?)/,
            'Android Mobile': /android\s(\d+(\.\d+)?)/,
            'Samsung Internet': /SamsungBrowser\/(\d+(\.\d+)?)/,
            'Internet Explorer': /(rv:|MSIE )(\d+(\.\d+)?)/,
            'Mozilla': /rv:(\d+(\.\d+)?)/
        };
        var regex = versionRegexs[browser];
        if (regex === undefined) {
            return null;
        }
        var matches = userAgent.match(regex);
        if (!matches) {
            return null;
        }
        return parseFloat(matches[matches.length - 2]);
    },

    os: function() {
        var a = userAgent;
        if (/Windows/i.test(a)) {
            if (/Phone/.test(a) || /WPDesktop/.test(a)) {
                return 'Windows Phone';
            }
            return 'Windows';
        } else if (/(iPhone|iPad|iPod)/.test(a)) {
            return 'iOS';
        } else if (/Android/.test(a)) {
            return 'Android';
        } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
            return 'BlackBerry';
        } else if (/Mac/i.test(a)) {
            return 'Mac OS X';
        } else if (/Linux/.test(a)) {
            return 'Linux';
        } else if (/CrOS/.test(a)) {
            return 'Chrome OS';
        } else {
            return '';
        }
    },

    device: function(user_agent) {
        if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
            return 'Windows Phone';
        } else if (/iPad/.test(user_agent)) {
            return 'iPad';
        } else if (/iPod/.test(user_agent)) {
            return 'iPod Touch';
        } else if (/iPhone/.test(user_agent)) {
            return 'iPhone';
        } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
            return 'BlackBerry';
        } else if (/Android/.test(user_agent)) {
            return 'Android';
        } else {
            return '';
        }
    },

    referringDomain: function(referrer) {
        var split = referrer.split('/');
        if (split.length >= 3) {
            return split[2];
        }
        return '';
    },

    properties: function() {
        return _.extend(_.strip_empty_properties({
            '$os': _.info.os(),
            '$browser': _.info.browser(userAgent, navigator.vendor, windowOpera),
            '$referrer': document$1.referrer,
            '$referring_domain': _.info.referringDomain(document$1.referrer),
            '$device': _.info.device(userAgent)
        }), {
            '$current_url': window$1.location.href,
            '$browser_version': _.info.browserVersion(userAgent, navigator.vendor, windowOpera),
            '$screen_height': screen.height,
            '$screen_width': screen.width,
            'mp_lib': 'web',
            '$lib_version': Config.LIB_VERSION,
            '$insert_id': cheap_guid(),
            'time': _.timestamp() / 1000 // epoch time in seconds
        });
    },

    people_properties: function() {
        return _.extend(_.strip_empty_properties({
            '$os': _.info.os(),
            '$browser': _.info.browser(userAgent, navigator.vendor, windowOpera)
        }), {
            '$browser_version': _.info.browserVersion(userAgent, navigator.vendor, windowOpera)
        });
    },

    pageviewInfo: function(page) {
        return _.strip_empty_properties({
            'mp_page': page,
            'mp_referrer': document$1.referrer,
            'mp_browser': _.info.browser(userAgent, navigator.vendor, windowOpera),
            'mp_platform': _.info.os()
        });
    }
};

var cheap_guid = function(maxlen) {
    var guid = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    return maxlen ? guid.substring(0, maxlen) : guid;
};

// naive way to extract domain name (example.com) from full hostname (my.sub.example.com)
var SIMPLE_DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]*\.[a-z]+$/i;
// this next one attempts to account for some ccSLDs, e.g. extracting oxford.ac.uk from www.oxford.ac.uk
var DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]+\.[a-z.]{2,6}$/i;
/**
 * Attempts to extract main domain name from full hostname, using a few blunt heuristics. For
 * common TLDs like .com/.org that always have a simple SLD.TLD structure (example.com), we
 * simply extract the last two .-separated parts of the hostname (SIMPLE_DOMAIN_MATCH_REGEX).
 * For others, we attempt to account for short ccSLD+TLD combos (.ac.uk) with the legacy
 * DOMAIN_MATCH_REGEX (kept to maintain backwards compatibility with existing Mixpanel
 * integrations). The only _reliable_ way to extract domain from hostname is with an up-to-date
 * list like at https://publicsuffix.org/ so for cases that this helper fails at, the SDK
 * offers the 'cookie_domain' config option to set it explicitly.
 * @example
 * extract_domain('my.sub.example.com')
 * // 'example.com'
 */
var extract_domain = function(hostname) {
    var domain_regex = DOMAIN_MATCH_REGEX;
    var parts = hostname.split('.');
    var tld = parts[parts.length - 1];
    if (tld.length > 4 || tld === 'com' || tld === 'org') {
        domain_regex = SIMPLE_DOMAIN_MATCH_REGEX;
    }
    var matches = hostname.match(domain_regex);
    return matches ? matches[0] : '';
};

var JSONStringify = null;
var JSONParse = null;
if (typeof JSON !== 'undefined') {
    JSONStringify = JSON.stringify;
    JSONParse = JSON.parse;
}
JSONStringify = JSONStringify || _.JSONEncode;
JSONParse = JSONParse || _.JSONDecode;

// EXPORTS (for closure compiler)
_['toArray']                = _.toArray;
_['isObject']               = _.isObject;
_['JSONEncode']             = _.JSONEncode;
_['JSONDecode']             = _.JSONDecode;
_['isBlockedUA']            = _.isBlockedUA;
_['isEmptyObject']          = _.isEmptyObject;
_['info']                   = _.info;
_['info']['device']         = _.info.device;
_['info']['browser']        = _.info.browser;
_['info']['browserVersion'] = _.info.browserVersion;
_['info']['properties']     = _.info.properties;

/**
 * DomTracker Object
 * @constructor
 */
var DomTracker = function() {};


// interface
DomTracker.prototype.create_properties = function() {};
DomTracker.prototype.event_handler = function() {};
DomTracker.prototype.after_track_handler = function() {};

DomTracker.prototype.init = function(mixpanel_instance) {
    this.mp = mixpanel_instance;
    return this;
};

/**
 * @param {Object|string} query
 * @param {string} event_name
 * @param {Object=} properties
 * @param {function=} user_callback
 */
DomTracker.prototype.track = function(query, event_name, properties, user_callback) {
    var that = this;
    var elements = _.dom_query(query);

    if (elements.length === 0) {
        console$1.error('The DOM query (' + query + ') returned 0 elements');
        return;
    }

    _.each(elements, function(element) {
        _.register_event(element, this.override_event, function(e) {
            var options = {};
            var props = that.create_properties(properties, this);
            var timeout = that.mp.get_config('track_links_timeout');

            that.event_handler(e, this, options);

            // in case the mixpanel servers don't get back to us in time
            window.setTimeout(that.track_callback(user_callback, props, options, true), timeout);

            // fire the tracking event
            that.mp.track(event_name, props, that.track_callback(user_callback, props, options));
        });
    }, this);

    return true;
};

/**
 * @param {function} user_callback
 * @param {Object} props
 * @param {boolean=} timeout_occured
 */
DomTracker.prototype.track_callback = function(user_callback, props, options, timeout_occured) {
    timeout_occured = timeout_occured || false;
    var that = this;

    return function() {
        // options is referenced from both callbacks, so we can have
        // a 'lock' of sorts to ensure only one fires
        if (options.callback_fired) { return; }
        options.callback_fired = true;

        if (user_callback && user_callback(timeout_occured, props) === false) {
            // user can prevent the default functionality by
            // returning false from their callback
            return;
        }

        that.after_track_handler(props, options, timeout_occured);
    };
};

DomTracker.prototype.create_properties = function(properties, element) {
    var props;

    if (typeof(properties) === 'function') {
        props = properties(element);
    } else {
        props = _.extend({}, properties);
    }

    return props;
};

/**
 * LinkTracker Object
 * @constructor
 * @extends DomTracker
 */
var LinkTracker = function() {
    this.override_event = 'click';
};
_.inherit(LinkTracker, DomTracker);

LinkTracker.prototype.create_properties = function(properties, element) {
    var props = LinkTracker.superclass.create_properties.apply(this, arguments);

    if (element.href) { props['url'] = element.href; }

    return props;
};

LinkTracker.prototype.event_handler = function(evt, element, options) {
    options.new_tab = (
        evt.which === 2 ||
        evt.metaKey ||
        evt.ctrlKey ||
        element.target === '_blank'
    );
    options.href = element.href;

    if (!options.new_tab) {
        evt.preventDefault();
    }
};

LinkTracker.prototype.after_track_handler = function(props, options) {
    if (options.new_tab) { return; }

    setTimeout(function() {
        window.location = options.href;
    }, 0);
};

/**
 * FormTracker Object
 * @constructor
 * @extends DomTracker
 */
var FormTracker = function() {
    this.override_event = 'submit';
};
_.inherit(FormTracker, DomTracker);

FormTracker.prototype.event_handler = function(evt, element, options) {
    options.element = element;
    evt.preventDefault();
};

FormTracker.prototype.after_track_handler = function(props, options) {
    setTimeout(function() {
        options.element.submit();
    }, 0);
};

// eslint-disable-line camelcase

var logger$2 = console_with_prefix('lock');

/**
 * SharedLock: a mutex built on HTML5 localStorage, to ensure that only one browser
 * window/tab at a time will be able to access shared resources.
 *
 * Based on the Alur and Taubenfeld fast lock
 * (http://www.cs.rochester.edu/research/synchronization/pseudocode/fastlock.html)
 * with an added timeout to ensure there will be eventual progress in the event
 * that a window is closed in the middle of the callback.
 *
 * Implementation based on the original version by David Wolever (https://github.com/wolever)
 * at https://gist.github.com/wolever/5fd7573d1ef6166e8f8c4af286a69432.
 *
 * @example
 * const myLock = new SharedLock('some-key');
 * myLock.withLock(function() {
 *   console.log('I hold the mutex!');
 * });
 *
 * @constructor
 */
var SharedLock = function(key, options) {
    options = options || {};

    this.storageKey = key;
    this.storage = options.storage || window.localStorage;
    this.pollIntervalMS = options.pollIntervalMS || 100;
    this.timeoutMS = options.timeoutMS || 2000;
};

// pass in a specific pid to test contention scenarios; otherwise
// it is chosen randomly for each acquisition attempt
SharedLock.prototype.withLock = function(lockedCB, errorCB, pid) {
    if (!pid && typeof errorCB !== 'function') {
        pid = errorCB;
        errorCB = null;
    }

    var i = pid || (new Date().getTime() + '|' + Math.random());
    var startTime = new Date().getTime();

    var key = this.storageKey;
    var pollIntervalMS = this.pollIntervalMS;
    var timeoutMS = this.timeoutMS;
    var storage = this.storage;

    var keyX = key + ':X';
    var keyY = key + ':Y';
    var keyZ = key + ':Z';

    var reportError = function(err) {
        errorCB && errorCB(err);
    };

    var delay = function(cb) {
        if (new Date().getTime() - startTime > timeoutMS) {
            logger$2.error('Timeout waiting for mutex on ' + key + '; clearing lock. [' + i + ']');
            storage.removeItem(keyZ);
            storage.removeItem(keyY);
            loop();
            return;
        }
        setTimeout(function() {
            try {
                cb();
            } catch(err) {
                reportError(err);
            }
        }, pollIntervalMS * (Math.random() + 0.1));
    };

    var waitFor = function(predicate, cb) {
        if (predicate()) {
            cb();
        } else {
            delay(function() {
                waitFor(predicate, cb);
            });
        }
    };

    var getSetY = function() {
        var valY = storage.getItem(keyY);
        if (valY && valY !== i) { // if Y == i then this process already has the lock (useful for test cases)
            return false;
        } else {
            storage.setItem(keyY, i);
            if (storage.getItem(keyY) === i) {
                return true;
            } else {
                if (!localStorageSupported(storage, true)) {
                    throw new Error('localStorage support dropped while acquiring lock');
                }
                return false;
            }
        }
    };

    var loop = function() {
        storage.setItem(keyX, i);

        waitFor(getSetY, function() {
            if (storage.getItem(keyX) === i) {
                criticalSection();
                return;
            }

            delay(function() {
                if (storage.getItem(keyY) !== i) {
                    loop();
                    return;
                }
                waitFor(function() {
                    return !storage.getItem(keyZ);
                }, criticalSection);
            });
        });
    };

    var criticalSection = function() {
        storage.setItem(keyZ, '1');
        try {
            lockedCB();
        } finally {
            storage.removeItem(keyZ);
            if (storage.getItem(keyY) === i) {
                storage.removeItem(keyY);
            }
            if (storage.getItem(keyX) === i) {
                storage.removeItem(keyX);
            }
        }
    };

    try {
        if (localStorageSupported(storage, true)) {
            loop();
        } else {
            throw new Error('localStorage support check failed');
        }
    } catch(err) {
        reportError(err);
    }
};

// eslint-disable-line camelcase

var logger$1 = console_with_prefix('batch');

/**
 * RequestQueue: queue for batching API requests with localStorage backup for retries.
 * Maintains an in-memory queue which represents the source of truth for the current
 * page, but also writes all items out to a copy in the browser's localStorage, which
 * can be read on subsequent pageloads and retried. For batchability, all the request
 * items in the queue should be of the same type (events, people updates, group updates)
 * so they can be sent in a single request to the same API endpoint.
 *
 * LocalStorage keying and locking: In order for reloads and subsequent pageloads of
 * the same site to access the same persisted data, they must share the same localStorage
 * key (for instance based on project token and queue type). Therefore access to the
 * localStorage entry is guarded by an asynchronous mutex (SharedLock) to prevent
 * simultaneously open windows/tabs from overwriting each other's data (which would lead
 * to data loss in some situations).
 * @constructor
 */
var RequestQueue = function(storageKey, options) {
    options = options || {};
    this.storageKey = storageKey;
    this.storage = options.storage || window.localStorage;
    this.reportError = options.errorReporter || _.bind(logger$1.error, logger$1);
    this.lock = new SharedLock(storageKey, {storage: this.storage});

    this.pid = options.pid || null; // pass pid to test out storage lock contention scenarios

    this.memQueue = [];
};

/**
 * Add one item to queues (memory and localStorage). The queued entry includes
 * the given item along with an auto-generated ID and a "flush-after" timestamp.
 * It is expected that the item will be sent over the network and dequeued
 * before the flush-after time; if this doesn't happen it is considered orphaned
 * (e.g., the original tab where it was enqueued got closed before it could be
 * sent) and the item can be sent by any tab that finds it in localStorage.
 *
 * The final callback param is called with a param indicating success or
 * failure of the enqueue operation; it is asynchronous because the localStorage
 * lock is asynchronous.
 */
RequestQueue.prototype.enqueue = function(item, flushInterval, cb) {
    var queueEntry = {
        'id': cheap_guid(),
        'flushAfter': new Date().getTime() + flushInterval * 2,
        'payload': item
    };

    this.lock.withLock(_.bind(function lockAcquired() {
        var succeeded;
        try {
            var storedQueue = this.readFromStorage();
            storedQueue.push(queueEntry);
            succeeded = this.saveToStorage(storedQueue);
            if (succeeded) {
                // only add to in-memory queue when storage succeeds
                this.memQueue.push(queueEntry);
            }
        } catch(err) {
            this.reportError('Error enqueueing item', item);
            succeeded = false;
        }
        if (cb) {
            cb(succeeded);
        }
    }, this), _.bind(function lockFailure(err) {
        this.reportError('Error acquiring storage lock', err);
        if (cb) {
            cb(false);
        }
    }, this), this.pid);
};

/**
 * Read out the given number of queue entries. If this.memQueue
 * has fewer than batchSize items, then look for "orphaned" items
 * in the persisted queue (items where the 'flushAfter' time has
 * already passed).
 */
RequestQueue.prototype.fillBatch = function(batchSize) {
    var batch = this.memQueue.slice(0, batchSize);
    if (batch.length < batchSize) {
        // don't need lock just to read events; localStorage is thread-safe
        // and the worst that could happen is a duplicate send of some
        // orphaned events, which will be deduplicated on the server side
        var storedQueue = this.readFromStorage();
        if (storedQueue.length) {
            // item IDs already in batch; don't duplicate out of storage
            var idsInBatch = {}; // poor man's Set
            _.each(batch, function(item) { idsInBatch[item['id']] = true; });

            for (var i = 0; i < storedQueue.length; i++) {
                var item = storedQueue[i];
                if (new Date().getTime() > item['flushAfter'] && !idsInBatch[item['id']]) {
                    item.orphaned = true;
                    batch.push(item);
                    if (batch.length >= batchSize) {
                        break;
                    }
                }
            }
        }
    }
    return batch;
};

/**
 * Remove items with matching 'id' from array (immutably)
 * also remove any item without a valid id (e.g., malformed
 * storage entries).
 */
var filterOutIDsAndInvalid = function(items, idSet) {
    var filteredItems = [];
    _.each(items, function(item) {
        if (item['id'] && !idSet[item['id']]) {
            filteredItems.push(item);
        }
    });
    return filteredItems;
};

/**
 * Remove items with matching IDs from both in-memory queue
 * and persisted queue
 */
RequestQueue.prototype.removeItemsByID = function(ids, cb) {
    var idSet = {}; // poor man's Set
    _.each(ids, function(id) { idSet[id] = true; });

    this.memQueue = filterOutIDsAndInvalid(this.memQueue, idSet);

    var removeFromStorage = _.bind(function() {
        var succeeded;
        try {
            var storedQueue = this.readFromStorage();
            storedQueue = filterOutIDsAndInvalid(storedQueue, idSet);
            succeeded = this.saveToStorage(storedQueue);

            // an extra check: did storage report success but somehow
            // the items are still there?
            if (succeeded) {
                storedQueue = this.readFromStorage();
                for (var i = 0; i < storedQueue.length; i++) {
                    var item = storedQueue[i];
                    if (item['id'] && !!idSet[item['id']]) {
                        this.reportError('Item not removed from storage');
                        return false;
                    }
                }
            }
        } catch(err) {
            this.reportError('Error removing items', ids);
            succeeded = false;
        }
        return succeeded;
    }, this);

    this.lock.withLock(function lockAcquired() {
        var succeeded = removeFromStorage();
        if (cb) {
            cb(succeeded);
        }
    }, _.bind(function lockFailure(err) {
        var succeeded = false;
        this.reportError('Error acquiring storage lock', err);
        if (!localStorageSupported(this.storage, true)) {
            // Looks like localStorage writes have stopped working sometime after
            // initialization (probably full), and so nobody can acquire locks
            // anymore. Consider it temporarily safe to remove items without the
            // lock, since nobody's writing successfully anyway.
            succeeded = removeFromStorage();
            if (!succeeded) {
                // OK, we couldn't even write out the smaller queue. Try clearing it
                // entirely.
                try {
                    this.storage.removeItem(this.storageKey);
                } catch(err) {
                    this.reportError('Error clearing queue', err);
                }
            }
        }
        if (cb) {
            cb(succeeded);
        }
    }, this), this.pid);
};

// internal helper for RequestQueue.updatePayloads
var updatePayloads = function(existingItems, itemsToUpdate) {
    var newItems = [];
    _.each(existingItems, function(item) {
        var id = item['id'];
        if (id in itemsToUpdate) {
            var newPayload = itemsToUpdate[id];
            if (newPayload !== null) {
                item['payload'] = newPayload;
                newItems.push(item);
            }
        } else {
            // no update
            newItems.push(item);
        }
    });
    return newItems;
};

/**
 * Update payloads of given items in both in-memory queue and
 * persisted queue. Items set to null are removed from queues.
 */
RequestQueue.prototype.updatePayloads = function(itemsToUpdate, cb) {
    this.memQueue = updatePayloads(this.memQueue, itemsToUpdate);
    this.lock.withLock(_.bind(function lockAcquired() {
        var succeeded;
        try {
            var storedQueue = this.readFromStorage();
            storedQueue = updatePayloads(storedQueue, itemsToUpdate);
            succeeded = this.saveToStorage(storedQueue);
        } catch(err) {
            this.reportError('Error updating items', itemsToUpdate);
            succeeded = false;
        }
        if (cb) {
            cb(succeeded);
        }
    }, this), _.bind(function lockFailure(err) {
        this.reportError('Error acquiring storage lock', err);
        if (cb) {
            cb(false);
        }
    }, this), this.pid);
};

/**
 * Read and parse items array from localStorage entry, handling
 * malformed/missing data if necessary.
 */
RequestQueue.prototype.readFromStorage = function() {
    var storageEntry;
    try {
        storageEntry = this.storage.getItem(this.storageKey);
        if (storageEntry) {
            storageEntry = JSONParse(storageEntry);
            if (!_.isArray(storageEntry)) {
                this.reportError('Invalid storage entry:', storageEntry);
                storageEntry = null;
            }
        }
    } catch (err) {
        this.reportError('Error retrieving queue', err);
        storageEntry = null;
    }
    return storageEntry || [];
};

/**
 * Serialize the given items array to localStorage.
 */
RequestQueue.prototype.saveToStorage = function(queue) {
    try {
        this.storage.setItem(this.storageKey, JSONStringify(queue));
        return true;
    } catch (err) {
        this.reportError('Error saving queue', err);
        return false;
    }
};

/**
 * Clear out queues (memory and localStorage).
 */
RequestQueue.prototype.clear = function() {
    this.memQueue = [];
    this.storage.removeItem(this.storageKey);
};

// eslint-disable-line camelcase

// maximum interval between request retries after exponential backoff
var MAX_RETRY_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

var logger = console_with_prefix('batch');

/**
 * RequestBatcher: manages the queueing, flushing, retry etc of requests of one
 * type (events, people, groups).
 * Uses RequestQueue to manage the backing store.
 * @constructor
 */
var RequestBatcher = function(storageKey, options) {
    this.errorReporter = options.errorReporter;
    this.queue = new RequestQueue(storageKey, {
        errorReporter: _.bind(this.reportError, this),
        storage: options.storage
    });

    this.libConfig = options.libConfig;
    this.sendRequest = options.sendRequestFunc;
    this.beforeSendHook = options.beforeSendHook;
    this.stopAllBatching = options.stopAllBatchingFunc;

    // seed variable batch size + flush interval with configured values
    this.batchSize = this.libConfig['batch_size'];
    this.flushInterval = this.libConfig['batch_flush_interval_ms'];

    this.stopped = !this.libConfig['batch_autostart'];
    this.consecutiveRemovalFailures = 0;
};

/**
 * Add one item to queue.
 */
RequestBatcher.prototype.enqueue = function(item, cb) {
    this.queue.enqueue(item, this.flushInterval, cb);
};

/**
 * Start flushing batches at the configured time interval. Must call
 * this method upon SDK init in order to send anything over the network.
 */
RequestBatcher.prototype.start = function() {
    this.stopped = false;
    this.consecutiveRemovalFailures = 0;
    this.flush();
};

/**
 * Stop flushing batches. Can be restarted by calling start().
 */
RequestBatcher.prototype.stop = function() {
    this.stopped = true;
    if (this.timeoutID) {
        clearTimeout(this.timeoutID);
        this.timeoutID = null;
    }
};

/**
 * Clear out queue.
 */
RequestBatcher.prototype.clear = function() {
    this.queue.clear();
};

/**
 * Restore batch size configuration to whatever is set in the main SDK.
 */
RequestBatcher.prototype.resetBatchSize = function() {
    this.batchSize = this.libConfig['batch_size'];
};

/**
 * Restore flush interval time configuration to whatever is set in the main SDK.
 */
RequestBatcher.prototype.resetFlush = function() {
    this.scheduleFlush(this.libConfig['batch_flush_interval_ms']);
};

/**
 * Schedule the next flush in the given number of milliseconds.
 */
RequestBatcher.prototype.scheduleFlush = function(flushMS) {
    this.flushInterval = flushMS;
    if (!this.stopped) { // don't schedule anymore if batching has been stopped
        this.timeoutID = setTimeout(_.bind(this.flush, this), this.flushInterval);
    }
};

/**
 * Flush one batch to network. Depending on success/failure modes, it will either
 * remove the batch from the queue or leave it in for retry, and schedule the next
 * flush. In cases of most network or API failures, it will back off exponentially
 * when retrying.
 * @param {Object} [options]
 * @param {boolean} [options.sendBeacon] - whether to send batch with
 * navigator.sendBeacon (only useful for sending batches before page unloads, as
 * sendBeacon offers no callbacks or status indications)
 */
RequestBatcher.prototype.flush = function(options) {
    try {

        if (this.requestInProgress) {
            logger.log('Flush: Request already in progress');
            return;
        }

        options = options || {};
        var timeoutMS = this.libConfig['batch_request_timeout_ms'];
        var startTime = new Date().getTime();
        var currentBatchSize = this.batchSize;
        var batch = this.queue.fillBatch(currentBatchSize);
        var dataForRequest = [];
        var transformedItems = {};
        _.each(batch, function(item) {
            var payload = item['payload'];
            if (this.beforeSendHook && !item.orphaned) {
                payload = this.beforeSendHook(payload);
            }
            if (payload) {
                dataForRequest.push(payload);
            }
            transformedItems[item['id']] = payload;
        }, this);
        if (dataForRequest.length < 1) {
            this.resetFlush();
            return; // nothing to do
        }

        this.requestInProgress = true;

        var batchSendCallback = _.bind(function(res) {
            this.requestInProgress = false;

            try {

                // handle API response in a try-catch to make sure we can reset the
                // flush operation if something goes wrong

                var removeItemsFromQueue = false;
                if (options.unloading) {
                    // update persisted data to include hook transformations
                    this.queue.updatePayloads(transformedItems);
                } else if (
                    _.isObject(res) &&
                    res.error === 'timeout' &&
                    new Date().getTime() - startTime >= timeoutMS
                ) {
                    this.reportError('Network timeout; retrying');
                    this.flush();
                } else if (
                    _.isObject(res) &&
                    res.xhr_req &&
                    (res.xhr_req['status'] >= 500 || res.xhr_req['status'] === 429 || res.error === 'timeout')
                ) {
                    // network or API error, or 429 Too Many Requests, retry
                    var retryMS = this.flushInterval * 2;
                    var headers = res.xhr_req['responseHeaders'];
                    if (headers) {
                        var retryAfter = headers['Retry-After'];
                        if (retryAfter) {
                            retryMS = (parseInt(retryAfter, 10) * 1000) || retryMS;
                        }
                    }
                    retryMS = Math.min(MAX_RETRY_INTERVAL_MS, retryMS);
                    this.reportError('Error; retry in ' + retryMS + ' ms');
                    this.scheduleFlush(retryMS);
                } else if (_.isObject(res) && res.xhr_req && res.xhr_req['status'] === 413) {
                    // 413 Payload Too Large
                    if (batch.length > 1) {
                        var halvedBatchSize = Math.max(1, Math.floor(currentBatchSize / 2));
                        this.batchSize = Math.min(this.batchSize, halvedBatchSize, batch.length - 1);
                        this.reportError('413 response; reducing batch size to ' + this.batchSize);
                        this.resetFlush();
                    } else {
                        this.reportError('Single-event request too large; dropping', batch);
                        this.resetBatchSize();
                        removeItemsFromQueue = true;
                    }
                } else {
                    // successful network request+response; remove each item in batch from queue
                    // (even if it was e.g. a 400, in which case retrying won't help)
                    removeItemsFromQueue = true;
                }

                if (removeItemsFromQueue) {
                    this.queue.removeItemsByID(
                        _.map(batch, function(item) { return item['id']; }),
                        _.bind(function(succeeded) {
                            if (succeeded) {
                                this.consecutiveRemovalFailures = 0;
                                this.flush(); // handle next batch if the queue isn't empty
                            } else {
                                this.reportError('Failed to remove items from queue');
                                if (++this.consecutiveRemovalFailures > 5) {
                                    this.reportError('Too many queue failures; disabling batching system.');
                                    this.stopAllBatching();
                                } else {
                                    this.resetFlush();
                                }
                            }
                        }, this)
                    );
                }

            } catch(err) {
                this.reportError('Error handling API response', err);
                this.resetFlush();
            }
        }, this);
        var requestOptions = {
            method: 'POST',
            verbose: true,
            ignore_json_errors: true, // eslint-disable-line camelcase
            timeout_ms: timeoutMS // eslint-disable-line camelcase
        };
        if (options.unloading) {
            requestOptions.transport = 'sendBeacon';
        }
        logger.log('MIXPANEL REQUEST:', dataForRequest);
        this.sendRequest(dataForRequest, requestOptions, batchSendCallback);

    } catch(err) {
        this.reportError('Error flushing request queue', err);
        this.resetFlush();
    }
};

/**
 * Log error to global logger and optional user-defined logger.
 */
RequestBatcher.prototype.reportError = function(msg, err) {
    logger.error.apply(logger.error, arguments);
    if (this.errorReporter) {
        try {
            if (!(err instanceof Error)) {
                err = new Error(msg);
            }
            this.errorReporter(msg, err);
        } catch(err) {
            logger.error(err);
        }
    }
};

/**
 * A function used to track a Mixpanel event (e.g. MixpanelLib.track)
 * @callback trackFunction
 * @param {String} event_name The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.
 * @param {Object} [properties] A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.
 * @param {Function} [callback] If provided, the callback function will be called after tracking the event.
 */

/** Public **/

var GDPR_DEFAULT_PERSISTENCE_PREFIX = '__mp_opt_in_out_';

/**
 * Opt the user in to data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {trackFunction} [options.track] - function used for tracking a Mixpanel event to record the opt-in action
 * @param {string} [options.trackEventName] - event name to be used for tracking the opt-in action
 * @param {Object} [options.trackProperties] - set of properties to be tracked along with the opt-in action
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
 */
function optIn(token, options) {
    _optInOut(true, token, options);
}

/**
 * Opt the user out of data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-out cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-out cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-out cookie is set as secure or not
 */
function optOut(token, options) {
    _optInOut(false, token, options);
}

/**
 * Check whether the user has opted in to data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @returns {boolean} whether the user has opted in to the given opt type
 */
function hasOptedIn(token, options) {
    return _getStorageValue(token, options) === '1';
}

/**
 * Check whether the user has opted out of data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {boolean} [options.ignoreDnt] - flag to ignore browser DNT settings and always return false
 * @returns {boolean} whether the user has opted out of the given opt type
 */
function hasOptedOut(token, options) {
    if (_hasDoNotTrackFlagOn(options)) {
        console$1.warn('This browser has "Do Not Track" enabled. This will prevent the Mixpanel SDK from sending any data. To ignore the "Do Not Track" browser setting, initialize the Mixpanel instance with the config "ignore_dnt: true"');
        return true;
    }
    var optedOut = _getStorageValue(token, options) === '0';
    if (optedOut) {
        console$1.warn('You are opted out of Mixpanel tracking. This will prevent the Mixpanel SDK from sending any data.');
    }
    return optedOut;
}

/**
 * Wrap a MixpanelLib method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
function addOptOutCheckMixpanelLib(method) {
    return _addOptOutCheck(method, function(name) {
        return this.get_config(name);
    });
}

/**
 * Wrap a MixpanelPeople method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
function addOptOutCheckMixpanelPeople(method) {
    return _addOptOutCheck(method, function(name) {
        return this._get_config(name);
    });
}

/**
 * Wrap a MixpanelGroup method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
function addOptOutCheckMixpanelGroup(method) {
    return _addOptOutCheck(method, function(name) {
        return this._get_config(name);
    });
}

/**
 * Clear the user's opt in/out status of data tracking and cookies/localstorage for the given token
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
 */
function clearOptInOut(token, options) {
    options = options || {};
    _getStorage(options).remove(
        _getStorageKey(token, options), !!options.crossSubdomainCookie, options.cookieDomain
    );
}

/** Private **/

/**
 * Get storage util
 * @param {Object} [options]
 * @param {string} [options.persistenceType]
 * @returns {object} either _.cookie or _.localstorage
 */
function _getStorage(options) {
    options = options || {};
    return options.persistenceType === 'localStorage' ? _.localStorage : _.cookie;
}

/**
 * Get the name of the cookie that is used for the given opt type (tracking, cookie, etc.)
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @returns {string} the name of the cookie for the given opt type
 */
function _getStorageKey(token, options) {
    options = options || {};
    return (options.persistencePrefix || GDPR_DEFAULT_PERSISTENCE_PREFIX) + token;
}

/**
 * Get the value of the cookie that is used for the given opt type (tracking, cookie, etc.)
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @returns {string} the value of the cookie for the given opt type
 */
function _getStorageValue(token, options) {
    return _getStorage(options).get(_getStorageKey(token, options));
}

/**
 * Check whether the user has set the DNT/doNotTrack setting to true in their browser
 * @param {Object} [options]
 * @param {string} [options.window] - alternate window object to check; used to force various DNT settings in browser tests
 * @param {boolean} [options.ignoreDnt] - flag to ignore browser DNT settings and always return false
 * @returns {boolean} whether the DNT setting is true
 */
function _hasDoNotTrackFlagOn(options) {
    if (options && options.ignoreDnt) {
        return false;
    }
    var win = (options && options.window) || window$1;
    var nav = win['navigator'] || {};
    var hasDntOn = false;

    _.each([
        nav['doNotTrack'], // standard
        nav['msDoNotTrack'],
        win['doNotTrack']
    ], function(dntValue) {
        if (_.includes([true, 1, '1', 'yes'], dntValue)) {
            hasDntOn = true;
        }
    });

    return hasDntOn;
}

/**
 * Set cookie/localstorage for the user indicating that they are opted in or out for the given opt type
 * @param {boolean} optValue - whether to opt the user in or out for the given opt type
 * @param {string} token - Mixpanel project tracking token
 * @param {Object} [options]
 * @param {trackFunction} [options.track] - function used for tracking a Mixpanel event to record the opt-in action
 * @param {string} [options.trackEventName] - event name to be used for tracking the opt-in action
 * @param {Object} [options.trackProperties] - set of properties to be tracked along with the opt-in action
 * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
 * @param {string} [options.cookieDomain] - custom cookie domain
 * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
 * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
 * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
 */
function _optInOut(optValue, token, options) {
    if (!_.isString(token) || !token.length) {
        console$1.error('gdpr.' + (optValue ? 'optIn' : 'optOut') + ' called with an invalid token');
        return;
    }

    options = options || {};

    _getStorage(options).set(
        _getStorageKey(token, options),
        optValue ? 1 : 0,
        _.isNumber(options.cookieExpiration) ? options.cookieExpiration : null,
        !!options.crossSubdomainCookie,
        !!options.secureCookie,
        !!options.crossSiteCookie,
        options.cookieDomain
    );

    if (options.track && optValue) { // only track event if opting in (optValue=true)
        options.track(options.trackEventName || '$opt_in', options.trackProperties, {
            'send_immediately': true
        });
    }
}

/**
 * Wrap a method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
 * If the user has opted out, return early instead of executing the method.
 * If a callback argument was provided, execute it passing the 0 error code.
 * @param {function} method - wrapped method to be executed if the user has not opted out
 * @param {function} getConfigValue - getter function for the Mixpanel API token and other options to be used with opt-out check
 * @returns {*} the result of executing method OR undefined if the user has opted out
 */
function _addOptOutCheck(method, getConfigValue) {
    return function() {
        var optedOut = false;

        try {
            var token = getConfigValue.call(this, 'token');
            var ignoreDnt = getConfigValue.call(this, 'ignore_dnt');
            var persistenceType = getConfigValue.call(this, 'opt_out_tracking_persistence_type');
            var persistencePrefix = getConfigValue.call(this, 'opt_out_tracking_cookie_prefix');
            var win = getConfigValue.call(this, 'window'); // used to override window during browser tests

            if (token) { // if there was an issue getting the token, continue method execution as normal
                optedOut = hasOptedOut(token, {
                    ignoreDnt: ignoreDnt,
                    persistenceType: persistenceType,
                    persistencePrefix: persistencePrefix,
                    window: win
                });
            }
        } catch(err) {
            console$1.error('Unexpected error when checking tracking opt-out status: ' + err);
        }

        if (!optedOut) {
            return method.apply(this, arguments);
        }

        var callback = arguments[arguments.length - 1];
        if (typeof(callback) === 'function') {
            callback(0);
        }

        return;
    };
}

/** @const */ var SET_ACTION      = '$set';
/** @const */ var SET_ONCE_ACTION = '$set_once';
/** @const */ var UNSET_ACTION    = '$unset';
/** @const */ var ADD_ACTION      = '$add';
/** @const */ var APPEND_ACTION   = '$append';
/** @const */ var UNION_ACTION    = '$union';
/** @const */ var REMOVE_ACTION   = '$remove';
/** @const */ var DELETE_ACTION   = '$delete';

// Common internal methods for mixpanel.people and mixpanel.group APIs.
// These methods shouldn't involve network I/O.
var apiActions = {
    set_action: function(prop, to) {
        var data = {};
        var $set = {};
        if (_.isObject(prop)) {
            _.each(prop, function(v, k) {
                if (!this._is_reserved_property(k)) {
                    $set[k] = v;
                }
            }, this);
        } else {
            $set[prop] = to;
        }

        data[SET_ACTION] = $set;
        return data;
    },

    unset_action: function(prop) {
        var data = {};
        var $unset = [];
        if (!_.isArray(prop)) {
            prop = [prop];
        }

        _.each(prop, function(k) {
            if (!this._is_reserved_property(k)) {
                $unset.push(k);
            }
        }, this);

        data[UNSET_ACTION] = $unset;
        return data;
    },

    set_once_action: function(prop, to) {
        var data = {};
        var $set_once = {};
        if (_.isObject(prop)) {
            _.each(prop, function(v, k) {
                if (!this._is_reserved_property(k)) {
                    $set_once[k] = v;
                }
            }, this);
        } else {
            $set_once[prop] = to;
        }
        data[SET_ONCE_ACTION] = $set_once;
        return data;
    },

    union_action: function(list_name, values) {
        var data = {};
        var $union = {};
        if (_.isObject(list_name)) {
            _.each(list_name, function(v, k) {
                if (!this._is_reserved_property(k)) {
                    $union[k] = _.isArray(v) ? v : [v];
                }
            }, this);
        } else {
            $union[list_name] = _.isArray(values) ? values : [values];
        }
        data[UNION_ACTION] = $union;
        return data;
    },

    append_action: function(list_name, value) {
        var data = {};
        var $append = {};
        if (_.isObject(list_name)) {
            _.each(list_name, function(v, k) {
                if (!this._is_reserved_property(k)) {
                    $append[k] = v;
                }
            }, this);
        } else {
            $append[list_name] = value;
        }
        data[APPEND_ACTION] = $append;
        return data;
    },

    remove_action: function(list_name, value) {
        var data = {};
        var $remove = {};
        if (_.isObject(list_name)) {
            _.each(list_name, function(v, k) {
                if (!this._is_reserved_property(k)) {
                    $remove[k] = v;
                }
            }, this);
        } else {
            $remove[list_name] = value;
        }
        data[REMOVE_ACTION] = $remove;
        return data;
    },

    delete_action: function() {
        var data = {};
        data[DELETE_ACTION] = '';
        return data;
    }
};

/**
 * Mixpanel Group Object
 * @constructor
 */
var MixpanelGroup = function() {};

_.extend(MixpanelGroup.prototype, apiActions);

MixpanelGroup.prototype._init = function(mixpanel_instance, group_key, group_id) {
    this._mixpanel = mixpanel_instance;
    this._group_key = group_key;
    this._group_id = group_id;
};

/**
 * Set properties on a group.
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').set('Location', '405 Howard');
 *
 *     // or set multiple properties at once
 *     mixpanel.get_group('company', 'mixpanel').set({
 *          'Location': '405 Howard',
 *          'Founded' : 2009,
 *     });
 *     // properties can be strings, integers, dates, or lists
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [to] A value to set on the given property name
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.set = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
    var data = this.set_action(prop, to);
    if (_.isObject(prop)) {
        callback = to;
    }
    return this._send_request(data, callback);
});

/**
 * Set properties on a group, only if they do not yet exist.
 * This will not overwrite previous group property values, unlike
 * group.set().
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').set_once('Location', '405 Howard');
 *
 *     // or set multiple properties at once
 *     mixpanel.get_group('company', 'mixpanel').set_once({
 *          'Location': '405 Howard',
 *          'Founded' : 2009,
 *     });
 *     // properties can be strings, integers, lists or dates
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [to] A value to set on the given property name
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.set_once = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
    var data = this.set_once_action(prop, to);
    if (_.isObject(prop)) {
        callback = to;
    }
    return this._send_request(data, callback);
});

/**
 * Unset properties on a group permanently.
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').unset('Founded');
 *
 * @param {String} prop The name of the property.
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.unset = addOptOutCheckMixpanelGroup(function(prop, callback) {
    var data = this.unset_action(prop);
    return this._send_request(data, callback);
});

/**
 * Merge a given list with a list-valued group property, excluding duplicate values.
 *
 * ### Usage:
 *
 *     // merge a value to a list, creating it if needed
 *     mixpanel.get_group('company', 'mixpanel').union('Location', ['San Francisco', 'London']);
 *
 * @param {String} list_name Name of the property.
 * @param {Array} values Values to merge with the given property
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.union = addOptOutCheckMixpanelGroup(function(list_name, values, callback) {
    if (_.isObject(list_name)) {
        callback = values;
    }
    var data = this.union_action(list_name, values);
    return this._send_request(data, callback);
});

/**
 * Permanently delete a group.
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').delete();
 *
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype['delete'] = addOptOutCheckMixpanelGroup(function(callback) {
    // bracket notation above prevents a minification error related to reserved words
    var data = this.delete_action();
    return this._send_request(data, callback);
});

/**
 * Remove a property from a group. The value will be ignored if doesn't exist.
 *
 * ### Usage:
 *
 *     mixpanel.get_group('company', 'mixpanel').remove('Location', 'London');
 *
 * @param {String} list_name Name of the property.
 * @param {Object} value Value to remove from the given group property
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelGroup.prototype.remove = addOptOutCheckMixpanelGroup(function(list_name, value, callback) {
    var data = this.remove_action(list_name, value);
    return this._send_request(data, callback);
});

MixpanelGroup.prototype._send_request = function(data, callback) {
    data['$group_key'] = this._group_key;
    data['$group_id'] = this._group_id;
    data['$token'] = this._get_config('token');

    var date_encoded_data = _.encodeDates(data);
    return this._mixpanel._track_or_batch({
        type: 'groups',
        data: date_encoded_data,
        endpoint: this._get_config('api_host') + '/groups/',
        batcher: this._mixpanel.request_batchers.groups
    }, callback);
};

MixpanelGroup.prototype._is_reserved_property = function(prop) {
    return prop === '$group_key' || prop === '$group_id';
};

MixpanelGroup.prototype._get_config = function(conf) {
    return this._mixpanel.get_config(conf);
};

MixpanelGroup.prototype.toString = function() {
    return this._mixpanel.toString() + '.group.' + this._group_key + '.' + this._group_id;
};

// MixpanelGroup Exports
MixpanelGroup.prototype['remove']   = MixpanelGroup.prototype.remove;
MixpanelGroup.prototype['set']      = MixpanelGroup.prototype.set;
MixpanelGroup.prototype['set_once'] = MixpanelGroup.prototype.set_once;
MixpanelGroup.prototype['union']    = MixpanelGroup.prototype.union;
MixpanelGroup.prototype['unset']    = MixpanelGroup.prototype.unset;
MixpanelGroup.prototype['toString'] = MixpanelGroup.prototype.toString;

/**
 * Mixpanel People Object
 * @constructor
 */
var MixpanelPeople = function() {};

_.extend(MixpanelPeople.prototype, apiActions);

MixpanelPeople.prototype._init = function(mixpanel_instance) {
    this._mixpanel = mixpanel_instance;
};

/*
* Set properties on a user record.
*
* ### Usage:
*
*     mixpanel.people.set('gender', 'm');
*
*     // or set multiple properties at once
*     mixpanel.people.set({
*         'Company': 'Acme',
*         'Plan': 'Premium',
*         'Upgrade date': new Date()
*     });
*     // properties can be strings, integers, dates, or lists
*
* @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
* @param {*} [to] A value to set on the given property name
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.set = addOptOutCheckMixpanelPeople(function(prop, to, callback) {
    var data = this.set_action(prop, to);
    if (_.isObject(prop)) {
        callback = to;
    }
    // make sure that the referrer info has been updated and saved
    if (this._get_config('save_referrer')) {
        this._mixpanel['persistence'].update_referrer_info(document.referrer);
    }

    // update $set object with default people properties
    data[SET_ACTION] = _.extend(
        {},
        _.info.people_properties(),
        this._mixpanel['persistence'].get_referrer_info(),
        data[SET_ACTION]
    );
    return this._send_request(data, callback);
});

/*
* Set properties on a user record, only if they do not yet exist.
* This will not overwrite previous people property values, unlike
* people.set().
*
* ### Usage:
*
*     mixpanel.people.set_once('First Login Date', new Date());
*
*     // or set multiple properties at once
*     mixpanel.people.set_once({
*         'First Login Date': new Date(),
*         'Starting Plan': 'Premium'
*     });
*
*     // properties can be strings, integers or dates
*
* @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
* @param {*} [to] A value to set on the given property name
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.set_once = addOptOutCheckMixpanelPeople(function(prop, to, callback) {
    var data = this.set_once_action(prop, to);
    if (_.isObject(prop)) {
        callback = to;
    }
    return this._send_request(data, callback);
});

/*
* Unset properties on a user record (permanently removes the properties and their values from a profile).
*
* ### Usage:
*
*     mixpanel.people.unset('gender');
*
*     // or unset multiple properties at once
*     mixpanel.people.unset(['gender', 'Company']);
*
* @param {Array|String} prop If a string, this is the name of the property. If an array, this is a list of property names.
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.unset = addOptOutCheckMixpanelPeople(function(prop, callback) {
    var data = this.unset_action(prop);
    return this._send_request(data, callback);
});

/*
* Increment/decrement numeric people analytics properties.
*
* ### Usage:
*
*     mixpanel.people.increment('page_views', 1);
*
*     // or, for convenience, if you're just incrementing a counter by
*     // 1, you can simply do
*     mixpanel.people.increment('page_views');
*
*     // to decrement a counter, pass a negative number
*     mixpanel.people.increment('credits_left', -1);
*
*     // like mixpanel.people.set(), you can increment multiple
*     // properties at once:
*     mixpanel.people.increment({
*         counter1: 1,
*         counter2: 6
*     });
*
* @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and numeric values.
* @param {Number} [by] An amount to increment the given property
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.increment = addOptOutCheckMixpanelPeople(function(prop, by, callback) {
    var data = {};
    var $add = {};
    if (_.isObject(prop)) {
        _.each(prop, function(v, k) {
            if (!this._is_reserved_property(k)) {
                if (isNaN(parseFloat(v))) {
                    console$1.error('Invalid increment value passed to mixpanel.people.increment - must be a number');
                    return;
                } else {
                    $add[k] = v;
                }
            }
        }, this);
        callback = by;
    } else {
        // convenience: mixpanel.people.increment('property'); will
        // increment 'property' by 1
        if (_.isUndefined(by)) {
            by = 1;
        }
        $add[prop] = by;
    }
    data[ADD_ACTION] = $add;

    return this._send_request(data, callback);
});

/*
* Append a value to a list-valued people analytics property.
*
* ### Usage:
*
*     // append a value to a list, creating it if needed
*     mixpanel.people.append('pages_visited', 'homepage');
*
*     // like mixpanel.people.set(), you can append multiple
*     // properties at once:
*     mixpanel.people.append({
*         list1: 'bob',
*         list2: 123
*     });
*
* @param {Object|String} list_name If a string, this is the name of the property. If an object, this is an associative array of names and values.
* @param {*} [value] value An item to append to the list
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.append = addOptOutCheckMixpanelPeople(function(list_name, value, callback) {
    if (_.isObject(list_name)) {
        callback = value;
    }
    var data = this.append_action(list_name, value);
    return this._send_request(data, callback);
});

/*
* Remove a value from a list-valued people analytics property.
*
* ### Usage:
*
*     mixpanel.people.remove('School', 'UCB');
*
* @param {Object|String} list_name If a string, this is the name of the property. If an object, this is an associative array of names and values.
* @param {*} [value] value Item to remove from the list
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.remove = addOptOutCheckMixpanelPeople(function(list_name, value, callback) {
    if (_.isObject(list_name)) {
        callback = value;
    }
    var data = this.remove_action(list_name, value);
    return this._send_request(data, callback);
});

/*
* Merge a given list with a list-valued people analytics property,
* excluding duplicate values.
*
* ### Usage:
*
*     // merge a value to a list, creating it if needed
*     mixpanel.people.union('pages_visited', 'homepage');
*
*     // like mixpanel.people.set(), you can append multiple
*     // properties at once:
*     mixpanel.people.union({
*         list1: 'bob',
*         list2: 123
*     });
*
*     // like mixpanel.people.append(), you can append multiple
*     // values to the same list:
*     mixpanel.people.union({
*         list1: ['bob', 'billy']
*     });
*
* @param {Object|String} list_name If a string, this is the name of the property. If an object, this is an associative array of names and values.
* @param {*} [value] Value / values to merge with the given property
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.union = addOptOutCheckMixpanelPeople(function(list_name, values, callback) {
    if (_.isObject(list_name)) {
        callback = values;
    }
    var data = this.union_action(list_name, values);
    return this._send_request(data, callback);
});

/*
* Record that you have charged the current user a certain amount
* of money. Charges recorded with track_charge() will appear in the
* Mixpanel revenue report.
*
* ### Usage:
*
*     // charge a user $50
*     mixpanel.people.track_charge(50);
*
*     // charge a user $30.50 on the 2nd of january
*     mixpanel.people.track_charge(30.50, {
*         '$time': new Date('jan 1 2012')
*     });
*
* @param {Number} amount The amount of money charged to the current user
* @param {Object} [properties] An associative array of properties associated with the charge
* @param {Function} [callback] If provided, the callback will be called when the server responds
*/
MixpanelPeople.prototype.track_charge = addOptOutCheckMixpanelPeople(function(amount, properties, callback) {
    if (!_.isNumber(amount)) {
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            console$1.error('Invalid value passed to mixpanel.people.track_charge - must be a number');
            return;
        }
    }

    return this.append('$transactions', _.extend({
        '$amount': amount
    }, properties), callback);
});

/*
* Permanently clear all revenue report transactions from the
* current user's people analytics profile.
*
* ### Usage:
*
*     mixpanel.people.clear_charges();
*
* @param {Function} [callback] If provided, the callback will be called after tracking the event.
*/
MixpanelPeople.prototype.clear_charges = function(callback) {
    return this.set('$transactions', [], callback);
};

/*
* Permanently deletes the current people analytics profile from
* Mixpanel (using the current distinct_id).
*
* ### Usage:
*
*     // remove the all data you have stored about the current user
*     mixpanel.people.delete_user();
*
*/
MixpanelPeople.prototype.delete_user = function() {
    if (!this._identify_called()) {
        console$1.error('mixpanel.people.delete_user() requires you to call identify() first');
        return;
    }
    var data = {'$delete': this._mixpanel.get_distinct_id()};
    return this._send_request(data);
};

MixpanelPeople.prototype.toString = function() {
    return this._mixpanel.toString() + '.people';
};

MixpanelPeople.prototype._send_request = function(data, callback) {
    data['$token'] = this._get_config('token');
    data['$distinct_id'] = this._mixpanel.get_distinct_id();
    var device_id = this._mixpanel.get_property('$device_id');
    var user_id = this._mixpanel.get_property('$user_id');
    var had_persisted_distinct_id = this._mixpanel.get_property('$had_persisted_distinct_id');
    if (device_id) {
        data['$device_id'] = device_id;
    }
    if (user_id) {
        data['$user_id'] = user_id;
    }
    if (had_persisted_distinct_id) {
        data['$had_persisted_distinct_id'] = had_persisted_distinct_id;
    }

    var date_encoded_data = _.encodeDates(data);

    if (!this._identify_called()) {
        this._enqueue(data);
        if (!_.isUndefined(callback)) {
            if (this._get_config('verbose')) {
                callback({status: -1, error: null});
            } else {
                callback(-1);
            }
        }
        return _.truncate(date_encoded_data, 255);
    }

    return this._mixpanel._track_or_batch({
        type: 'people',
        data: date_encoded_data,
        endpoint: this._get_config('api_host') + '/engage/',
        batcher: this._mixpanel.request_batchers.people
    }, callback);
};

MixpanelPeople.prototype._get_config = function(conf_var) {
    return this._mixpanel.get_config(conf_var);
};

MixpanelPeople.prototype._identify_called = function() {
    return this._mixpanel._flags.identify_called === true;
};

// Queue up engage operations if identify hasn't been called yet.
MixpanelPeople.prototype._enqueue = function(data) {
    if (SET_ACTION in data) {
        this._mixpanel['persistence']._add_to_people_queue(SET_ACTION, data);
    } else if (SET_ONCE_ACTION in data) {
        this._mixpanel['persistence']._add_to_people_queue(SET_ONCE_ACTION, data);
    } else if (UNSET_ACTION in data) {
        this._mixpanel['persistence']._add_to_people_queue(UNSET_ACTION, data);
    } else if (ADD_ACTION in data) {
        this._mixpanel['persistence']._add_to_people_queue(ADD_ACTION, data);
    } else if (APPEND_ACTION in data) {
        this._mixpanel['persistence']._add_to_people_queue(APPEND_ACTION, data);
    } else if (REMOVE_ACTION in data) {
        this._mixpanel['persistence']._add_to_people_queue(REMOVE_ACTION, data);
    } else if (UNION_ACTION in data) {
        this._mixpanel['persistence']._add_to_people_queue(UNION_ACTION, data);
    } else {
        console$1.error('Invalid call to _enqueue():', data);
    }
};

MixpanelPeople.prototype._flush_one_queue = function(action, action_method, callback, queue_to_params_fn) {
    var _this = this;
    var queued_data = _.extend({}, this._mixpanel['persistence']._get_queue(action));
    var action_params = queued_data;

    if (!_.isUndefined(queued_data) && _.isObject(queued_data) && !_.isEmptyObject(queued_data)) {
        _this._mixpanel['persistence']._pop_from_people_queue(action, queued_data);
        if (queue_to_params_fn) {
            action_params = queue_to_params_fn(queued_data);
        }
        action_method.call(_this, action_params, function(response, data) {
            // on bad response, we want to add it back to the queue
            if (response === 0) {
                _this._mixpanel['persistence']._add_to_people_queue(action, queued_data);
            }
            if (!_.isUndefined(callback)) {
                callback(response, data);
            }
        });
    }
};

// Flush queued engage operations - order does not matter,
// and there are network level race conditions anyway
MixpanelPeople.prototype._flush = function(
    _set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback
) {
    var _this = this;
    var $append_queue = this._mixpanel['persistence']._get_queue(APPEND_ACTION);
    var $remove_queue = this._mixpanel['persistence']._get_queue(REMOVE_ACTION);

    this._flush_one_queue(SET_ACTION, this.set, _set_callback);
    this._flush_one_queue(SET_ONCE_ACTION, this.set_once, _set_once_callback);
    this._flush_one_queue(UNSET_ACTION, this.unset, _unset_callback, function(queue) { return _.keys(queue); });
    this._flush_one_queue(ADD_ACTION, this.increment, _add_callback);
    this._flush_one_queue(UNION_ACTION, this.union, _union_callback);

    // we have to fire off each $append individually since there is
    // no concat method server side
    if (!_.isUndefined($append_queue) && _.isArray($append_queue) && $append_queue.length) {
        var $append_item;
        var append_callback = function(response, data) {
            if (response === 0) {
                _this._mixpanel['persistence']._add_to_people_queue(APPEND_ACTION, $append_item);
            }
            if (!_.isUndefined(_append_callback)) {
                _append_callback(response, data);
            }
        };
        for (var i = $append_queue.length - 1; i >= 0; i--) {
            $append_item = $append_queue.pop();
            if (!_.isEmptyObject($append_item)) {
                _this.append($append_item, append_callback);
            }
        }
        // Save the shortened append queue
        _this._mixpanel['persistence'].save();
    }

    // same for $remove
    if (!_.isUndefined($remove_queue) && _.isArray($remove_queue) && $remove_queue.length) {
        var $remove_item;
        var remove_callback = function(response, data) {
            if (response === 0) {
                _this._mixpanel['persistence']._add_to_people_queue(REMOVE_ACTION, $remove_item);
            }
            if (!_.isUndefined(_remove_callback)) {
                _remove_callback(response, data);
            }
        };
        for (var j = $remove_queue.length - 1; j >= 0; j--) {
            $remove_item = $remove_queue.pop();
            if (!_.isEmptyObject($remove_item)) {
                _this.remove($remove_item, remove_callback);
            }
        }
        _this._mixpanel['persistence'].save();
    }
};

MixpanelPeople.prototype._is_reserved_property = function(prop) {
    return prop === '$distinct_id' || prop === '$token' || prop === '$device_id' || prop === '$user_id' || prop === '$had_persisted_distinct_id';
};

// MixpanelPeople Exports
MixpanelPeople.prototype['set']           = MixpanelPeople.prototype.set;
MixpanelPeople.prototype['set_once']      = MixpanelPeople.prototype.set_once;
MixpanelPeople.prototype['unset']         = MixpanelPeople.prototype.unset;
MixpanelPeople.prototype['increment']     = MixpanelPeople.prototype.increment;
MixpanelPeople.prototype['append']        = MixpanelPeople.prototype.append;
MixpanelPeople.prototype['remove']        = MixpanelPeople.prototype.remove;
MixpanelPeople.prototype['union']         = MixpanelPeople.prototype.union;
MixpanelPeople.prototype['track_charge']  = MixpanelPeople.prototype.track_charge;
MixpanelPeople.prototype['clear_charges'] = MixpanelPeople.prototype.clear_charges;
MixpanelPeople.prototype['delete_user']   = MixpanelPeople.prototype.delete_user;
MixpanelPeople.prototype['toString']      = MixpanelPeople.prototype.toString;

/*
 * Constants
 */
/** @const */ var SET_QUEUE_KEY          = '__mps';
/** @const */ var SET_ONCE_QUEUE_KEY     = '__mpso';
/** @const */ var UNSET_QUEUE_KEY        = '__mpus';
/** @const */ var ADD_QUEUE_KEY          = '__mpa';
/** @const */ var APPEND_QUEUE_KEY       = '__mpap';
/** @const */ var REMOVE_QUEUE_KEY       = '__mpr';
/** @const */ var UNION_QUEUE_KEY        = '__mpu';
// This key is deprecated, but we want to check for it to see whether aliasing is allowed.
/** @const */ var PEOPLE_DISTINCT_ID_KEY = '$people_distinct_id';
/** @const */ var ALIAS_ID_KEY           = '__alias';
/** @const */ var EVENT_TIMERS_KEY       = '__timers';
/** @const */ var RESERVED_PROPERTIES = [
    SET_QUEUE_KEY,
    SET_ONCE_QUEUE_KEY,
    UNSET_QUEUE_KEY,
    ADD_QUEUE_KEY,
    APPEND_QUEUE_KEY,
    REMOVE_QUEUE_KEY,
    UNION_QUEUE_KEY,
    PEOPLE_DISTINCT_ID_KEY,
    ALIAS_ID_KEY,
    EVENT_TIMERS_KEY
];

/**
 * Mixpanel Persistence Object
 * @constructor
 */
var MixpanelPersistence = function(config) {
    this['props'] = {};
    this.campaign_params_saved = false;

    if (config['persistence_name']) {
        this.name = 'mp_' + config['persistence_name'];
    } else {
        this.name = 'mp_' + config['token'] + '_mixpanel';
    }

    var storage_type = config['persistence'];
    if (storage_type !== 'cookie' && storage_type !== 'localStorage') {
        console$1.critical('Unknown persistence type ' + storage_type + '; falling back to cookie');
        storage_type = config['persistence'] = 'cookie';
    }

    if (storage_type === 'localStorage' && _.localStorage.is_supported()) {
        this.storage = _.localStorage;
    } else {
        this.storage = _.cookie;
    }

    this.load();
    this.update_config(config);
    this.upgrade(config);
    this.save();
};

MixpanelPersistence.prototype.properties = function() {
    var p = {};
    // Filter out reserved properties
    _.each(this['props'], function(v, k) {
        if (!_.include(RESERVED_PROPERTIES, k)) {
            p[k] = v;
        }
    });
    return p;
};

MixpanelPersistence.prototype.load = function() {
    if (this.disabled) { return; }

    var entry = this.storage.parse(this.name);

    if (entry) {
        this['props'] = _.extend({}, entry);
    }
};

MixpanelPersistence.prototype.upgrade = function(config) {
    var upgrade_from_old_lib = config['upgrade'],
        old_cookie_name,
        old_cookie;

    if (upgrade_from_old_lib) {
        old_cookie_name = 'mp_super_properties';
        // Case where they had a custom cookie name before.
        if (typeof(upgrade_from_old_lib) === 'string') {
            old_cookie_name = upgrade_from_old_lib;
        }

        old_cookie = this.storage.parse(old_cookie_name);

        // remove the cookie
        this.storage.remove(old_cookie_name);
        this.storage.remove(old_cookie_name, true);

        if (old_cookie) {
            this['props'] = _.extend(
                this['props'],
                old_cookie['all'],
                old_cookie['events']
            );
        }
    }

    if (!config['cookie_name'] && config['name'] !== 'mixpanel') {
        // special case to handle people with cookies of the form
        // mp_TOKEN_INSTANCENAME from the first release of this library
        old_cookie_name = 'mp_' + config['token'] + '_' + config['name'];
        old_cookie = this.storage.parse(old_cookie_name);

        if (old_cookie) {
            this.storage.remove(old_cookie_name);
            this.storage.remove(old_cookie_name, true);

            // Save the prop values that were in the cookie from before -
            // this should only happen once as we delete the old one.
            this.register_once(old_cookie);
        }
    }

    if (this.storage === _.localStorage) {
        old_cookie = _.cookie.parse(this.name);

        _.cookie.remove(this.name);
        _.cookie.remove(this.name, true);

        if (old_cookie) {
            this.register_once(old_cookie);
        }
    }
};

MixpanelPersistence.prototype.save = function() {
    if (this.disabled) { return; }
    this.storage.set(
        this.name,
        _.JSONEncode(this['props']),
        this.expire_days,
        this.cross_subdomain,
        this.secure,
        this.cross_site,
        this.cookie_domain
    );
};

MixpanelPersistence.prototype.remove = function() {
    // remove both domain and subdomain cookies
    this.storage.remove(this.name, false, this.cookie_domain);
    this.storage.remove(this.name, true, this.cookie_domain);
};

// removes the storage entry and deletes all loaded data
// forced name for tests
MixpanelPersistence.prototype.clear = function() {
    this.remove();
    this['props'] = {};
};

/**
* @param {Object} props
* @param {*=} default_value
* @param {number=} days
*/
MixpanelPersistence.prototype.register_once = function(props, default_value, days) {
    if (_.isObject(props)) {
        if (typeof(default_value) === 'undefined') { default_value = 'None'; }
        this.expire_days = (typeof(days) === 'undefined') ? this.default_expiry : days;

        _.each(props, function(val, prop) {
            if (!this['props'].hasOwnProperty(prop) || this['props'][prop] === default_value) {
                this['props'][prop] = val;
            }
        }, this);

        this.save();

        return true;
    }
    return false;
};

/**
* @param {Object} props
* @param {number=} days
*/
MixpanelPersistence.prototype.register = function(props, days) {
    if (_.isObject(props)) {
        this.expire_days = (typeof(days) === 'undefined') ? this.default_expiry : days;

        _.extend(this['props'], props);

        this.save();

        return true;
    }
    return false;
};

MixpanelPersistence.prototype.unregister = function(prop) {
    if (prop in this['props']) {
        delete this['props'][prop];
        this.save();
    }
};

MixpanelPersistence.prototype.update_campaign_params = function() {
    if (!this.campaign_params_saved) {
        this.register_once(_.info.campaignParams());
        this.campaign_params_saved = true;
    }
};

MixpanelPersistence.prototype.update_search_keyword = function(referrer) {
    this.register(_.info.searchInfo(referrer));
};

// EXPORTED METHOD, we test this directly.
MixpanelPersistence.prototype.update_referrer_info = function(referrer) {
    // If referrer doesn't exist, we want to note the fact that it was type-in traffic.
    this.register_once({
        '$initial_referrer': referrer || '$direct',
        '$initial_referring_domain': _.info.referringDomain(referrer) || '$direct'
    }, '');
};

MixpanelPersistence.prototype.get_referrer_info = function() {
    return _.strip_empty_properties({
        '$initial_referrer': this['props']['$initial_referrer'],
        '$initial_referring_domain': this['props']['$initial_referring_domain']
    });
};

// safely fills the passed in object with stored properties,
// does not override any properties defined in both
// returns the passed in object
MixpanelPersistence.prototype.safe_merge = function(props) {
    _.each(this['props'], function(val, prop) {
        if (!(prop in props)) {
            props[prop] = val;
        }
    });

    return props;
};

MixpanelPersistence.prototype.update_config = function(config) {
    this.default_expiry = this.expire_days = config['cookie_expiration'];
    this.set_disabled(config['disable_persistence']);
    this.set_cookie_domain(config['cookie_domain']);
    this.set_cross_site(config['cross_site_cookie']);
    this.set_cross_subdomain(config['cross_subdomain_cookie']);
    this.set_secure(config['secure_cookie']);
};

MixpanelPersistence.prototype.set_disabled = function(disabled) {
    this.disabled = disabled;
    if (this.disabled) {
        this.remove();
    } else {
        this.save();
    }
};

MixpanelPersistence.prototype.set_cookie_domain = function(cookie_domain) {
    if (cookie_domain !== this.cookie_domain) {
        this.remove();
        this.cookie_domain = cookie_domain;
        this.save();
    }
};

MixpanelPersistence.prototype.set_cross_site = function(cross_site) {
    if (cross_site !== this.cross_site) {
        this.cross_site = cross_site;
        this.remove();
        this.save();
    }
};

MixpanelPersistence.prototype.set_cross_subdomain = function(cross_subdomain) {
    if (cross_subdomain !== this.cross_subdomain) {
        this.cross_subdomain = cross_subdomain;
        this.remove();
        this.save();
    }
};

MixpanelPersistence.prototype.get_cross_subdomain = function() {
    return this.cross_subdomain;
};

MixpanelPersistence.prototype.set_secure = function(secure) {
    if (secure !== this.secure) {
        this.secure = secure ? true : false;
        this.remove();
        this.save();
    }
};

MixpanelPersistence.prototype._add_to_people_queue = function(queue, data) {
    var q_key = this._get_queue_key(queue),
        q_data = data[queue],
        set_q = this._get_or_create_queue(SET_ACTION),
        set_once_q = this._get_or_create_queue(SET_ONCE_ACTION),
        unset_q = this._get_or_create_queue(UNSET_ACTION),
        add_q = this._get_or_create_queue(ADD_ACTION),
        union_q = this._get_or_create_queue(UNION_ACTION),
        remove_q = this._get_or_create_queue(REMOVE_ACTION, []),
        append_q = this._get_or_create_queue(APPEND_ACTION, []);

    if (q_key === SET_QUEUE_KEY) {
        // Update the set queue - we can override any existing values
        _.extend(set_q, q_data);
        // if there was a pending increment, override it
        // with the set.
        this._pop_from_people_queue(ADD_ACTION, q_data);
        // if there was a pending union, override it
        // with the set.
        this._pop_from_people_queue(UNION_ACTION, q_data);
        this._pop_from_people_queue(UNSET_ACTION, q_data);
    } else if (q_key === SET_ONCE_QUEUE_KEY) {
        // only queue the data if there is not already a set_once call for it.
        _.each(q_data, function(v, k) {
            if (!(k in set_once_q)) {
                set_once_q[k] = v;
            }
        });
        this._pop_from_people_queue(UNSET_ACTION, q_data);
    } else if (q_key === UNSET_QUEUE_KEY) {
        _.each(q_data, function(prop) {

            // undo previously-queued actions on this key
            _.each([set_q, set_once_q, add_q, union_q], function(enqueued_obj) {
                if (prop in enqueued_obj) {
                    delete enqueued_obj[prop];
                }
            });
            _.each(append_q, function(append_obj) {
                if (prop in append_obj) {
                    delete append_obj[prop];
                }
            });

            unset_q[prop] = true;

        });
    } else if (q_key === ADD_QUEUE_KEY) {
        _.each(q_data, function(v, k) {
            // If it exists in the set queue, increment
            // the value
            if (k in set_q) {
                set_q[k] += v;
            } else {
                // If it doesn't exist, update the add
                // queue
                if (!(k in add_q)) {
                    add_q[k] = 0;
                }
                add_q[k] += v;
            }
        }, this);
        this._pop_from_people_queue(UNSET_ACTION, q_data);
    } else if (q_key === UNION_QUEUE_KEY) {
        _.each(q_data, function(v, k) {
            if (_.isArray(v)) {
                if (!(k in union_q)) {
                    union_q[k] = [];
                }
                // We may send duplicates, the server will dedup them.
                union_q[k] = union_q[k].concat(v);
            }
        });
        this._pop_from_people_queue(UNSET_ACTION, q_data);
    } else if (q_key === REMOVE_QUEUE_KEY) {
        remove_q.push(q_data);
        this._pop_from_people_queue(APPEND_ACTION, q_data);
    } else if (q_key === APPEND_QUEUE_KEY) {
        append_q.push(q_data);
        this._pop_from_people_queue(UNSET_ACTION, q_data);
    }

    console$1.log('MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):');
    console$1.log(data);

    this.save();
};

MixpanelPersistence.prototype._pop_from_people_queue = function(queue, data) {
    var q = this._get_queue(queue);
    if (!_.isUndefined(q)) {
        _.each(data, function(v, k) {
            if (queue === APPEND_ACTION || queue === REMOVE_ACTION) {
                // list actions: only remove if both k+v match
                // e.g. remove should not override append in a case like
                // append({foo: 'bar'}); remove({foo: 'qux'})
                _.each(q, function(queued_action) {
                    if (queued_action[k] === v) {
                        delete queued_action[k];
                    }
                });
            } else {
                delete q[k];
            }
        }, this);

        this.save();
    }
};

MixpanelPersistence.prototype._get_queue_key = function(queue) {
    if (queue === SET_ACTION) {
        return SET_QUEUE_KEY;
    } else if (queue === SET_ONCE_ACTION) {
        return SET_ONCE_QUEUE_KEY;
    } else if (queue === UNSET_ACTION) {
        return UNSET_QUEUE_KEY;
    } else if (queue === ADD_ACTION) {
        return ADD_QUEUE_KEY;
    } else if (queue === APPEND_ACTION) {
        return APPEND_QUEUE_KEY;
    } else if (queue === REMOVE_ACTION) {
        return REMOVE_QUEUE_KEY;
    } else if (queue === UNION_ACTION) {
        return UNION_QUEUE_KEY;
    } else {
        console$1.error('Invalid queue:', queue);
    }
};

MixpanelPersistence.prototype._get_queue = function(queue) {
    return this['props'][this._get_queue_key(queue)];
};
MixpanelPersistence.prototype._get_or_create_queue = function(queue, default_val) {
    var key = this._get_queue_key(queue);
    default_val = _.isUndefined(default_val) ? {} : default_val;

    return this['props'][key] || (this['props'][key] = default_val);
};

MixpanelPersistence.prototype.set_event_timer = function(event_name, timestamp) {
    var timers = this['props'][EVENT_TIMERS_KEY] || {};
    timers[event_name] = timestamp;
    this['props'][EVENT_TIMERS_KEY] = timers;
    this.save();
};

MixpanelPersistence.prototype.remove_event_timer = function(event_name) {
    var timers = this['props'][EVENT_TIMERS_KEY] || {};
    var timestamp = timers[event_name];
    if (!_.isUndefined(timestamp)) {
        delete this['props'][EVENT_TIMERS_KEY][event_name];
        this.save();
    }
    return timestamp;
};

/*
 * Mixpanel JS Library
 *
 * Copyright 2012, Mixpanel, Inc. All Rights Reserved
 * http://mixpanel.com/
 *
 * Includes portions of Underscore.js
 * http://documentcloud.github.com/underscore/
 * (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
 * Released under the MIT License.
 */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name mixpanel-2.8.min.js
// ==/ClosureCompiler==

/*
SIMPLE STYLE GUIDE:

this.x === public function
this._x === internal - only use within this file
this.__x === private - only use within the class

Globals should be all caps
*/

var init_type;       // MODULE or SNIPPET loader
var mixpanel_master; // main mixpanel instance / object
var INIT_MODULE  = 0;
var INIT_SNIPPET = 1;

var IDENTITY_FUNC = function(x) {return x;};
var NOOP_FUNC = function() {};

/** @const */ var PRIMARY_INSTANCE_NAME = 'mixpanel';
/** @const */ var PAYLOAD_TYPE_BASE64   = 'base64';
/** @const */ var PAYLOAD_TYPE_JSON     = 'json';


/*
 * Dynamic... constants? Is that an oxymoron?
 */
// http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
// https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#withCredentials
var USE_XHR = (window$1.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());

// IE<10 does not support cross-origin XHR's but script tags
// with defer won't block window.onload; ENQUEUE_REQUESTS
// should only be true for Opera<12
var ENQUEUE_REQUESTS = !USE_XHR && (userAgent.indexOf('MSIE') === -1) && (userAgent.indexOf('Mozilla') === -1);

// save reference to navigator.sendBeacon so it can be minified
var sendBeacon = null;
if (navigator['sendBeacon']) {
    sendBeacon = function() {
        // late reference to navigator.sendBeacon to allow patching/spying
        return navigator['sendBeacon'].apply(navigator, arguments);
    };
}

/*
 * Module-level globals
 */
var DEFAULT_CONFIG = {
    'api_host':                          'https://api-js.mixpanel.com',
    'api_method':                        'POST',
    'api_transport':                     'XHR',
    'api_payload_format':                PAYLOAD_TYPE_BASE64,
    'app_host':                          'https://mixpanel.com',
    'cdn':                               'https://cdn.mxpnl.com',
    'cross_site_cookie':                 false,
    'cross_subdomain_cookie':            true,
    'error_reporter':                    NOOP_FUNC,
    'persistence':                       'cookie',
    'persistence_name':                  '',
    'cookie_domain':                     '',
    'cookie_name':                       '',
    'loaded':                            NOOP_FUNC,
    'store_google':                      true,
    'save_referrer':                     true,
    'test':                              false,
    'verbose':                           false,
    'img':                               false,
    'debug':                             false,
    'track_links_timeout':               300,
    'cookie_expiration':                 365,
    'upgrade':                           false,
    'disable_persistence':               false,
    'disable_cookie':                    false,
    'secure_cookie':                     false,
    'ip':                                true,
    'opt_out_tracking_by_default':       false,
    'opt_out_persistence_by_default':    false,
    'opt_out_tracking_persistence_type': 'localStorage',
    'opt_out_tracking_cookie_prefix':    null,
    'property_blacklist':                [],
    'xhr_headers':                       {}, // { header: value, header2: value }
    'ignore_dnt':                        false,
    'batch_requests':                    true,
    'batch_size':                        50,
    'batch_flush_interval_ms':           5000,
    'batch_request_timeout_ms':          90000,
    'batch_autostart':                   true,
    'hooks':                             {}
};

var DOM_LOADED = false;

/**
 * Mixpanel Library Object
 * @constructor
 */
var MixpanelLib = function() {};


/**
 * create_mplib(token:string, config:object, name:string)
 *
 * This function is used by the init method of MixpanelLib objects
 * as well as the main initializer at the end of the JSLib (that
 * initializes document.mixpanel as well as any additional instances
 * declared before this file has loaded).
 */
var create_mplib = function(token, config, name) {
    var instance,
        target = (name === PRIMARY_INSTANCE_NAME) ? mixpanel_master : mixpanel_master[name];

    if (target && init_type === INIT_MODULE) {
        instance = target;
    } else {
        if (target && !_.isArray(target)) {
            console$1.error('You have already initialized ' + name);
            return;
        }
        instance = new MixpanelLib();
    }

    instance._cached_groups = {}; // cache groups in a pool

    instance._init(token, config, name);

    instance['people'] = new MixpanelPeople();
    instance['people']._init(instance);

    // if any instance on the page has debug = true, we set the
    // global debug to be true
    Config.DEBUG = Config.DEBUG || instance.get_config('debug');

    // if target is not defined, we called init after the lib already
    // loaded, so there won't be an array of things to execute
    if (!_.isUndefined(target) && _.isArray(target)) {
        // Crunch through the people queue first - we queue this data up &
        // flush on identify, so it's better to do all these operations first
        instance._execute_array.call(instance['people'], target['people']);
        instance._execute_array(target);
    }

    return instance;
};

// Initialization methods

/**
 * This function initializes a new instance of the Mixpanel tracking object.
 * All new instances are added to the main mixpanel object as sub properties (such as
 * mixpanel.library_name) and also returned by this function. To define a
 * second instance on the page, you would call:
 *
 *     mixpanel.init('new token', { your: 'config' }, 'library_name');
 *
 * and use it like so:
 *
 *     mixpanel.library_name.track(...);
 *
 * @param {String} token   Your Mixpanel API token
 * @param {Object} [config]  A dictionary of config options to override. <a href="https://github.com/mixpanel/mixpanel-js/blob/8b2e1f7b/src/mixpanel-core.js#L87-L110">See a list of default config options</a>.
 * @param {String} [name]    The name for the new mixpanel instance that you want created
 */
MixpanelLib.prototype.init = function (token, config, name) {
    if (_.isUndefined(name)) {
        this.report_error('You must name your new library: init(token, config, name)');
        return;
    }
    if (name === PRIMARY_INSTANCE_NAME) {
        this.report_error('You must initialize the main mixpanel object right after you include the Mixpanel js snippet');
        return;
    }

    var instance = create_mplib(token, config, name);
    mixpanel_master[name] = instance;
    instance._loaded();

    return instance;
};

// mixpanel._init(token:string, config:object, name:string)
//
// This function sets up the current instance of the mixpanel
// library.  The difference between this method and the init(...)
// method is this one initializes the actual instance, whereas the
// init(...) method sets up a new library and calls _init on it.
//
MixpanelLib.prototype._init = function(token, config, name) {
    config = config || {};

    this['__loaded'] = true;
    this['config'] = {};

    var variable_features = {};

    // default to JSON payload for standard mixpanel.com API hosts
    if (!('api_payload_format' in config)) {
        var api_host = config['api_host'] || DEFAULT_CONFIG['api_host'];
        if (api_host.match(/\.mixpanel\.com$/)) {
            variable_features['api_payload_format'] = PAYLOAD_TYPE_JSON;
        }
    }

    this.set_config(_.extend({}, DEFAULT_CONFIG, variable_features, config, {
        'name': name,
        'token': token,
        'callback_fn': ((name === PRIMARY_INSTANCE_NAME) ? name : PRIMARY_INSTANCE_NAME + '.' + name) + '._jsc'
    }));

    this['_jsc'] = NOOP_FUNC;

    this.__dom_loaded_queue = [];
    this.__request_queue = [];
    this.__disabled_events = [];
    this._flags = {
        'disable_all_events': false,
        'identify_called': false
    };

    // set up request queueing/batching
    this.request_batchers = {};
    this._batch_requests = this.get_config('batch_requests');
    if (this._batch_requests) {
        if (!_.localStorage.is_supported(true) || !USE_XHR) {
            this._batch_requests = false;
            console$1.log('Turning off Mixpanel request-queueing; needs XHR and localStorage support');
        } else {
            this.init_batchers();
            if (sendBeacon && window$1.addEventListener) {
                // Before page closes or hides (user tabs away etc), attempt to flush any events
                // queued up via navigator.sendBeacon. Since sendBeacon doesn't report success/failure,
                // events will not be removed from the persistent store; if the site is loaded again,
                // the events will be flushed again on startup and deduplicated on the Mixpanel server
                // side.
                // There is no reliable way to capture only page close events, so we lean on the
                // visibilitychange and pagehide events as recommended at
                // https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event#usage_notes.
                // These events fire when the user clicks away from the current page/tab, so will occur
                // more frequently than page unload, but are the only mechanism currently for capturing
                // this scenario somewhat reliably.
                var flush_on_unload = _.bind(function() {
                    if (!this.request_batchers.events.stopped) {
                        this.request_batchers.events.flush({unloading: true});
                    }
                }, this);
                window$1.addEventListener('pagehide', function(ev) {
                    if (ev['persisted']) {
                        flush_on_unload();
                    }
                });
                window$1.addEventListener('visibilitychange', function() {
                    if (document$1['visibilityState'] === 'hidden') {
                        flush_on_unload();
                    }
                });
            }
        }
    }

    this['persistence'] = this['cookie'] = new MixpanelPersistence(this['config']);
    this.unpersisted_superprops = {};
    this._gdpr_init();

    var uuid = _.UUID();
    if (!this.get_distinct_id()) {
        // There is no need to set the distinct id
        // or the device id if something was already stored
        // in the persitence
        this.register_once({
            'distinct_id': uuid,
            '$device_id': uuid
        }, '');
    }
};

// Private methods

MixpanelLib.prototype._loaded = function() {
    this.get_config('loaded')(this);
    this._set_default_superprops();
};

// update persistence with info on referrer, UTM params, etc
MixpanelLib.prototype._set_default_superprops = function() {
    this['persistence'].update_search_keyword(document$1.referrer);
    if (this.get_config('store_google')) {
        this['persistence'].update_campaign_params();
    }
    if (this.get_config('save_referrer')) {
        this['persistence'].update_referrer_info(document$1.referrer);
    }
};

MixpanelLib.prototype._dom_loaded = function() {
    _.each(this.__dom_loaded_queue, function(item) {
        this._track_dom.apply(this, item);
    }, this);

    if (!this.has_opted_out_tracking()) {
        _.each(this.__request_queue, function(item) {
            this._send_request.apply(this, item);
        }, this);
    }

    delete this.__dom_loaded_queue;
    delete this.__request_queue;
};

MixpanelLib.prototype._track_dom = function(DomClass, args) {
    if (this.get_config('img')) {
        this.report_error('You can\'t use DOM tracking functions with img = true.');
        return false;
    }

    if (!DOM_LOADED) {
        this.__dom_loaded_queue.push([DomClass, args]);
        return false;
    }

    var dt = new DomClass().init(this);
    return dt.track.apply(dt, args);
};

/**
 * _prepare_callback() should be called by callers of _send_request for use
 * as the callback argument.
 *
 * If there is no callback, this returns null.
 * If we are going to make XHR/XDR requests, this returns a function.
 * If we are going to use script tags, this returns a string to use as the
 * callback GET param.
 */
MixpanelLib.prototype._prepare_callback = function(callback, data) {
    if (_.isUndefined(callback)) {
        return null;
    }

    if (USE_XHR) {
        var callback_function = function(response) {
            callback(response, data);
        };
        return callback_function;
    } else {
        // if the user gives us a callback, we store as a random
        // property on this instances jsc function and update our
        // callback string to reflect that.
        var jsc = this['_jsc'];
        var randomized_cb = '' + Math.floor(Math.random() * 100000000);
        var callback_string = this.get_config('callback_fn') + '[' + randomized_cb + ']';
        jsc[randomized_cb] = function(response) {
            delete jsc[randomized_cb];
            callback(response, data);
        };
        return callback_string;
    }
};

MixpanelLib.prototype._send_request = function(url, data, options, callback) {
    var succeeded = true;

    if (ENQUEUE_REQUESTS) {
        this.__request_queue.push(arguments);
        return succeeded;
    }

    var DEFAULT_OPTIONS = {
        method: this.get_config('api_method'),
        transport: this.get_config('api_transport'),
        verbose: this.get_config('verbose')
    };
    var body_data = null;

    if (!callback && (_.isFunction(options) || typeof options === 'string')) {
        callback = options;
        options = null;
    }
    options = _.extend(DEFAULT_OPTIONS, options || {});
    if (!USE_XHR) {
        options.method = 'GET';
    }
    var use_post = options.method === 'POST';
    var use_sendBeacon = sendBeacon && use_post && options.transport.toLowerCase() === 'sendbeacon';

    // needed to correctly format responses
    var verbose_mode = options.verbose;
    if (data['verbose']) { verbose_mode = true; }

    if (this.get_config('test')) { data['test'] = 1; }
    if (verbose_mode) { data['verbose'] = 1; }
    if (this.get_config('img')) { data['img'] = 1; }
    if (!USE_XHR) {
        if (callback) {
            data['callback'] = callback;
        } else if (verbose_mode || this.get_config('test')) {
            // Verbose output (from verbose mode, or an error in test mode) is a json blob,
            // which by itself is not valid javascript. Without a callback, this verbose output will
            // cause an error when returned via jsonp, so we force a no-op callback param.
            // See the ECMA script spec: http://www.ecma-international.org/ecma-262/5.1/#sec-12.4
            data['callback'] = '(function(){})';
        }
    }

    data['ip'] = this.get_config('ip')?1:0;
    data['_'] = new Date().getTime().toString();

    if (use_post) {
        body_data = 'data=' + encodeURIComponent(data['data']);
        delete data['data'];
    }

    url += '?' + _.HTTPBuildQuery(data);

    var lib = this;
    if ('img' in data) {
        var img = document$1.createElement('img');
        img.src = url;
        document$1.body.appendChild(img);
    } else if (use_sendBeacon) {
        try {
            succeeded = sendBeacon(url, body_data);
        } catch (e) {
            lib.report_error(e);
            succeeded = false;
        }
        try {
            if (callback) {
                callback(succeeded ? 1 : 0);
            }
        } catch (e) {
            lib.report_error(e);
        }
    } else if (USE_XHR) {
        try {
            var req = new XMLHttpRequest();
            req.open(options.method, url, true);

            var headers = this.get_config('xhr_headers');
            if (use_post) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            _.each(headers, function(headerValue, headerName) {
                req.setRequestHeader(headerName, headerValue);
            });

            if (options.timeout_ms && typeof req.timeout !== 'undefined') {
                req.timeout = options.timeout_ms;
                var start_time = new Date().getTime();
            }

            // send the mp_optout cookie
            // withCredentials cannot be modified until after calling .open on Android and Mobile Safari
            req.withCredentials = true;
            req.onreadystatechange = function () {
                if (req.readyState === 4) { // XMLHttpRequest.DONE == 4, except in safari 4
                    if (req.status === 200) {
                        if (callback) {
                            if (verbose_mode) {
                                var response;
                                try {
                                    response = _.JSONDecode(req.responseText);
                                } catch (e) {
                                    lib.report_error(e);
                                    if (options.ignore_json_errors) {
                                        response = req.responseText;
                                    } else {
                                        return;
                                    }
                                }
                                callback(response);
                            } else {
                                callback(Number(req.responseText));
                            }
                        }
                    } else {
                        var error;
                        if (
                            req.timeout &&
                            !req.status &&
                            new Date().getTime() - start_time >= req.timeout
                        ) {
                            error = 'timeout';
                        } else {
                            error = 'Bad HTTP status: ' + req.status + ' ' + req.statusText;
                        }
                        lib.report_error(error);
                        if (callback) {
                            if (verbose_mode) {
                                callback({status: 0, error: error, xhr_req: req});
                            } else {
                                callback(0);
                            }
                        }
                    }
                }
            };
            req.send(body_data);
        } catch (e) {
            lib.report_error(e);
            succeeded = false;
        }
    } else {
        var script = document$1.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.src = url;
        var s = document$1.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
    }

    return succeeded;
};

/**
 * _execute_array() deals with processing any mixpanel function
 * calls that were called before the Mixpanel library were loaded
 * (and are thus stored in an array so they can be called later)
 *
 * Note: we fire off all the mixpanel function calls && user defined
 * functions BEFORE we fire off mixpanel tracking calls. This is so
 * identify/register/set_config calls can properly modify early
 * tracking calls.
 *
 * @param {Array} array
 */
MixpanelLib.prototype._execute_array = function(array) {
    var fn_name, alias_calls = [], other_calls = [], tracking_calls = [];
    _.each(array, function(item) {
        if (item) {
            fn_name = item[0];
            if (_.isArray(fn_name)) {
                tracking_calls.push(item); // chained call e.g. mixpanel.get_group().set()
            } else if (typeof(item) === 'function') {
                item.call(this);
            } else if (_.isArray(item) && fn_name === 'alias') {
                alias_calls.push(item);
            } else if (_.isArray(item) && fn_name.indexOf('track') !== -1 && typeof(this[fn_name]) === 'function') {
                tracking_calls.push(item);
            } else {
                other_calls.push(item);
            }
        }
    }, this);

    var execute = function(calls, context) {
        _.each(calls, function(item) {
            if (_.isArray(item[0])) {
                // chained call
                var caller = context;
                _.each(item, function(call) {
                    caller = caller[call[0]].apply(caller, call.slice(1));
                });
            } else {
                this[item[0]].apply(this, item.slice(1));
            }
        }, context);
    };

    execute(alias_calls, this);
    execute(other_calls, this);
    execute(tracking_calls, this);
};

// request queueing utils

MixpanelLib.prototype.are_batchers_initialized = function() {
    return !!this.request_batchers.events;
};

MixpanelLib.prototype.init_batchers = function() {
    var token = this.get_config('token');
    if (!this.are_batchers_initialized()) {
        var batcher_for = _.bind(function(attrs) {
            return new RequestBatcher(
                '__mpq_' + token + attrs.queue_suffix,
                {
                    libConfig: this['config'],
                    sendRequestFunc: _.bind(function(data, options, cb) {
                        this._send_request(
                            this.get_config('api_host') + attrs.endpoint,
                            this._encode_data_for_request(data),
                            options,
                            this._prepare_callback(cb, data)
                        );
                    }, this),
                    beforeSendHook: _.bind(function(item) {
                        return this._run_hook('before_send_' + attrs.type, item);
                    }, this),
                    errorReporter: this.get_config('error_reporter'),
                    stopAllBatchingFunc: _.bind(this.stop_batch_senders, this)
                }
            );
        }, this);
        this.request_batchers = {
            events: batcher_for({type: 'events', endpoint: '/track/', queue_suffix: '_ev'}),
            people: batcher_for({type: 'people', endpoint: '/engage/', queue_suffix: '_pp'}),
            groups: batcher_for({type: 'groups', endpoint: '/groups/', queue_suffix: '_gr'})
        };
    }
    if (this.get_config('batch_autostart')) {
        this.start_batch_senders();
    }
};

MixpanelLib.prototype.start_batch_senders = function() {
    if (this.are_batchers_initialized()) {
        this._batch_requests = true;
        _.each(this.request_batchers, function(batcher) {
            batcher.start();
        });
    }
};

MixpanelLib.prototype.stop_batch_senders = function() {
    this._batch_requests = false;
    _.each(this.request_batchers, function(batcher) {
        batcher.stop();
        batcher.clear();
    });
};

/**
 * push() keeps the standard async-array-push
 * behavior around after the lib is loaded.
 * This is only useful for external integrations that
 * do not wish to rely on our convenience methods
 * (created in the snippet).
 *
 * ### Usage:
 *     mixpanel.push(['register', { a: 'b' }]);
 *
 * @param {Array} item A [function_name, args...] array to be executed
 */
MixpanelLib.prototype.push = function(item) {
    this._execute_array([item]);
};

/**
 * Disable events on the Mixpanel object. If passed no arguments,
 * this function disables tracking of any event. If passed an
 * array of event names, those events will be disabled, but other
 * events will continue to be tracked.
 *
 * Note: this function does not stop other mixpanel functions from
 * firing, such as register() or people.set().
 *
 * @param {Array} [events] An array of event names to disable
 */
MixpanelLib.prototype.disable = function(events) {
    if (typeof(events) === 'undefined') {
        this._flags.disable_all_events = true;
    } else {
        this.__disabled_events = this.__disabled_events.concat(events);
    }
};

MixpanelLib.prototype._encode_data_for_request = function(data) {
    var encoded_data = _.JSONEncode(data);
    if (this.get_config('api_payload_format') === PAYLOAD_TYPE_BASE64) {
        encoded_data = _.base64Encode(encoded_data);
    }
    return {'data': encoded_data};
};

// internal method for handling track vs batch-enqueue logic
MixpanelLib.prototype._track_or_batch = function(options, callback) {
    var truncated_data = _.truncate(options.data, 255);
    var endpoint = options.endpoint;
    var batcher = options.batcher;
    var should_send_immediately = options.should_send_immediately;
    var send_request_options = options.send_request_options || {};
    callback = callback || NOOP_FUNC;

    var request_enqueued_or_initiated = true;
    var send_request_immediately = _.bind(function() {
        if (!send_request_options.skip_hooks) {
            truncated_data = this._run_hook('before_send_' + options.type, truncated_data);
        }
        if (truncated_data) {
            console$1.log('MIXPANEL REQUEST:');
            console$1.log(truncated_data);
            return this._send_request(
                endpoint,
                this._encode_data_for_request(truncated_data),
                send_request_options,
                this._prepare_callback(callback, truncated_data)
            );
        } else {
            return null;
        }
    }, this);

    if (this._batch_requests && !should_send_immediately) {
        batcher.enqueue(truncated_data, function(succeeded) {
            if (succeeded) {
                callback(1, truncated_data);
            } else {
                send_request_immediately();
            }
        });
    } else {
        request_enqueued_or_initiated = send_request_immediately();
    }

    return request_enqueued_or_initiated && truncated_data;
};

/**
 * Track an event. This is the most important and
 * frequently used Mixpanel function.
 *
 * ### Usage:
 *
 *     // track an event named 'Registered'
 *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
 *
 *     // track an event using navigator.sendBeacon
 *     mixpanel.track('Left page', {'duration_seconds': 35}, {transport: 'sendBeacon'});
 *
 * To track link clicks or form submissions, see track_links() or track_forms().
 *
 * @param {String} event_name The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.
 * @param {Object} [properties] A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.
 * @param {Object} [options] Optional configuration for this track request.
 * @param {String} [options.transport] Transport method for network request ('xhr' or 'sendBeacon').
 * @param {Boolean} [options.send_immediately] Whether to bypass batching/queueing and send track request immediately.
 * @param {Function} [callback] If provided, the callback function will be called after tracking the event.
 * @returns {Boolean|Object} If the tracking request was successfully initiated/queued, an object
 * with the tracking payload sent to the API server is returned; otherwise false.
 */
MixpanelLib.prototype.track = addOptOutCheckMixpanelLib(function(event_name, properties, options, callback) {
    if (!callback && typeof options === 'function') {
        callback = options;
        options = null;
    }
    options = options || {};
    var transport = options['transport']; // external API, don't minify 'transport' prop
    if (transport) {
        options.transport = transport; // 'transport' prop name can be minified internally
    }
    var should_send_immediately = options['send_immediately'];
    if (typeof callback !== 'function') {
        callback = NOOP_FUNC;
    }

    if (_.isUndefined(event_name)) {
        this.report_error('No event name provided to mixpanel.track');
        return;
    }

    if (this._event_is_disabled(event_name)) {
        callback(0);
        return;
    }

    // set defaults
    properties = properties || {};
    properties['token'] = this.get_config('token');

    // set $duration if time_event was previously called for this event
    var start_timestamp = this['persistence'].remove_event_timer(event_name);
    if (!_.isUndefined(start_timestamp)) {
        var duration_in_ms = new Date().getTime() - start_timestamp;
        properties['$duration'] = parseFloat((duration_in_ms / 1000).toFixed(3));
    }

    this._set_default_superprops();

    // note: extend writes to the first object, so lets make sure we
    // don't write to the persistence properties object and info
    // properties object by passing in a new object

    // update properties with pageview info and super-properties
    properties = _.extend(
        {},
        _.info.properties(),
        this['persistence'].properties(),
        this.unpersisted_superprops,
        properties
    );

    var property_blacklist = this.get_config('property_blacklist');
    if (_.isArray(property_blacklist)) {
        _.each(property_blacklist, function(blacklisted_prop) {
            delete properties[blacklisted_prop];
        });
    } else {
        this.report_error('Invalid value for property_blacklist config: ' + property_blacklist);
    }

    var data = {
        'event': event_name,
        'properties': properties
    };
    var ret = this._track_or_batch({
        type: 'events',
        data: data,
        endpoint: this.get_config('api_host') + '/track/',
        batcher: this.request_batchers.events,
        should_send_immediately: should_send_immediately,
        send_request_options: options
    }, callback);

    return ret;
});

/**
 * Register the current user into one/many groups.
 *
 * ### Usage:
 *
 *      mixpanel.set_group('company', ['mixpanel', 'google']) // an array of IDs
 *      mixpanel.set_group('company', 'mixpanel')
 *      mixpanel.set_group('company', 128746312)
 *
 * @param {String} group_key Group key
 * @param {Array|String|Number} group_ids An array of group IDs, or a singular group ID
 * @param {Function} [callback] If provided, the callback will be called after tracking the event.
 *
 */
MixpanelLib.prototype.set_group = addOptOutCheckMixpanelLib(function(group_key, group_ids, callback) {
    if (!_.isArray(group_ids)) {
        group_ids = [group_ids];
    }
    var prop = {};
    prop[group_key] = group_ids;
    this.register(prop);
    return this['people'].set(group_key, group_ids, callback);
});

/**
 * Add a new group for this user.
 *
 * ### Usage:
 *
 *      mixpanel.add_group('company', 'mixpanel')
 *
 * @param {String} group_key Group key
 * @param {*} group_id A valid Mixpanel property type
 * @param {Function} [callback] If provided, the callback will be called after tracking the event.
 */
MixpanelLib.prototype.add_group = addOptOutCheckMixpanelLib(function(group_key, group_id, callback) {
    var old_values = this.get_property(group_key);
    if (old_values === undefined) {
        var prop = {};
        prop[group_key] = [group_id];
        this.register(prop);
    } else {
        if (old_values.indexOf(group_id) === -1) {
            old_values.push(group_id);
            this.register(prop);
        }
    }
    return this['people'].union(group_key, group_id, callback);
});

/**
 * Remove a group from this user.
 *
 * ### Usage:
 *
 *      mixpanel.remove_group('company', 'mixpanel')
 *
 * @param {String} group_key Group key
 * @param {*} group_id A valid Mixpanel property type
 * @param {Function} [callback] If provided, the callback will be called after tracking the event.
 */
MixpanelLib.prototype.remove_group = addOptOutCheckMixpanelLib(function(group_key, group_id, callback) {
    var old_value = this.get_property(group_key);
    // if the value doesn't exist, the persistent store is unchanged
    if (old_value !== undefined) {
        var idx = old_value.indexOf(group_id);
        if (idx > -1) {
            old_value.splice(idx, 1);
            this.register({group_key: old_value});
        }
        if (old_value.length === 0) {
            this.unregister(group_key);
        }
    }
    return this['people'].remove(group_key, group_id, callback);
});

/**
 * Track an event with specific groups.
 *
 * ### Usage:
 *
 *      mixpanel.track_with_groups('purchase', {'product': 'iphone'}, {'University': ['UCB', 'UCLA']})
 *
 * @param {String} event_name The name of the event (see `mixpanel.track()`)
 * @param {Object=} properties A set of properties to include with the event you're sending (see `mixpanel.track()`)
 * @param {Object=} groups An object mapping group name keys to one or more values
 * @param {Function} [callback] If provided, the callback will be called after tracking the event.
 */
MixpanelLib.prototype.track_with_groups = addOptOutCheckMixpanelLib(function(event_name, properties, groups, callback) {
    var tracking_props = _.extend({}, properties || {});
    _.each(groups, function(v, k) {
        if (v !== null && v !== undefined) {
            tracking_props[k] = v;
        }
    });
    return this.track(event_name, tracking_props, callback);
});

MixpanelLib.prototype._create_map_key = function (group_key, group_id) {
    return group_key + '_' + JSON.stringify(group_id);
};

MixpanelLib.prototype._remove_group_from_cache = function (group_key, group_id) {
    delete this._cached_groups[this._create_map_key(group_key, group_id)];
};

/**
 * Look up reference to a Mixpanel group
 *
 * ### Usage:
 *
 *       mixpanel.get_group(group_key, group_id)
 *
 * @param {String} group_key Group key
 * @param {Object} group_id A valid Mixpanel property type
 * @returns {Object} A MixpanelGroup identifier
 */
MixpanelLib.prototype.get_group = function (group_key, group_id) {
    var map_key = this._create_map_key(group_key, group_id);
    var group = this._cached_groups[map_key];
    if (group === undefined || group._group_key !== group_key || group._group_id !== group_id) {
        group = new MixpanelGroup();
        group._init(this, group_key, group_id);
        this._cached_groups[map_key] = group;
    }
    return group;
};

/**
 * Track mp_page_view event. This is now ignored by the server.
 *
 * @param {String} [page] The url of the page to record. If you don't include this, it defaults to the current url.
 * @deprecated
 */
MixpanelLib.prototype.track_pageview = function(page) {
    if (_.isUndefined(page)) {
        page = document$1.location.href;
    }
    this.track('mp_page_view', _.info.pageviewInfo(page));
};

/**
 * Track clicks on a set of document elements. Selector must be a
 * valid query. Elements must exist on the page at the time track_links is called.
 *
 * ### Usage:
 *
 *     // track click for link id #nav
 *     mixpanel.track_links('#nav', 'Clicked Nav Link');
 *
 * ### Notes:
 *
 * This function will wait up to 300 ms for the Mixpanel
 * servers to respond. If they have not responded by that time
 * it will head to the link without ensuring that your event
 * has been tracked.  To configure this timeout please see the
 * set_config() documentation below.
 *
 * If you pass a function in as the properties argument, the
 * function will receive the DOMElement that triggered the
 * event as an argument.  You are expected to return an object
 * from the function; any properties defined on this object
 * will be sent to mixpanel as event properties.
 *
 * @type {Function}
 * @param {Object|String} query A valid DOM query, element or jQuery-esque list
 * @param {String} event_name The name of the event to track
 * @param {Object|Function} [properties] A properties object or function that returns a dictionary of properties when passed a DOMElement
 */
MixpanelLib.prototype.track_links = function() {
    return this._track_dom.call(this, LinkTracker, arguments);
};

/**
 * Track form submissions. Selector must be a valid query.
 *
 * ### Usage:
 *
 *     // track submission for form id 'register'
 *     mixpanel.track_forms('#register', 'Created Account');
 *
 * ### Notes:
 *
 * This function will wait up to 300 ms for the mixpanel
 * servers to respond, if they have not responded by that time
 * it will head to the link without ensuring that your event
 * has been tracked.  To configure this timeout please see the
 * set_config() documentation below.
 *
 * If you pass a function in as the properties argument, the
 * function will receive the DOMElement that triggered the
 * event as an argument.  You are expected to return an object
 * from the function; any properties defined on this object
 * will be sent to mixpanel as event properties.
 *
 * @type {Function}
 * @param {Object|String} query A valid DOM query, element or jQuery-esque list
 * @param {String} event_name The name of the event to track
 * @param {Object|Function} [properties] This can be a set of properties, or a function that returns a set of properties after being passed a DOMElement
 */
MixpanelLib.prototype.track_forms = function() {
    return this._track_dom.call(this, FormTracker, arguments);
};

/**
 * Time an event by including the time between this call and a
 * later 'track' call for the same event in the properties sent
 * with the event.
 *
 * ### Usage:
 *
 *     // time an event named 'Registered'
 *     mixpanel.time_event('Registered');
 *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
 *
 * When called for a particular event name, the next track call for that event
 * name will include the elapsed time between the 'time_event' and 'track'
 * calls. This value is stored as seconds in the '$duration' property.
 *
 * @param {String} event_name The name of the event.
 */
MixpanelLib.prototype.time_event = function(event_name) {
    if (_.isUndefined(event_name)) {
        this.report_error('No event name provided to mixpanel.time_event');
        return;
    }

    if (this._event_is_disabled(event_name)) {
        return;
    }

    this['persistence'].set_event_timer(event_name,  new Date().getTime());
};

var REGISTER_DEFAULTS = {
    'persistent': true
};
/**
 * Helper to parse options param for register methods, maintaining
 * legacy support for plain "days" param instead of options object
 * @param {Number|Object} [days_or_options] 'days' option (Number), or Options object for register methods
 * @returns {Object} options object
 */
var options_for_register = function(days_or_options) {
    var options;
    if (_.isObject(days_or_options)) {
        options = days_or_options;
    } else if (!_.isUndefined(days_or_options)) {
        options = {'days': days_or_options};
    } else {
        options = {};
    }
    return _.extend({}, REGISTER_DEFAULTS, options);
};

/**
 * Register a set of super properties, which are included with all
 * events. This will overwrite previous super property values.
 *
 * ### Usage:
 *
 *     // register 'Gender' as a super property
 *     mixpanel.register({'Gender': 'Female'});
 *
 *     // register several super properties when a user signs up
 *     mixpanel.register({
 *         'Email': 'jdoe@example.com',
 *         'Account Type': 'Free'
 *     });
 *
 *     // register only for the current pageload
 *     mixpanel.register({'Name': 'Pat'}, {persistent: false});
 *
 * @param {Object} properties An associative array of properties to store about the user
 * @param {Number|Object} [days_or_options] Options object or number of days since the user's last visit to store the super properties (only valid for persisted props)
 * @param {boolean} [days_or_options.days] - number of days since the user's last visit to store the super properties (only valid for persisted props)
 * @param {boolean} [days_or_options.persistent=true] - whether to put in persistent storage (cookie/localStorage)
 */
MixpanelLib.prototype.register = function(props, days_or_options) {
    var options = options_for_register(days_or_options);
    if (options['persistent']) {
        this['persistence'].register(props, options['days']);
    } else {
        _.extend(this.unpersisted_superprops, props);
    }
};

/**
 * Register a set of super properties only once. This will not
 * overwrite previous super property values, unlike register().
 *
 * ### Usage:
 *
 *     // register a super property for the first time only
 *     mixpanel.register_once({
 *         'First Login Date': new Date().toISOString()
 *     });
 *
 *     // register once, only for the current pageload
 *     mixpanel.register_once({
 *         'First interaction time': new Date().toISOString()
 *     }, 'None', {persistent: false});
 *
 * ### Notes:
 *
 * If default_value is specified, current super properties
 * with that value will be overwritten.
 *
 * @param {Object} properties An associative array of properties to store about the user
 * @param {*} [default_value] Value to override if already set in super properties (ex: 'False') Default: 'None'
 * @param {Number|Object} [days_or_options] Options object or number of days since the user's last visit to store the super properties (only valid for persisted props)
 * @param {boolean} [days_or_options.days] - number of days since the user's last visit to store the super properties (only valid for persisted props)
 * @param {boolean} [days_or_options.persistent=true] - whether to put in persistent storage (cookie/localStorage)
 */
MixpanelLib.prototype.register_once = function(props, default_value, days_or_options) {
    var options = options_for_register(days_or_options);
    if (options['persistent']) {
        this['persistence'].register_once(props, default_value, options['days']);
    } else {
        if (typeof(default_value) === 'undefined') {
            default_value = 'None';
        }
        _.each(props, function(val, prop) {
            if (!this.unpersisted_superprops.hasOwnProperty(prop) || this.unpersisted_superprops[prop] === default_value) {
                this.unpersisted_superprops[prop] = val;
            }
        }, this);
    }
};

/**
 * Delete a super property stored with the current user.
 *
 * @param {String} property The name of the super property to remove
 * @param {Object} [options]
 * @param {boolean} [options.persistent=true] - whether to look in persistent storage (cookie/localStorage)
 */
MixpanelLib.prototype.unregister = function(property, options) {
    options = options_for_register(options);
    if (options['persistent']) {
        this['persistence'].unregister(property);
    } else {
        delete this.unpersisted_superprops[property];
    }
};

MixpanelLib.prototype._register_single = function(prop, value) {
    var props = {};
    props[prop] = value;
    this.register(props);
};

/**
 * Identify a user with a unique ID to track user activity across
 * devices, tie a user to their events, and create a user profile.
 * If you never call this method, unique visitors are tracked using
 * a UUID generated the first time they visit the site.
 *
 * Call identify when you know the identity of the current user,
 * typically after login or signup. We recommend against using
 * identify for anonymous visitors to your site.
 *
 * ### Notes:
 * If your project has
 * <a href="https://help.mixpanel.com/hc/en-us/articles/360039133851">ID Merge</a>
 * enabled, the identify method will connect pre- and
 * post-authentication events when appropriate.
 *
 * If your project does not have ID Merge enabled, identify will
 * change the user's local distinct_id to the unique ID you pass.
 * Events tracked prior to authentication will not be connected
 * to the same user identity. If ID Merge is disabled, alias can
 * be used to connect pre- and post-registration events.
 *
 * @param {String} [unique_id] A string that uniquely identifies a user. If not provided, the distinct_id currently in the persistent store (cookie or localStorage) will be used.
 */
MixpanelLib.prototype.identify = function(
    new_distinct_id, _set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback
) {
    // Optional Parameters
    //  _set_callback:function  A callback to be run if and when the People set queue is flushed
    //  _add_callback:function  A callback to be run if and when the People add queue is flushed
    //  _append_callback:function  A callback to be run if and when the People append queue is flushed
    //  _set_once_callback:function  A callback to be run if and when the People set_once queue is flushed
    //  _union_callback:function  A callback to be run if and when the People union queue is flushed
    //  _unset_callback:function  A callback to be run if and when the People unset queue is flushed

    var previous_distinct_id = this.get_distinct_id();
    this.register({'$user_id': new_distinct_id});

    if (!this.get_property('$device_id')) {
        // The persisted distinct id might not actually be a device id at all
        // it might be a distinct id of the user from before
        var device_id = previous_distinct_id;
        this.register_once({
            '$had_persisted_distinct_id': true,
            '$device_id': device_id
        }, '');
    }

    // identify only changes the distinct id if it doesn't match either the existing or the alias;
    // if it's new, blow away the alias as well.
    if (new_distinct_id !== previous_distinct_id && new_distinct_id !== this.get_property(ALIAS_ID_KEY)) {
        this.unregister(ALIAS_ID_KEY);
        this.register({'distinct_id': new_distinct_id});
    }
    this._flags.identify_called = true;
    // Flush any queued up people requests
    this['people']._flush(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback);

    // send an $identify event any time the distinct_id is changing - logic on the server
    // will determine whether or not to do anything with it.
    if (new_distinct_id !== previous_distinct_id) {
        this.track('$identify', {
            'distinct_id': new_distinct_id,
            '$anon_distinct_id': previous_distinct_id
        }, {skip_hooks: true});
    }
};

/**
 * Clears super properties and generates a new random distinct_id for this instance.
 * Useful for clearing data when a user logs out.
 */
MixpanelLib.prototype.reset = function() {
    this['persistence'].clear();
    this._flags.identify_called = false;
    var uuid = _.UUID();
    this.register_once({
        'distinct_id': uuid,
        '$device_id': uuid
    }, '');
};

/**
 * Returns the current distinct id of the user. This is either the id automatically
 * generated by the library or the id that has been passed by a call to identify().
 *
 * ### Notes:
 *
 * get_distinct_id() can only be called after the Mixpanel library has finished loading.
 * init() has a loaded function available to handle this automatically. For example:
 *
 *     // set distinct_id after the mixpanel library has loaded
 *     mixpanel.init('YOUR PROJECT TOKEN', {
 *         loaded: function(mixpanel) {
 *             distinct_id = mixpanel.get_distinct_id();
 *         }
 *     });
 */
MixpanelLib.prototype.get_distinct_id = function() {
    return this.get_property('distinct_id');
};

/**
 * The alias method creates an alias which Mixpanel will use to
 * remap one id to another. Multiple aliases can point to the
 * same identifier.
 *
 * The following is a valid use of alias:
 *
 *     mixpanel.alias('new_id', 'existing_id');
 *     // You can add multiple id aliases to the existing ID
 *     mixpanel.alias('newer_id', 'existing_id');
 *
 * Aliases can also be chained - the following is a valid example:
 *
 *     mixpanel.alias('new_id', 'existing_id');
 *     // chain newer_id - new_id - existing_id
 *     mixpanel.alias('newer_id', 'new_id');
 *
 * Aliases cannot point to multiple identifiers - the following
 * example will not work:
 *
 *     mixpanel.alias('new_id', 'existing_id');
 *     // this is invalid as 'new_id' already points to 'existing_id'
 *     mixpanel.alias('new_id', 'newer_id');
 *
 * ### Notes:
 *
 * If your project does not have
 * <a href="https://help.mixpanel.com/hc/en-us/articles/360039133851">ID Merge</a>
 * enabled, the best practice is to call alias once when a unique
 * ID is first created for a user (e.g., when a user first registers
 * for an account). Do not use alias multiple times for a single
 * user without ID Merge enabled.
 *
 * @param {String} alias A unique identifier that you want to use for this user in the future.
 * @param {String} [original] The current identifier being used for this user.
 */
MixpanelLib.prototype.alias = function(alias, original) {
    // If the $people_distinct_id key exists in persistence, there has been a previous
    // mixpanel.people.identify() call made for this user. It is VERY BAD to make an alias with
    // this ID, as it will duplicate users.
    if (alias === this.get_property(PEOPLE_DISTINCT_ID_KEY)) {
        this.report_error('Attempting to create alias for existing People user - aborting.');
        return -2;
    }

    var _this = this;
    if (_.isUndefined(original)) {
        original = this.get_distinct_id();
    }
    if (alias !== original) {
        this._register_single(ALIAS_ID_KEY, alias);
        return this.track('$create_alias', {
            'alias': alias,
            'distinct_id': original
        }, {
            skip_hooks: true
        }, function() {
            // Flush the people queue
            _this.identify(alias);
        });
    } else {
        this.report_error('alias matches current distinct_id - skipping api call.');
        this.identify(alias);
        return -1;
    }
};

/**
 * Provide a string to recognize the user by. The string passed to
 * this method will appear in the Mixpanel Streams product rather
 * than an automatically generated name. Name tags do not have to
 * be unique.
 *
 * This value will only be included in Streams data.
 *
 * @param {String} name_tag A human readable name for the user
 * @deprecated
 */
MixpanelLib.prototype.name_tag = function(name_tag) {
    this._register_single('mp_name_tag', name_tag);
};

/**
 * Update the configuration of a mixpanel library instance.
 *
 * The default config is:
 *
 *     {
 *       // HTTP method for tracking requests
 *       api_method: 'POST'
 *
 *       // transport for sending requests ('XHR' or 'sendBeacon')
 *       // NB: sendBeacon should only be used for scenarios such as
 *       // page unload where a "best-effort" attempt to send is
 *       // acceptable; the sendBeacon API does not support callbacks
 *       // or any way to know the result of the request. Mixpanel
 *       // tracking via sendBeacon will not support any event-
 *       // batching or retry mechanisms.
 *       api_transport: 'XHR'
 *
 *       // turn on request-batching/queueing/retry
 *       batch_requests: false,
 *
 *       // maximum number of events/updates to send in a single
 *       // network request
 *       batch_size: 50,
 *
 *       // milliseconds to wait between sending batch requests
 *       batch_flush_interval_ms: 5000,
 *
 *       // milliseconds to wait for network responses to batch requests
 *       // before they are considered timed-out and retried
 *       batch_request_timeout_ms: 90000,
 *
 *       // override value for cookie domain, only useful for ensuring
 *       // correct cross-subdomain cookies on unusual domains like
 *       // subdomain.mainsite.avocat.fr; NB this cannot be used to
 *       // set cookies on a different domain than the current origin
 *       cookie_domain: ''
 *
 *       // super properties cookie expiration (in days)
 *       cookie_expiration: 365
 *
 *       // if true, cookie will be set with SameSite=None; Secure
 *       // this is only useful in special situations, like embedded
 *       // 3rd-party iframes that set up a Mixpanel instance
 *       cross_site_cookie: false
 *
 *       // super properties span subdomains
 *       cross_subdomain_cookie: true
 *
 *       // debug mode
 *       debug: false
 *
 *       // if this is true, the mixpanel cookie or localStorage entry
 *       // will be deleted, and no user persistence will take place
 *       disable_persistence: false
 *
 *       // if this is true, Mixpanel will automatically determine
 *       // City, Region and Country data using the IP address of
 *       //the client
 *       ip: true
 *
 *       // opt users out of tracking by this Mixpanel instance by default
 *       opt_out_tracking_by_default: false
 *
 *       // opt users out of browser data storage by this Mixpanel instance by default
 *       opt_out_persistence_by_default: false
 *
 *       // persistence mechanism used by opt-in/opt-out methods - cookie
 *       // or localStorage - falls back to cookie if localStorage is unavailable
 *       opt_out_tracking_persistence_type: 'localStorage'
 *
 *       // customize the name of cookie/localStorage set by opt-in/opt-out methods
 *       opt_out_tracking_cookie_prefix: null
 *
 *       // type of persistent store for super properties (cookie/
 *       // localStorage) if set to 'localStorage', any existing
 *       // mixpanel cookie value with the same persistence_name
 *       // will be transferred to localStorage and deleted
 *       persistence: 'cookie'
 *
 *       // name for super properties persistent store
 *       persistence_name: ''
 *
 *       // names of properties/superproperties which should never
 *       // be sent with track() calls
 *       property_blacklist: []
 *
 *       // if this is true, mixpanel cookies will be marked as
 *       // secure, meaning they will only be transmitted over https
 *       secure_cookie: false
 *
 *       // the amount of time track_links will
 *       // wait for Mixpanel's servers to respond
 *       track_links_timeout: 300
 *
 *       // if you set upgrade to be true, the library will check for
 *       // a cookie from our old js library and import super
 *       // properties from it, then the old cookie is deleted
 *       // The upgrade config option only works in the initialization,
 *       // so make sure you set it when you create the library.
 *       upgrade: false
 *
 *       // extra HTTP request headers to set for each API request, in
 *       // the format {'Header-Name': value}
 *       xhr_headers: {}
 *
 *       // whether to ignore or respect the web browser's Do Not Track setting
 *       ignore_dnt: false
 *     }
 *
 *
 * @param {Object} config A dictionary of new configuration values to update
 */
MixpanelLib.prototype.set_config = function(config) {
    if (_.isObject(config)) {
        _.extend(this['config'], config);

        var new_batch_size = config['batch_size'];
        if (new_batch_size) {
            _.each(this.request_batchers, function(batcher) {
                batcher.resetBatchSize();
            });
        }

        if (!this.get_config('persistence_name')) {
            this['config']['persistence_name'] = this['config']['cookie_name'];
        }
        if (!this.get_config('disable_persistence')) {
            this['config']['disable_persistence'] = this['config']['disable_cookie'];
        }

        if (this['persistence']) {
            this['persistence'].update_config(this['config']);
        }
        Config.DEBUG = Config.DEBUG || this.get_config('debug');
    }
};

/**
 * returns the current config object for the library.
 */
MixpanelLib.prototype.get_config = function(prop_name) {
    return this['config'][prop_name];
};

/**
 * Fetch a hook function from config, with safe default, and run it
 * against the given arguments
 * @param {string} hook_name which hook to retrieve
 * @returns {any|null} return value of user-provided hook, or null if nothing was returned
 */
MixpanelLib.prototype._run_hook = function(hook_name) {
    var ret = (this['config']['hooks'][hook_name] || IDENTITY_FUNC).apply(this, slice.call(arguments, 1));
    if (typeof ret === 'undefined') {
        this.report_error(hook_name + ' hook did not return a value');
        ret = null;
    }
    return ret;
};

/**
 * Returns the value of the super property named property_name. If no such
 * property is set, get_property() will return the undefined value.
 *
 * ### Notes:
 *
 * get_property() can only be called after the Mixpanel library has finished loading.
 * init() has a loaded function available to handle this automatically. For example:
 *
 *     // grab value for 'user_id' after the mixpanel library has loaded
 *     mixpanel.init('YOUR PROJECT TOKEN', {
 *         loaded: function(mixpanel) {
 *             user_id = mixpanel.get_property('user_id');
 *         }
 *     });
 *
 * @param {String} property_name The name of the super property you want to retrieve
 */
MixpanelLib.prototype.get_property = function(property_name) {
    return this['persistence']['props'][property_name];
};

MixpanelLib.prototype.toString = function() {
    var name = this.get_config('name');
    if (name !== PRIMARY_INSTANCE_NAME) {
        name = PRIMARY_INSTANCE_NAME + '.' + name;
    }
    return name;
};

MixpanelLib.prototype._event_is_disabled = function(event_name) {
    return _.isBlockedUA(userAgent) ||
        this._flags.disable_all_events ||
        _.include(this.__disabled_events, event_name);
};

// perform some housekeeping around GDPR opt-in/out state
MixpanelLib.prototype._gdpr_init = function() {
    var is_localStorage_requested = this.get_config('opt_out_tracking_persistence_type') === 'localStorage';

    // try to convert opt-in/out cookies to localStorage if possible
    if (is_localStorage_requested && _.localStorage.is_supported()) {
        if (!this.has_opted_in_tracking() && this.has_opted_in_tracking({'persistence_type': 'cookie'})) {
            this.opt_in_tracking({'enable_persistence': false});
        }
        if (!this.has_opted_out_tracking() && this.has_opted_out_tracking({'persistence_type': 'cookie'})) {
            this.opt_out_tracking({'clear_persistence': false});
        }
        this.clear_opt_in_out_tracking({
            'persistence_type': 'cookie',
            'enable_persistence': false
        });
    }

    // check whether the user has already opted out - if so, clear & disable persistence
    if (this.has_opted_out_tracking()) {
        this._gdpr_update_persistence({'clear_persistence': true});

    // check whether we should opt out by default
    // note: we don't clear persistence here by default since opt-out default state is often
    //       used as an initial state while GDPR information is being collected
    } else if (!this.has_opted_in_tracking() && (
        this.get_config('opt_out_tracking_by_default') || _.cookie.get('mp_optout')
    )) {
        _.cookie.remove('mp_optout');
        this.opt_out_tracking({
            'clear_persistence': this.get_config('opt_out_persistence_by_default')
        });
    }
};

/**
 * Enable or disable persistence based on options
 * only enable/disable if persistence is not already in this state
 * @param {boolean} [options.clear_persistence] If true, will delete all data stored by the sdk in persistence and disable it
 * @param {boolean} [options.enable_persistence] If true, will re-enable sdk persistence
 */
MixpanelLib.prototype._gdpr_update_persistence = function(options) {
    var disabled;
    if (options && options['clear_persistence']) {
        disabled = true;
    } else if (options && options['enable_persistence']) {
        disabled = false;
    } else {
        return;
    }

    if (!this.get_config('disable_persistence') && this['persistence'].disabled !== disabled) {
        this['persistence'].set_disabled(disabled);
    }

    if (disabled) {
        _.each(this.request_batchers, function(batcher) {
            batcher.clear();
        });
    }
};

// call a base gdpr function after constructing the appropriate token and options args
MixpanelLib.prototype._gdpr_call_func = function(func, options) {
    options = _.extend({
        'track': _.bind(this.track, this),
        'persistence_type': this.get_config('opt_out_tracking_persistence_type'),
        'cookie_prefix': this.get_config('opt_out_tracking_cookie_prefix'),
        'cookie_expiration': this.get_config('cookie_expiration'),
        'cross_site_cookie': this.get_config('cross_site_cookie'),
        'cross_subdomain_cookie': this.get_config('cross_subdomain_cookie'),
        'cookie_domain': this.get_config('cookie_domain'),
        'secure_cookie': this.get_config('secure_cookie'),
        'ignore_dnt': this.get_config('ignore_dnt')
    }, options);

    // check if localStorage can be used for recording opt out status, fall back to cookie if not
    if (!_.localStorage.is_supported()) {
        options['persistence_type'] = 'cookie';
    }

    return func(this.get_config('token'), {
        track: options['track'],
        trackEventName: options['track_event_name'],
        trackProperties: options['track_properties'],
        persistenceType: options['persistence_type'],
        persistencePrefix: options['cookie_prefix'],
        cookieDomain: options['cookie_domain'],
        cookieExpiration: options['cookie_expiration'],
        crossSiteCookie: options['cross_site_cookie'],
        crossSubdomainCookie: options['cross_subdomain_cookie'],
        secureCookie: options['secure_cookie'],
        ignoreDnt: options['ignore_dnt']
    });
};

/**
 * Opt the user in to data tracking and cookies/localstorage for this Mixpanel instance
 *
 * ### Usage
 *
 *     // opt user in
 *     mixpanel.opt_in_tracking();
 *
 *     // opt user in with specific event name, properties, cookie configuration
 *     mixpanel.opt_in_tracking({
 *         track_event_name: 'User opted in',
 *         track_event_properties: {
 *             'Email': 'jdoe@example.com'
 *         },
 *         cookie_expiration: 30,
 *         secure_cookie: true
 *     });
 *
 * @param {Object} [options] A dictionary of config options to override
 * @param {function} [options.track] Function used for tracking a Mixpanel event to record the opt-in action (default is this Mixpanel instance's track method)
 * @param {string} [options.track_event_name=$opt_in] Event name to be used for tracking the opt-in action
 * @param {Object} [options.track_properties] Set of properties to be tracked along with the opt-in action
 * @param {boolean} [options.enable_persistence=true] If true, will re-enable sdk persistence
 * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
 * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookie_expiration] Number of days until the opt-in cookie expires (overrides value specified in this Mixpanel instance's config)
 * @param {string} [options.cookie_domain] Custom cookie domain (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.cross_site_cookie] Whether the opt-in cookie is set as cross-site-enabled (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.cross_subdomain_cookie] Whether the opt-in cookie is set as cross-subdomain or not (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.secure_cookie] Whether the opt-in cookie is set as secure or not (overrides value specified in this Mixpanel instance's config)
 */
MixpanelLib.prototype.opt_in_tracking = function(options) {
    options = _.extend({
        'enable_persistence': true
    }, options);

    this._gdpr_call_func(optIn, options);
    this._gdpr_update_persistence(options);
};

/**
 * Opt the user out of data tracking and cookies/localstorage for this Mixpanel instance
 *
 * ### Usage
 *
 *     // opt user out
 *     mixpanel.opt_out_tracking();
 *
 *     // opt user out with different cookie configuration from Mixpanel instance
 *     mixpanel.opt_out_tracking({
 *         cookie_expiration: 30,
 *         secure_cookie: true
 *     });
 *
 * @param {Object} [options] A dictionary of config options to override
 * @param {boolean} [options.delete_user=true] If true, will delete the currently identified user's profile and clear all charges after opting the user out
 * @param {boolean} [options.clear_persistence=true] If true, will delete all data stored by the sdk in persistence
 * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
 * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookie_expiration] Number of days until the opt-in cookie expires (overrides value specified in this Mixpanel instance's config)
 * @param {string} [options.cookie_domain] Custom cookie domain (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.cross_site_cookie] Whether the opt-in cookie is set as cross-site-enabled (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.cross_subdomain_cookie] Whether the opt-in cookie is set as cross-subdomain or not (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.secure_cookie] Whether the opt-in cookie is set as secure or not (overrides value specified in this Mixpanel instance's config)
 */
MixpanelLib.prototype.opt_out_tracking = function(options) {
    options = _.extend({
        'clear_persistence': true,
        'delete_user': true
    }, options);

    // delete user and clear charges since these methods may be disabled by opt-out
    if (options['delete_user'] && this['people'] && this['people']._identify_called()) {
        this['people'].delete_user();
        this['people'].clear_charges();
    }

    this._gdpr_call_func(optOut, options);
    this._gdpr_update_persistence(options);
};

/**
 * Check whether the user has opted in to data tracking and cookies/localstorage for this Mixpanel instance
 *
 * ### Usage
 *
 *     var has_opted_in = mixpanel.has_opted_in_tracking();
 *     // use has_opted_in value
 *
 * @param {Object} [options] A dictionary of config options to override
 * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
 * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
 * @returns {boolean} current opt-in status
 */
MixpanelLib.prototype.has_opted_in_tracking = function(options) {
    return this._gdpr_call_func(hasOptedIn, options);
};

/**
 * Check whether the user has opted out of data tracking and cookies/localstorage for this Mixpanel instance
 *
 * ### Usage
 *
 *     var has_opted_out = mixpanel.has_opted_out_tracking();
 *     // use has_opted_out value
 *
 * @param {Object} [options] A dictionary of config options to override
 * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
 * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
 * @returns {boolean} current opt-out status
 */
MixpanelLib.prototype.has_opted_out_tracking = function(options) {
    return this._gdpr_call_func(hasOptedOut, options);
};

/**
 * Clear the user's opt in/out status of data tracking and cookies/localstorage for this Mixpanel instance
 *
 * ### Usage
 *
 *     // clear user's opt-in/out status
 *     mixpanel.clear_opt_in_out_tracking();
 *
 *     // clear user's opt-in/out status with specific cookie configuration - should match
 *     // configuration used when opt_in_tracking/opt_out_tracking methods were called.
 *     mixpanel.clear_opt_in_out_tracking({
 *         cookie_expiration: 30,
 *         secure_cookie: true
 *     });
 *
 * @param {Object} [options] A dictionary of config options to override
 * @param {boolean} [options.enable_persistence=true] If true, will re-enable sdk persistence
 * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
 * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
 * @param {Number} [options.cookie_expiration] Number of days until the opt-in cookie expires (overrides value specified in this Mixpanel instance's config)
 * @param {string} [options.cookie_domain] Custom cookie domain (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.cross_site_cookie] Whether the opt-in cookie is set as cross-site-enabled (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.cross_subdomain_cookie] Whether the opt-in cookie is set as cross-subdomain or not (overrides value specified in this Mixpanel instance's config)
 * @param {boolean} [options.secure_cookie] Whether the opt-in cookie is set as secure or not (overrides value specified in this Mixpanel instance's config)
 */
MixpanelLib.prototype.clear_opt_in_out_tracking = function(options) {
    options = _.extend({
        'enable_persistence': true
    }, options);

    this._gdpr_call_func(clearOptInOut, options);
    this._gdpr_update_persistence(options);
};

MixpanelLib.prototype.report_error = function(msg, err) {
    console$1.error.apply(console$1.error, arguments);
    try {
        if (!err && !(msg instanceof Error)) {
            msg = new Error(msg);
        }
        this.get_config('error_reporter')(msg, err);
    } catch(err) {
        console$1.error(err);
    }
};

// EXPORTS (for closure compiler)

// MixpanelLib Exports
MixpanelLib.prototype['init']                               = MixpanelLib.prototype.init;
MixpanelLib.prototype['reset']                              = MixpanelLib.prototype.reset;
MixpanelLib.prototype['disable']                            = MixpanelLib.prototype.disable;
MixpanelLib.prototype['time_event']                         = MixpanelLib.prototype.time_event;
MixpanelLib.prototype['track']                              = MixpanelLib.prototype.track;
MixpanelLib.prototype['track_links']                        = MixpanelLib.prototype.track_links;
MixpanelLib.prototype['track_forms']                        = MixpanelLib.prototype.track_forms;
MixpanelLib.prototype['track_pageview']                     = MixpanelLib.prototype.track_pageview;
MixpanelLib.prototype['register']                           = MixpanelLib.prototype.register;
MixpanelLib.prototype['register_once']                      = MixpanelLib.prototype.register_once;
MixpanelLib.prototype['unregister']                         = MixpanelLib.prototype.unregister;
MixpanelLib.prototype['identify']                           = MixpanelLib.prototype.identify;
MixpanelLib.prototype['alias']                              = MixpanelLib.prototype.alias;
MixpanelLib.prototype['name_tag']                           = MixpanelLib.prototype.name_tag;
MixpanelLib.prototype['set_config']                         = MixpanelLib.prototype.set_config;
MixpanelLib.prototype['get_config']                         = MixpanelLib.prototype.get_config;
MixpanelLib.prototype['get_property']                       = MixpanelLib.prototype.get_property;
MixpanelLib.prototype['get_distinct_id']                    = MixpanelLib.prototype.get_distinct_id;
MixpanelLib.prototype['toString']                           = MixpanelLib.prototype.toString;
MixpanelLib.prototype['opt_out_tracking']                   = MixpanelLib.prototype.opt_out_tracking;
MixpanelLib.prototype['opt_in_tracking']                    = MixpanelLib.prototype.opt_in_tracking;
MixpanelLib.prototype['has_opted_out_tracking']             = MixpanelLib.prototype.has_opted_out_tracking;
MixpanelLib.prototype['has_opted_in_tracking']              = MixpanelLib.prototype.has_opted_in_tracking;
MixpanelLib.prototype['clear_opt_in_out_tracking']          = MixpanelLib.prototype.clear_opt_in_out_tracking;
MixpanelLib.prototype['get_group']                          = MixpanelLib.prototype.get_group;
MixpanelLib.prototype['set_group']                          = MixpanelLib.prototype.set_group;
MixpanelLib.prototype['add_group']                          = MixpanelLib.prototype.add_group;
MixpanelLib.prototype['remove_group']                       = MixpanelLib.prototype.remove_group;
MixpanelLib.prototype['track_with_groups']                  = MixpanelLib.prototype.track_with_groups;
MixpanelLib.prototype['start_batch_senders']                = MixpanelLib.prototype.start_batch_senders;
MixpanelLib.prototype['stop_batch_senders']                 = MixpanelLib.prototype.stop_batch_senders;

// MixpanelPersistence Exports
MixpanelPersistence.prototype['properties']            = MixpanelPersistence.prototype.properties;
MixpanelPersistence.prototype['update_search_keyword'] = MixpanelPersistence.prototype.update_search_keyword;
MixpanelPersistence.prototype['update_referrer_info']  = MixpanelPersistence.prototype.update_referrer_info;
MixpanelPersistence.prototype['get_cross_subdomain']   = MixpanelPersistence.prototype.get_cross_subdomain;
MixpanelPersistence.prototype['clear']                 = MixpanelPersistence.prototype.clear;


var instances = {};
var extend_mp = function() {
    // add all the sub mixpanel instances
    _.each(instances, function(instance, name) {
        if (name !== PRIMARY_INSTANCE_NAME) { mixpanel_master[name] = instance; }
    });

    // add private functions as _
    mixpanel_master['_'] = _;
};

var override_mp_init_func = function() {
    // we override the snippets init function to handle the case where a
    // user initializes the mixpanel library after the script loads & runs
    mixpanel_master['init'] = function(token, config, name) {
        if (name) {
            // initialize a sub library
            if (!mixpanel_master[name]) {
                mixpanel_master[name] = instances[name] = create_mplib(token, config, name);
                mixpanel_master[name]._loaded();
            }
            return mixpanel_master[name];
        } else {
            var instance = mixpanel_master;

            if (instances[PRIMARY_INSTANCE_NAME]) {
                // main mixpanel lib already initialized
                instance = instances[PRIMARY_INSTANCE_NAME];
            } else if (token) {
                // intialize the main mixpanel lib
                instance = create_mplib(token, config, PRIMARY_INSTANCE_NAME);
                instance._loaded();
                instances[PRIMARY_INSTANCE_NAME] = instance;
            }

            mixpanel_master = instance;
            if (init_type === INIT_SNIPPET) {
                window$1[PRIMARY_INSTANCE_NAME] = mixpanel_master;
            }
            extend_mp();
        }
    };
};

var add_dom_loaded_handler = function() {
    // Cross browser DOM Loaded support
    function dom_loaded_handler() {
        // function flag since we only want to execute this once
        if (dom_loaded_handler.done) { return; }
        dom_loaded_handler.done = true;

        DOM_LOADED = true;
        ENQUEUE_REQUESTS = false;

        _.each(instances, function(inst) {
            inst._dom_loaded();
        });
    }

    function do_scroll_check() {
        try {
            document$1.documentElement.doScroll('left');
        } catch(e) {
            setTimeout(do_scroll_check, 1);
            return;
        }

        dom_loaded_handler();
    }

    if (document$1.addEventListener) {
        if (document$1.readyState === 'complete') {
            // safari 4 can fire the DOMContentLoaded event before loading all
            // external JS (including this file). you will see some copypasta
            // on the internet that checks for 'complete' and 'loaded', but
            // 'loaded' is an IE thing
            dom_loaded_handler();
        } else {
            document$1.addEventListener('DOMContentLoaded', dom_loaded_handler, false);
        }
    } else if (document$1.attachEvent) {
        // IE
        document$1.attachEvent('onreadystatechange', dom_loaded_handler);

        // check to make sure we arn't in a frame
        var toplevel = false;
        try {
            toplevel = window$1.frameElement === null;
        } catch(e) {
            // noop
        }

        if (document$1.documentElement.doScroll && toplevel) {
            do_scroll_check();
        }
    }

    // fallback handler, always will work
    _.register_event(window$1, 'load', dom_loaded_handler, true);
};

function init_as_module() {
    init_type = INIT_MODULE;
    mixpanel_master = new MixpanelLib();

    override_mp_init_func();
    mixpanel_master['init']();
    add_dom_loaded_handler();

    return mixpanel_master;
}

var mixpanel = init_as_module();

var mixpanel_cjs = mixpanel;

const MIXPANEL_EVENT = {
    VISUAL_SDK_RENDER_START: 'visual-sdk-render-start',
    VISUAL_SDK_CALLED_INIT: 'visual-sdk-called-init',
    VISUAL_SDK_RENDER_COMPLETE: 'visual-sdk-render-complete',
    VISUAL_SDK_RENDER_FAILED: 'visual-sdk-render-failed',
    VISUAL_SDK_TRIGGER: 'visual-sdk-trigger',
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
    return new Promise(() => mixpanel_cjs.track(eventId, eventProps));
}
function emptyQueue() {
    eventCollectorQueue.forEach((event) => {
        uploadMixpanelEvent(event.eventId, event.eventProps);
    });
}
function initMixpanel(sessionInfo) {
    if (!sessionInfo || !sessionInfo.mixpanelToken) {
        return;
    }
    // On a public cluster the user is anonymous, so don't set the identify to userGUID
    const isPublicCluster = !!sessionInfo.isPublicUser;
    const token = sessionInfo.mixpanelToken;
    if (token) {
        mixpanel_cjs.init(token);
        if (!isPublicCluster) {
            mixpanel_cjs.identify(sessionInfo.userGUID);
        }
        setEventCollectorOn();
        emptyQueue();
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var eventemitter3 = createCommonjsModule(function (module) {

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
{
  module.exports = EventEmitter;
}
});

/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex;

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

var _baseIsNaN = baseIsNaN;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var _strictIndexOf = strictIndexOf;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? _strictIndexOf(array, value, fromIndex)
    : _baseFindIndex(array, _baseIsNaN, fromIndex);
}

var _baseIndexOf = baseIndexOf;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && _baseIndexOf(array, value, 0) > -1;
}

var _arrayIncludes = arrayIncludes;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

var _arrayIncludesWith = arrayIncludesWith;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

var noop_1 = noop;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(_Set && (1 / _setToArray(new _Set([,-0]))[1]) == INFINITY) ? noop_1 : function(values) {
  return new _Set(values);
};

var _createSet = createSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = _arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = _arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : _createSet(array);
    if (set) {
      return _setToArray(set);
    }
    isCommon = false;
    includes = _cacheHas;
    seen = new _SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

var _baseUniq = baseUniq;

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? _baseUniq(array) : [];
}

var uniq_1 = uniq;

// eslint-disable-next-line import/no-cycle
function failureLoggedFetch(url, options = {}) {
    return fetch(url, options).then(async (r) => {
        var _a;
        if (!r.ok && r.type !== 'opaqueredirect' && r.type !== 'opaque') {
            console.error('Failure', await ((_a = r.text) === null || _a === void 0 ? void 0 : _a.call(r)));
        }
        return r;
    });
}
function fetchSessionInfoService(authVerificationUrl) {
    return failureLoggedFetch(authVerificationUrl, {
        credentials: 'include',
    });
}
async function fetchAuthTokenService(authEndpoint) {
    return fetch(authEndpoint);
}
async function fetchAuthService(thoughtSpotHost, username, authToken) {
    return failureLoggedFetch(`${thoughtSpotHost}${EndPoints.TOKEN_LOGIN}?username=${username}&auth_token=${authToken}`, {
        credentials: 'include',
        // We do not want to follow the redirect, as it starts giving a CORS error
        redirect: 'manual',
    });
}
async function fetchAuthPostService(thoughtSpotHost, username, authToken) {
    return failureLoggedFetch(`${thoughtSpotHost}${EndPoints.TOKEN_LOGIN}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'x-requested-by': 'ThoughtSpot',
        },
        body: `username=${encodeURIComponent(username)}&auth_token=${encodeURIComponent(authToken)}`,
        credentials: 'include',
        // We do not want to follow the redirect, as it starts giving a CORS error
        redirect: 'manual',
    });
}
async function fetchBasicAuthService(thoughtSpotHost, username, password) {
    return failureLoggedFetch(`${thoughtSpotHost}${EndPoints.BASIC_LOGIN}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'x-requested-by': 'ThoughtSpot',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        credentials: 'include',
    });
}
async function fetchLogoutService(thoughtSpotHost) {
    return failureLoggedFetch(`${thoughtSpotHost}${EndPoints.LOGOUT}`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'x-requested-by': 'ThoughtSpot',
        },
    });
}

// eslint-disable-next-line import/no-mutable-exports
let loggedInStatus = false;
// eslint-disable-next-line import/no-mutable-exports
let samlAuthWindow = null;
// eslint-disable-next-line import/no-mutable-exports
let samlCompletionPromise = null;
let sessionInfo = null;
let releaseVersion = '';
const SSO_REDIRECTION_MARKER_GUID = '5e16222e-ef02-43e9-9fbd-24226bf3ce5b';
const EndPoints = {
    AUTH_VERIFICATION: '/callosum/v1/session/info',
    SAML_LOGIN_TEMPLATE: (targetUrl) => `/callosum/v1/saml/login?targetURLPath=${targetUrl}`,
    OIDC_LOGIN_TEMPLATE: (targetUrl) => `/callosum/v1/oidc/login?targetURLPath=${targetUrl}`,
    TOKEN_LOGIN: '/callosum/v1/session/login/token',
    BASIC_LOGIN: '/callosum/v1/session/login',
    LOGOUT: '/callosum/v1/session/logout',
};
var AuthFailureType;
(function (AuthFailureType) {
    AuthFailureType["SDK"] = "SDK";
    AuthFailureType["NO_COOKIE_ACCESS"] = "NO_COOKIE_ACCESS";
    AuthFailureType["EXPIRY"] = "EXPIRY";
    AuthFailureType["OTHER"] = "OTHER";
})(AuthFailureType || (AuthFailureType = {}));
var AuthStatus;
(function (AuthStatus) {
    /**
     * Emits when the SDK fails to authenticate
     */
    AuthStatus["FAILURE"] = "FAILURE";
    /**
     * Emits when the SDK authenticates successfully
     */
    AuthStatus["SDK_SUCCESS"] = "SDK_SUCCESS";
    /**
     * Emits when the app sends an authentication success message
     */
    AuthStatus["SUCCESS"] = "SUCCESS";
    /**
     * Emits when a user logs out
     */
    AuthStatus["LOGOUT"] = "LOGOUT";
})(AuthStatus || (AuthStatus = {}));
/**
 * Check if we are logged into the ThoughtSpot cluster
 * @param thoughtSpotHost The ThoughtSpot cluster hostname or IP
 */
async function isLoggedIn(thoughtSpotHost) {
    const authVerificationUrl = `${thoughtSpotHost}${EndPoints.AUTH_VERIFICATION}`;
    let response = null;
    try {
        response = await fetchSessionInfoService(authVerificationUrl);
        const sessionInfoResp = await response.json();
        releaseVersion = sessionInfoResp.releaseVersion;
    }
    catch (e) {
        return false;
    }
    return response.status === 200;
}
/**
 * Return releaseVersion if available
 */
function getReleaseVersion() {
    return releaseVersion;
}
function initSession(sessionDetails) {
    sessionInfo = sessionDetails;
    initMixpanel(sessionInfo);
}
const DUPLICATE_TOKEN_ERR = 'Duplicate token, please issue a new token every time getAuthToken callback is called.' +
    'See https://developers.thoughtspot.com/docs/?pageid=embed-auth#trusted-auth-embed for more details.';
let prevAuthToken = null;
function alertForDuplicateToken(authtoken) {
    if (prevAuthToken === authtoken) {
        // eslint-disable-next-line no-alert
        alert(DUPLICATE_TOKEN_ERR);
        throw new Error(DUPLICATE_TOKEN_ERR);
    }
    prevAuthToken = authtoken;
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
    loggedInStatus = await isLoggedIn(thoughtSpotHost);
    if (!loggedInStatus) {
        let authToken = null;
        if (getAuthToken) {
            authToken = await getAuthToken();
            alertForDuplicateToken(authToken);
        }
        else {
            const response = await fetchAuthTokenService(authEndpoint);
            authToken = await response.text();
        }
        let resp;
        try {
            resp = await fetchAuthPostService(thoughtSpotHost, username, authToken);
        }
        catch (e) {
            resp = await fetchAuthService(thoughtSpotHost, username, authToken);
        }
        // token login issues a 302 when successful
        loggedInStatus = resp.ok || resp.type === 'opaqueredirect';
        if (loggedInStatus && embedConfig.detectCookieAccessSlow) {
            // When 3rd party cookie access is blocked, this will fail because cookies will
            // not be sent with the call.
            loggedInStatus = await isLoggedIn(thoughtSpotHost);
        }
    }
    return loggedInStatus;
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
        const response = await fetchBasicAuthService(thoughtSpotHost, username, password);
        loggedInStatus = response.ok;
        if (embedConfig.detectCookieAccessSlow) {
            loggedInStatus = await isLoggedIn(thoughtSpotHost);
        }
    }
    else {
        loggedInStatus = true;
    }
    return loggedInStatus;
};
async function samlPopupFlow(ssoURL, triggerContainer, triggerText) {
    const containerEl = getDOMNode(triggerContainer);
    containerEl.innerHTML =
        '<button id="ts-auth-btn" class="ts-auth-btn" style="margin: auto;"></button>';
    const authElem = document.getElementById('ts-auth-btn');
    authElem.textContent = triggerText;
    samlCompletionPromise =
        samlCompletionPromise ||
            new Promise((resolve, reject) => {
                window.addEventListener('message', (e) => {
                    if (e.data.type === EmbedEvent.SAMLComplete) {
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
    return samlCompletionPromise;
}
/**
 * Perform SAML authentication
 * @param embedConfig The embed configuration
 */
const doSSOAuth = async (embedConfig, ssoEndPoint) => {
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
    const ssoURL = `${thoughtSpotHost}${ssoEndPoint}`;
    if (embedConfig.noRedirect || embedConfig.inPopup) {
        await samlPopupFlow(ssoURL, embedConfig.authTriggerContainer, embedConfig.authTriggerText);
        loggedInStatus = true;
        return;
    }
    window.location.href = ssoURL;
};
const doSamlAuth = async (embedConfig) => {
    const { thoughtSpotHost } = embedConfig;
    // redirect for SSO, when the SSO authentication is done, this page will be loaded
    // again and the same JS will execute again.
    const ssoRedirectUrl = embedConfig.noRedirect
        ? `${thoughtSpotHost}/v2/#/embed/saml-complete`
        : getRedirectUrl(window.location.href, SSO_REDIRECTION_MARKER_GUID, embedConfig.redirectPath);
    // bring back the page to the same URL
    const ssoEndPoint = `${EndPoints.SAML_LOGIN_TEMPLATE(encodeURIComponent(ssoRedirectUrl))}`;
    await doSSOAuth(embedConfig, ssoEndPoint);
    return loggedInStatus;
};
const doOIDCAuth = async (embedConfig) => {
    const { thoughtSpotHost } = embedConfig;
    // redirect for SSO, when the SSO authentication is done, this page will be loaded
    // again and the same JS will execute again.
    const ssoRedirectUrl = embedConfig.noRedirect || embedConfig.inPopup
        ? `${thoughtSpotHost}/v2/#/embed/saml-complete`
        : getRedirectUrl(window.location.href, SSO_REDIRECTION_MARKER_GUID, embedConfig.redirectPath);
    // bring back the page to the same URL
    const ssoEndPoint = `${EndPoints.OIDC_LOGIN_TEMPLATE(encodeURIComponent(ssoRedirectUrl))}`;
    await doSSOAuth(embedConfig, ssoEndPoint);
    return loggedInStatus;
};
const logout = async (embedConfig) => {
    const { thoughtSpotHost } = embedConfig;
    const response = await fetchLogoutService(thoughtSpotHost);
    loggedInStatus = false;
    return loggedInStatus;
};
/**
 * Perform authentication on the ThoughtSpot cluster
 * @param embedConfig The embed configuration
 */
const authenticate = async (embedConfig) => {
    const { authType } = embedConfig;
    switch (authType) {
        case AuthType.SSO:
        case AuthType.SAMLRedirect:
        case AuthType.SAML:
            return doSamlAuth(embedConfig);
        case AuthType.OIDC:
        case AuthType.OIDCRedirect:
            return doOIDCAuth(embedConfig);
        case AuthType.AuthServer:
        case AuthType.TrustedAuthToken:
            return doTokenAuth(embedConfig);
        case AuthType.Basic:
            return doBasicAuth(embedConfig);
        default:
            return Promise.resolve(true);
    }
};

/* eslint-disable import/no-mutable-exports */
let config = {};
const CONFIG_DEFAULTS = {
    loginFailedMessage: 'Not logged in',
    authTriggerText: 'Authorize',
    authType: AuthType.None,
};
let authPromise;
const getEmbedConfig = () => config;
const getAuthPromise = () => authPromise;
let authEE;
function notifyAuthSDKSuccess() {
    if (!authEE) {
        console.error('SDK not initialized');
        return;
    }
    authEE.emit(AuthStatus.SDK_SUCCESS);
}
function notifyAuthSuccess() {
    if (!authEE) {
        console.error('SDK not initialized');
        return;
    }
    authEE.emit(AuthStatus.SUCCESS);
}
function notifyAuthFailure(failureType) {
    if (!authEE) {
        console.error('SDK not initialized');
        return;
    }
    authEE.emit(AuthStatus.FAILURE, failureType);
}
function notifyLogout() {
    if (!authEE) {
        console.error('SDK not initialized');
        return;
    }
    authEE.emit(AuthStatus.LOGOUT);
}
/**
 * Perform authentication on the ThoughtSpot app as applicable.
 */
const handleAuth = () => {
    authPromise = authenticate(config);
    authPromise.then((isLoggedIn) => {
        if (!isLoggedIn) {
            notifyAuthFailure(AuthFailureType.SDK);
        }
        else {
            notifyAuthSDKSuccess();
        }
    }, () => {
        notifyAuthFailure(AuthFailureType.SDK);
    });
    return authPromise;
};
const hostUrlToFeatureUrl = {
    [PrefetchFeatures.SearchEmbed]: (url) => `${url}v2/#/embed/answer`,
    [PrefetchFeatures.LiveboardEmbed]: (url) => url,
    [PrefetchFeatures.FullApp]: (url) => url,
    [PrefetchFeatures.VizEmbed]: (url) => url,
};
/**
 * Prefetches static resources from the specified URL. Web browsers can then cache the prefetched resources and serve them from the user's local disk to provide faster access to your app.
 * @param url The URL provided for prefetch
 * @param prefetchFeatures Specify features which needs to be prefetched.
 * @version SDK: 1.4.0 | ThoughtSpot: ts7.sep.cl, 7.2.1
 */
const prefetch = (url, prefetchFeatures) => {
    if (url === '') {
        // eslint-disable-next-line no-console
        console.warn('The prefetch method does not have a valid URL');
    }
    else {
        const features = prefetchFeatures || [PrefetchFeatures.FullApp];
        let hostUrl = url || config.thoughtSpotHost;
        hostUrl = hostUrl[hostUrl.length - 1] === '/' ? hostUrl : `${hostUrl}/`;
        uniq_1(features.map((feature) => hostUrlToFeatureUrl[feature](hostUrl))).forEach((prefetchUrl, index) => {
            const iFrame = document.createElement('iframe');
            iFrame.src = prefetchUrl;
            iFrame.style.width = '0';
            iFrame.style.height = '0';
            iFrame.style.border = '0';
            iFrame.classList.add('prefetchIframe');
            iFrame.classList.add(`prefetchIframeNum-${index}`);
            document.body.appendChild(iFrame);
        });
    }
};
function sanity(embedConfig) {
    if (embedConfig.thoughtSpotHost === undefined) {
        throw new Error('ThoughtSpot host not provided');
    }
    if (embedConfig.authType === AuthType.TrustedAuthToken) {
        if (!embedConfig.username) {
            throw new Error('Username not provided with Trusted auth');
        }
        if (!embedConfig.authEndpoint &&
            typeof embedConfig.getAuthToken !== 'function') {
            throw new Error('Trusted auth should provide either authEndpoint or getAuthToken');
        }
    }
    if (embedConfig.noRedirect && !embedConfig.authTriggerContainer) {
        throw new Error('authTriggerContainer not provided with noRedirect');
    }
}
/**
 * Initializes the Visual Embed SDK globally and perform
 * authentication if applicable.
 * @param embedConfig The configuration object containing ThoughtSpot host,
 * authentication mechanism and so on.
 * example: authStatus = init(config);
 * authStatus.on(AuthStatus.FAILURE, (reason) => { // do something here });
 * @returns event emitter which emits events on authentication success, failure and logout. See {@link AuthStatus}
 * @version SDK: 1.0.0 | ThoughtSpot ts7.april.cl, 7.2.1
 */
const init = (embedConfig) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    sanity(embedConfig);
    config = {
        ...CONFIG_DEFAULTS,
        ...embedConfig,
        thoughtSpotHost: getThoughtSpotHost(embedConfig),
    };
    authEE = new eventemitter3();
    handleAuth();
    uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_CALLED_INIT, {
        authType: config.authType,
        host: config.thoughtSpotHost,
        usedCustomizationSheet: ((_b = (_a = embedConfig.customizations) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.customCSSUrl) != null,
        usedCustomizationVariables: ((_e = (_d = (_c = embedConfig.customizations) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.customCSS) === null || _e === void 0 ? void 0 : _e.variables) != null,
        usedCustomizationRules: ((_h = (_g = (_f = embedConfig.customizations) === null || _f === void 0 ? void 0 : _f.style) === null || _g === void 0 ? void 0 : _g.customCSS) === null || _h === void 0 ? void 0 : _h.rules_UNSTABLE) !=
            null,
    });
    if (config.callPrefetch) {
        prefetch(config.thoughtSpotHost);
    }
    return authEE;
};
function disableAutoLogin() {
    config.autoLogin = false;
}
/**
 * Logs out from ThoughtSpot. This also sets the autoLogin flag to false, to prevent
 * the SDK from automatically logging in again.
 *
 * You can call the `init` method again to re login, if autoLogin is set to true in this
 * second call it will be honored.
 *
 * @param doNotDisableAutoLogin This flag when passed will not disable autoLogin
 * @returns Promise which resolves when logout completes.
 * @version SDK: 1.10.1 | ThoughtSpot: 8.2.0.cl, 8.4.1-sw
 */
const logout$1 = (doNotDisableAutoLogin = false) => {
    if (!doNotDisableAutoLogin) {
        disableAutoLogin();
    }
    return logout(config).then((isLoggedIn) => {
        notifyLogout();
        return isLoggedIn;
    });
};
let renderQueue = Promise.resolve();
/**
 * Renders functions in a queue, resolves to next function only after the callback next is called
 * @param fn The function being registered
 */
const renderInQueue = (fn) => {
    const { queueMultiRenders = false } = config;
    if (queueMultiRenders) {
        renderQueue = renderQueue.then(() => new Promise((res) => fn(res)));
        return renderQueue;
    }
    // Sending an empty function to keep it consistent with the above usage.
    return fn(() => { }); // eslint-disable-line @typescript-eslint/no-empty-function
};

function getAnswerServiceInstance(session, query, operation, thoughtSpotHost) {
    let variable;
    const fetchQuery = async (variables) => {
        try {
            const response = await fetch(`${thoughtSpotHost}/prism/?op=${operation}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'x-requested-by': 'ThoughtSpot',
                    accept: '*/*',
                    'accept-language': 'en-us',
                },
                body: JSON.stringify({
                    operationName: operation,
                    query,
                    variables,
                }),
                credentials: 'include',
            });
            const result = await response.json();
            return result.data;
        }
        catch (error) {
            return error;
        }
    };
    const fetchData = (offset, batchSize) => {
        if (operation === OperationType.GetChartWithData) {
            variable = { batchSize, offset: offset * batchSize };
        }
        else {
            variable = {
                dataPaginationParams: {
                    isClientPaginated: true,
                    offset: offset * batchSize,
                    size: batchSize,
                },
            };
        }
        return fetchQuery({
            session,
            ...variable,
        });
    };
    return {
        fetchData,
    };
}

function processCustomAction(e, thoughtSpotHost) {
    var _a;
    if ([
        OperationType.GetChartWithData,
        OperationType.GetTableWithHeadlineData,
    ].includes((_a = e.data) === null || _a === void 0 ? void 0 : _a.operation)) {
        const { session, query, operation } = e.data;
        const answerService = getAnswerServiceInstance(session, query, operation, thoughtSpotHost);
        return {
            ...e,
            answerService,
        };
    }
    return e;
}
function processAuthInit(e) {
    var _a, _b;
    // Store user session details sent by app.
    initSession(e.data);
    notifyAuthSuccess();
    // Expose only allowed details (eg: userGUID) back to SDK users.
    return {
        ...e,
        data: {
            userGUID: ((_a = e.data) === null || _a === void 0 ? void 0 : _a.userGUID) || ((_b = e.payload) === null || _b === void 0 ? void 0 : _b.userGUID),
        },
    };
}
function processAuthExpire(e) {
    const { autoLogin = false } = getEmbedConfig(); // Set default to false
    if (autoLogin) {
        handleAuth();
    }
    notifyAuthFailure(AuthFailureType.EXPIRY);
    return e;
}
function processNoCookieAccess(e, containerEl) {
    const { loginFailedMessage, suppressNoCookieAccessAlert, } = getEmbedConfig();
    if (!suppressNoCookieAccessAlert) {
        // eslint-disable-next-line no-alert
        alert('Third party cookie access is blocked on this browser, please allow third party cookies for this to work properly. \nYou can use `suppressNoCookieAccessAlert` to suppress this message.');
    }
    // eslint-disable-next-line no-param-reassign
    containerEl.innerHTML = loginFailedMessage;
    notifyAuthFailure(AuthFailureType.NO_COOKIE_ACCESS);
    return e;
}
function processAuthFailure(e, containerEl) {
    const { loginFailedMessage, authType } = getEmbedConfig();
    if (authType !== AuthType.None) {
        // eslint-disable-next-line no-param-reassign
        containerEl.innerHTML = loginFailedMessage;
        notifyAuthFailure(AuthFailureType.OTHER);
    }
    return e;
}
function processAuthLogout(e, containerEl) {
    const { loginFailedMessage } = getEmbedConfig();
    // eslint-disable-next-line no-param-reassign
    containerEl.innerHTML = loginFailedMessage;
    disableAutoLogin();
    notifyLogout();
    return e;
}
function processEventData(type, e, thoughtSpotHost, containerEl) {
    switch (type) {
        case EmbedEvent.CustomAction:
            return processCustomAction(e, thoughtSpotHost);
        case EmbedEvent.AuthInit:
            return processAuthInit(e);
        case EmbedEvent.AuthExpire:
            return processAuthExpire(e);
        case EmbedEvent.NoCookieAccess:
            return processNoCookieAccess(e, containerEl);
        case EmbedEvent.AuthFailure:
            return processAuthFailure(e, containerEl);
        case EmbedEvent.AuthLogout:
            return processAuthLogout(e, containerEl);
    }
    return e;
}

/**
 * Reloads the ThoughtSpot iframe.
 */
function reload(iFrame) {
    const oldFrame = iFrame.cloneNode();
    const parent = iFrame.parentNode;
    parent.removeChild(iFrame);
    parent.appendChild(oldFrame);
}
/**
 * Post Iframe message.
 */
function postIframeMessage(iFrame, message, thoughtSpotHost, channel) {
    return iFrame.contentWindow.postMessage(message, thoughtSpotHost, [
        channel === null || channel === void 0 ? void 0 : channel.port2,
    ]);
}
const TRIGGER_TIMEOUT = 30000;
function processTrigger(iFrame, messageType, thoughtSpotHost, data) {
    return new Promise((res, rej) => {
        if (messageType === HostEvent.Reload) {
            reload(iFrame);
            return res(null);
        }
        const channel = new MessageChannel();
        channel.port1.onmessage = ({ data: responseData }) => {
            channel.port1.close();
            if (responseData.error) {
                rej(responseData.error);
            }
            else {
                res(responseData);
            }
        };
        // Close the messageChannel and resolve the promise if timeout.
        setTimeout(() => {
            channel.port1.close();
            res(new Error(ERROR_MESSAGE.TRIGGER_TIMED_OUT));
        }, TRIGGER_TIMEOUT);
        return postIframeMessage(iFrame, { type: messageType, data }, thoughtSpotHost, channel);
    });
}

var name="@thoughtspot/visual-embed-sdk";var version="1.18.0";var description="ThoughtSpot Embed SDK";var module="lib/src/index.js";var main="dist/tsembed.js";var types="lib/src/index.d.ts";var files=["dist/**","lib/**","src/**"];var exports={".":"./lib/src/index.js","./react":{"import":"./lib/src/react/index.js",require:"./cjs/src/react.index.js",types:"./lib/src/react/index.d.ts"}};var typesVersions={"*":{react:["./lib/src/react/index.d.ts"]}};var scripts={lint:"eslint 'src/**'","lint:fix":"eslint 'src/**/*.*' --fix",tsc:"tsc -p . --incremental false; tsc -p . --incremental false --module commonjs --outDir cjs",start:"gatsby develop","build:gatsby":"npm run clean:gatsby && gatsby build --prefix-paths","build:gatsby:noprefix":"npm run clean:gatsby && gatsby build","serve:gatsby":"gatsby serve","clean:gatsby":"gatsby clean","build-and-publish":"npm run build:gatsby && npm run publish","bundle-dts":"dts-bundle --name @thoughtspot/visual-embed-sdk --out visual-embed-sdk.d.ts --main lib/src/index.d.ts",build:"rollup -c",watch:"rollup -cw","docs-cmd":"node scripts/gatsby-commands.js",docgen:"typedoc --tsconfig tsconfig.json --theme typedoc-theme","test-sdk":"jest -c jest.config.sdk.js --runInBand","test-docs":"jest -c jest.config.docs.js",test:"npm run test-sdk && npm run test-docs",posttest:"cat ./coverage/sdk/lcov.info | coveralls",prepublishOnly:"npm run test; npm run tsc; npm run bundle-dts; npm run build","publish-dev":"npm publish --tag dev","publish-prod":"npm publish --tag latest"};var peerDependencies={react:"> 16.8.0","react-dom":"> 16.8.0"};var dependencies={algoliasearch:"^4.10.5",classnames:"^2.3.1",eventemitter3:"^4.0.7","gatsby-plugin-vercel":"^1.0.3","html-react-parser":"^1.4.12",lodash:"^4.17.21","mixpanel-browser":"^2.45.0","use-deep-compare-effect":"^1.8.1"};var devDependencies={"@mdx-js/mdx":"^1.6.22","@mdx-js/react":"^1.6.22","@react-icons/all-files":"^4.1.0","@rollup/plugin-commonjs":"^18.0.0","@rollup/plugin-json":"^4.1.0","@rollup/plugin-node-resolve":"^11.2.1","@testing-library/dom":"^7.31.0","@testing-library/jest-dom":"^5.14.1","@testing-library/react":"^11.2.7","@testing-library/user-event":"^13.1.8","@types/jest":"^22.2.3","@types/mixpanel-browser":"^2.35.6","@types/react-test-renderer":"^17.0.1","@typescript-eslint/eslint-plugin":"^4.6.0","@typescript-eslint/parser":"^4.6.0",asciidoctor:"^2.2.1","babel-jest":"^26.6.3","babel-preset-gatsby":"^1.10.0","command-line-args":"^5.1.1",coveralls:"^3.1.0","dts-bundle":"0.7.3",eslint:"^7.12.1","eslint-config-airbnb-base":"^14.2.0","eslint-config-prettier":"^6.15.0","eslint-import-resolver-typescript":"^2.3.0","eslint-plugin-import":"^2.22.1","eslint-plugin-prettier":"^3.1.4","eslint-plugin-react-hooks":"^4.2.0","fs-extra":"^10.0.0",gatsby:"3.13.1","gatsby-plugin-algolia":"^0.22.2","gatsby-plugin-catch-links":"^3.1.0","gatsby-plugin-env-variables":"^2.1.0","gatsby-plugin-intl":"^0.3.3","gatsby-plugin-manifest":"^3.2.0","gatsby-plugin-output":"^0.1.3","gatsby-plugin-sass":"4.1.0","gatsby-plugin-sitemap":"^4.10.0","gatsby-source-filesystem":"3.1.0","gatsby-transformer-asciidoc":"2.1.0","gatsby-transformer-rehype":"2.0.0","gh-pages":"^3.1.0","highlight.js":"^10.6.0","html-to-text":"^8.0.0","identity-obj-proxy":"^3.0.0","istanbul-merge":"^1.1.1",jest:"^26.6.3","jest-puppeteer":"^4.4.0",jsdom:"^17.0.0","node-sass":"^4.0.0",prettier:"2.1.2",puppeteer:"^7.0.1",react:"^16.14.0","react-dom":"^16.14.0","react-resizable":"^1.11.0","react-resize-detector":"^6.6.0","react-test-renderer":"^17.0.2","react-use-flexsearch":"^0.1.1",rollup:"2.30.0","rollup-plugin-typescript2":"0.27.3","ts-jest":"^26.5.5","ts-loader":"8.0.4",typedoc:"0.21.6","typedoc-neo-theme":"^1.1.0","typedoc-plugin-toc-group":"0.0.5",typescript:"^4.9.4","url-search-params-polyfill":"^8.1.0",util:"^0.12.4"};var author="ThoughtSpot";var email="support@thoughtspot.com";var license="ThoughtSpot Development Tools End User License Agreement";var directories={lib:"lib"};var repository={type:"git",url:"git+https://github.com/thoughtspot/visual-embed-sdk.git"};var publishConfig={registry:"https://registry.npmjs.org"};var keywords=["thoughtspot","everywhere","embed","sdk","analytics"];var bugs={url:"https://github.com/thoughtspot/visual-embed-sdk/issues"};var homepage="https://github.com/thoughtspot/visual-embed-sdk#readme";var globals={window:{}};var pkgInfo = {name:name,version:version,description:description,module:module,main:main,types:types,files:files,exports:exports,typesVersions:typesVersions,scripts:scripts,peerDependencies:peerDependencies,dependencies:dependencies,devDependencies:devDependencies,author:author,email:email,license:license,directories:directories,repository:repository,publishConfig:publishConfig,keywords:keywords,bugs:bugs,homepage:homepage,globals:globals};

/**
 * Copyright (c) 2022
 *
 * Base classes
 *
 * @summary Base classes
 * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
 */
const { version: version$1 } = pkgInfo;
/**
 * Global prefix for all Thoughtspot postHash Params.
 */
const THOUGHTSPOT_PARAM_PREFIX = 'ts-';
/**
 * The event id map from v2 event names to v1 event id
 * v1 events are the classic embed events implemented in Blink v1
 * We cannot rename v1 event types to maintain backward compatibility
 * @internal
 */
const V1EventMap = {
    [EmbedEvent.Data]: [EmbedEvent.V1Data],
};
/**
 * Base class for embedding v2 experience
 * Note: the v2 version of ThoughtSpot Blink is built on the new stack:
 * React+GraphQL
 */
class TsEmbed {
    constructor(domSelector, viewConfig) {
        /**
         * Should we encode URL Query Params using base64 encoding which thoughtspot
         * will generate for embedding. This provides additional security to
         * thoughtspot clusters against Cross site scripting attacks.
         * @default false
         */
        this.shouldEncodeUrlQueryParams = false;
        this.defaultHiddenActions = [Action.ReportError];
        /**
         * Send Custom style as part of payload of APP_INIT
         */
        this.appInitCb = (_, responder) => {
            responder({
                type: EmbedEvent.APP_INIT,
                data: {
                    customisations: getCustomisations(this.embedConfig, this.viewConfig),
                },
            });
        };
        /**
         * Register APP_INIT event and sendback init payload
         */
        this.registerAppInit = () => {
            this.on(EmbedEvent.APP_INIT, this.appInitCb);
        };
        this.el = getDOMNode(domSelector);
        // TODO: handle error
        this.embedConfig = getEmbedConfig();
        this.thoughtSpotHost = getThoughtSpotHost(this.embedConfig);
        this.thoughtSpotV2Base = getV2BasePath(this.embedConfig);
        this.eventHandlerMap = new Map();
        this.isError = false;
        this.viewConfig = viewConfig;
        this.shouldEncodeUrlQueryParams = this.embedConfig.shouldEncodeUrlQueryParams;
        this.registerAppInit();
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
        this.executeCallbacks(EmbedEvent.Error, {
            error,
        });
        // Log error
        console.error(error);
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
     * Extracts the port field from the event payload
     * @param event  The window message event
     * @returns
     */
    getEventPort(event) {
        if (event.ports.length && event.ports[0]) {
            return event.ports[0];
        }
        return null;
    }
    /**
     * fix for ts7.sep.cl
     * will be removed for ts7.oct.cl
     * @hidden
     */
    formatEventData(event, eventType) {
        const eventData = {
            ...event.data,
            type: eventType,
        };
        if (!eventData.data) {
            eventData.data = event.data.payload;
        }
        return eventData;
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
            const eventPort = this.getEventPort(event);
            const eventData = this.formatEventData(event, eventType);
            if (event.source === this.iFrame.contentWindow) {
                this.executeCallbacks(eventType, processEventData(eventType, eventData, this.thoughtSpotHost, this.el), eventPort);
            }
        });
    }
    /**
     * Constructs the base URL string to load the ThoughtSpot app.
     */
    getEmbedBasePath(query) {
        let queryString = query;
        if (this.shouldEncodeUrlQueryParams) {
            queryString = `?base64UrlEncodedFlags=${getEncodedQueryParamsString(queryString.substr(1))}`;
        }
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
     * Common query params set for all the embed modes.
     * @returns queryParams
     */
    getBaseQueryParams() {
        var _a, _b;
        const queryParams = {};
        let hostAppUrl = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.host) || '';
        // The below check is needed because TS Cloud firewall, blocks localhost/127.0.0.1
        // in any url param.
        if (hostAppUrl.includes('localhost') ||
            hostAppUrl.includes('127.0.0.1')) {
            hostAppUrl = 'local-host';
        }
        queryParams[Param.HostAppUrl] = encodeURIComponent(hostAppUrl);
        queryParams[Param.ViewPortHeight] = window.innerHeight;
        queryParams[Param.ViewPortWidth] = window.innerWidth;
        queryParams[Param.Version] = version$1;
        queryParams[Param.AuthType] = this.embedConfig.authType;
        if (this.embedConfig.disableLoginRedirect === true ||
            this.embedConfig.autoLogin === true) {
            queryParams[Param.DisableLoginRedirect] = true;
        }
        if (this.embedConfig.authType === AuthType.EmbeddedSSO) {
            queryParams[Param.ForceSAMLAutoRedirect] = true;
        }
        const { disabledActions, disabledActionReason, hiddenActions, visibleActions, showAlerts, additionalFlags, locale, customizations, } = this.viewConfig;
        if (Array.isArray(visibleActions) && Array.isArray(hiddenActions)) {
            this.handleError('You cannot have both hidden actions and visible actions');
            return queryParams;
        }
        // TODO remove embedConfig.customCssUrl
        const cssUrlParam = ((_b = customizations === null || customizations === void 0 ? void 0 : customizations.style) === null || _b === void 0 ? void 0 : _b.customCSSUrl) ||
            this.embedConfig.customCssUrl;
        if (cssUrlParam) {
            queryParams[Param.CustomCSSUrl] = cssUrlParam;
        }
        if (disabledActions === null || disabledActions === void 0 ? void 0 : disabledActions.length) {
            queryParams[Param.DisableActions] = disabledActions;
        }
        if (disabledActionReason) {
            queryParams[Param.DisableActionReason] = disabledActionReason;
        }
        queryParams[Param.HideActions] = [
            ...this.defaultHiddenActions,
            ...(hiddenActions !== null && hiddenActions !== void 0 ? hiddenActions : []),
        ];
        if (Array.isArray(visibleActions)) {
            queryParams[Param.VisibleActions] = visibleActions;
        }
        if (showAlerts !== undefined) {
            queryParams[Param.ShowAlerts] = showAlerts;
        }
        if (locale !== undefined) {
            queryParams[Param.Locale] = locale;
        }
        if (additionalFlags && additionalFlags.constructor.name === 'Object') {
            Object.assign(queryParams, additionalFlags);
        }
        return queryParams;
    }
    /**
     * Constructs the base URL string to load v1 of the ThoughtSpot app.
     * This is used for embedding Liveboards, visualizations, and full application.
     * @param queryString The query string to append to the URL.
     * @param isAppEmbed A Boolean parameter to specify if you are embedding
     * the full application.
     */
    getV1EmbedBasePath(queryString, showPrimaryNavbar = false, disableProfileAndHelp = false, isAppEmbed = false, enableSearchAssist = false) {
        const queryStringFrag = queryString ? `&${queryString}` : '';
        const primaryNavParam = `&primaryNavHidden=${!showPrimaryNavbar}`;
        const disableProfileAndHelpParam = `&profileAndHelpInNavBarHidden=${disableProfileAndHelp}`;
        const enableSearchAssistParam = `&${Param.EnableSearchAssist}=${enableSearchAssist}`;
        let queryParams = `?embedApp=true${isAppEmbed ? primaryNavParam : ''}${isAppEmbed ? disableProfileAndHelpParam : ''}${enableSearchAssist ? enableSearchAssistParam : ''}${queryStringFrag}`;
        if (this.shouldEncodeUrlQueryParams) {
            queryParams = `?base64UrlEncodedFlags=${getEncodedQueryParamsString(queryParams.substr(1))}`;
        }
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
    async renderIFrame(url, frameOptions = {}) {
        if (this.isError) {
            return null;
        }
        if (!this.thoughtSpotHost) {
            this.throwInitError();
        }
        if (url.length > URL_MAX_LENGTH) ;
        return renderInQueue((nextInQueue) => {
            var _a;
            const initTimestamp = Date.now();
            this.executeCallbacks(EmbedEvent.Init, {
                data: {
                    timestamp: initTimestamp,
                },
                type: EmbedEvent.Init,
            });
            uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_RENDER_START);
            return (_a = getAuthPromise()) === null || _a === void 0 ? void 0 : _a.then((isLoggedIn) => {
                if (!isLoggedIn) {
                    this.el.innerHTML = this.embedConfig.loginFailedMessage;
                    return;
                }
                uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_RENDER_COMPLETE);
                this.iFrame =
                    this.iFrame || document.createElement('iframe');
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.iFrame.allow = 'clipboard-read; clipboard-write';
                const { height: frameHeight, width: frameWidth, ...restParams } = frameOptions;
                const width = getCssDimension(frameWidth || DEFAULT_EMBED_WIDTH);
                const height = getCssDimension(frameHeight || DEFAULT_EMBED_HEIGHT);
                setAttributes(this.iFrame, restParams);
                this.iFrame.style.width = `${width}`;
                this.iFrame.style.height = `${height}`;
                this.iFrame.style.border = '0';
                this.iFrame.name = 'ThoughtSpot Embedded Analytics';
                this.iFrame.addEventListener('load', () => {
                    nextInQueue();
                    const loadTimestamp = Date.now();
                    this.executeCallbacks(EmbedEvent.Load, {
                        data: {
                            timestamp: loadTimestamp,
                        },
                        type: EmbedEvent.Load,
                    });
                    uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_IFRAME_LOAD_PERFORMANCE, {
                        timeTookToLoad: loadTimestamp - initTimestamp,
                    });
                });
                this.iFrame.addEventListener('error', () => {
                    nextInQueue();
                });
                this.el.innerHTML = '';
                this.el.appendChild(this.iFrame);
                const prefetchIframe = document.querySelectorAll('.prefetchIframe');
                if (prefetchIframe.length) {
                    prefetchIframe.forEach((el) => {
                        el.remove();
                    });
                }
                this.subscribeToEvents();
            }).catch((error) => {
                nextInQueue();
                uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_RENDER_FAILED);
                this.el.innerHTML = this.embedConfig.loginFailedMessage;
                this.handleError(error);
            });
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
     * @param eventPort The event Port for a specific MessageChannel
     */
    executeCallbacks(eventType, data, eventPort) {
        const callbacks = this.eventHandlerMap.get(eventType) || [];
        const allHandlers = this.eventHandlerMap.get(EmbedEvent.ALL) || [];
        callbacks.push(...allHandlers);
        const dataStatus = (data === null || data === void 0 ? void 0 : data.status) || embedEventStatus.END;
        callbacks.forEach((callbackObj) => {
            if ((callbackObj.options.start &&
                dataStatus === embedEventStatus.START) || // When start status is true it trigger only start releated payload
                (!callbackObj.options.start &&
                    dataStatus === embedEventStatus.END) // When start status is false it trigger only end releated payload
            ) {
                callbackObj.callback(data, (payload) => {
                    this.triggerEventOnPort(eventPort, payload);
                });
            }
        });
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
     * Calculates the iframe center for the current visible viewPort
     * of iframe using Scroll position of Host App, offsetTop for iframe
     * in Host app. ViewPort height of the tab.
     * @returns iframe Center in visible viewport,
     *  Iframe height,
     *  View port height.
     */
    getIframeCenter() {
        const offsetTopClient = getOffsetTop(this.iFrame);
        const scrollTopClient = window.scrollY;
        const viewPortHeight = window.innerHeight;
        const iframeHeight = this.iFrame.offsetHeight;
        const iframeScrolled = scrollTopClient - offsetTopClient;
        let iframeVisibleViewPort;
        let iframeOffset;
        if (iframeScrolled < 0) {
            iframeVisibleViewPort =
                viewPortHeight - (offsetTopClient - scrollTopClient);
            iframeVisibleViewPort = Math.min(iframeHeight, iframeVisibleViewPort);
            iframeOffset = 0;
        }
        else {
            iframeVisibleViewPort = Math.min(iframeHeight - iframeScrolled, viewPortHeight);
            iframeOffset = iframeScrolled;
        }
        const iframeCenter = iframeOffset + iframeVisibleViewPort / 2;
        return {
            iframeCenter,
            iframeScrolled,
            iframeHeight,
            viewPortHeight,
            iframeVisibleViewPort,
        };
    }
    /**
     * Registers an event listener to trigger an alert when the ThoughtSpot app
     * sends an event of a particular message type to the host application.
     *
     * @param messageType The message type
     * @param callback A callback as a function
     * @param options The message options
     */
    on(messageType, callback, options = { start: false }) {
        if (this.isRendered) {
            this.handleError('Please register event handlers before calling render');
        }
        const callbacks = this.eventHandlerMap.get(messageType) || [];
        callbacks.push({ options, callback });
        this.eventHandlerMap.set(messageType, callbacks);
        return this;
    }
    /**
     * Triggers an event on specific Port registered against
     * for the EmbedEvent
     * @param eventType The message type
     * @param data The payload to send
     */
    triggerEventOnPort(eventPort, payload) {
        if (eventPort) {
            try {
                eventPort.postMessage({
                    type: payload.type,
                    data: payload.data,
                });
            }
            catch (e) {
                eventPort.postMessage({ error: e });
                console.log(e);
            }
        }
        else {
            console.log('Event Port is not defined');
        }
    }
    /**
     * Triggers an event to the embedded app
     * @param messageType The event type
     * @param data The payload to send with the message
     */
    trigger(messageType, data = {}) {
        uploadMixpanelEvent(`${MIXPANEL_EVENT.VISUAL_SDK_TRIGGER}-${messageType}`);
        return processTrigger(this.iFrame, messageType, this.thoughtSpotHost, data);
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
    /**
     * Get the Post Url Params for THOUGHTSPOT from the current
     * host app URL.
     * THOUGHTSPOT URL params starts with a prefix "ts-"
     * @version SDK: 1.14.0 | ThoughtSpot: 8.4.0.cl, 8.4.1-sw
     */
    getThoughtSpotPostUrlParams() {
        const urlHash = window.location.hash;
        const queryParams = window.location.search;
        const postHashParams = urlHash.split('?');
        const postURLParams = postHashParams[postHashParams.length - 1];
        const queryParamsObj = new URLSearchParams(queryParams);
        const postURLParamsObj = new URLSearchParams(postURLParams);
        const params = new URLSearchParams();
        const addKeyValuePairCb = (value, key) => {
            if (key.startsWith(THOUGHTSPOT_PARAM_PREFIX)) {
                params.append(key, value);
            }
        };
        queryParamsObj.forEach(addKeyValuePairCb);
        postURLParamsObj.forEach(addKeyValuePairCb);
        let tsParams = params.toString();
        tsParams = tsParams ? `?${tsParams}` : '';
        return tsParams;
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
        return this.renderIFrame(iframeSrc, this.viewConfig.frameParams);
    }
    // @override
    on(messageType, callback, options = { start: false }) {
        const eventType = this.getCompatibleEventType(messageType);
        return super.on(eventType, callback, options);
    }
}

/**
 * Copyright (c) 2022
 *
 * Full application embedding
 * https://developers.thoughtspot.com/docs/?pageid=full-embed
 *
 * @summary Full app embed
 * @module
 * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
 */
/**
 * Pages within the ThoughtSpot app that can be embedded.
 */
// eslint-disable-next-line no-shadow
var Page;
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
     * Liveboards listing page
     */
    Page["Liveboards"] = "liveboards";
    /**
     * @hidden
     */
    Page["Pinboards"] = "pinboards";
    /**
     * Data management page
     */
    Page["Data"] = "data";
    /**
     * SpotIQ listing page
     */
    Page["SpotIQ"] = "spotiq";
})(Page || (Page = {}));
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
     * embedded Liveboard or visualization.
     */
    getEmbedParams() {
        const params = this.getBaseQueryParams();
        const { tag, hideObjects, liveboardV2 } = this.viewConfig;
        if (tag) {
            params[Param.Tag] = tag;
        }
        if (hideObjects && hideObjects.length) {
            params[Param.HideObjects] = JSON.stringify(hideObjects);
        }
        if (liveboardV2 !== undefined) {
            params[Param.LiveboardV2Enabled] = liveboardV2;
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
        let url = `${this.getV1EmbedBasePath(queryString, this.viewConfig.showPrimaryNavbar, this.viewConfig.disableProfileAndHelp, true, this.viewConfig.enableSearchAssist)}/${pageId}`;
        const tsPostHashParams = this.getThoughtSpotPostUrlParams();
        url = `${url}${tsPostHashParams}`;
        return url;
    }
    /**
     * Gets the ThoughtSpot route of the page for a particular page ID.
     * @param pageId The identifier for a page in the ThoughtSpot app.
     */
    getPageRoute(pageId) {
        switch (pageId) {
            case Page.Search:
                return 'answer';
            case Page.Answers:
                return 'answers';
            case Page.Liveboards:
                return 'pinboards';
            case Page.Pinboards:
                return 'pinboards';
            case Page.Data:
                return 'data/tables';
            case Page.SpotIQ:
                return 'insights/results';
            case Page.Home:
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
     * Navigate to particular page for app embed. eg:answers/pinboards/home
     * This is used for embedding answers, pinboards, visualizations and full application only.
     * @param path string | number The string, set to iframe src and navigate to new page
     * eg: appEmbed.navigateToPage('pinboards')
     * When used with `noReload` this can also be a number like 1/-1 to go forward/back.
     * @param noReload boolean Trigger the navigation without reloading the page
     * @version SDK: 1.12.0 | ThoughtSpot: 8.4.0.cl, 8.4.1-sw
     */
    navigateToPage(path, noReload = false) {
        if (!this.iFrame) {
            console.log('Please call render before invoking this method');
            return;
        }
        if (noReload) {
            this.trigger(HostEvent.Navigate, path);
        }
        else {
            if (typeof path !== 'string') {
                console.warn('Path can only by a string when triggered without noReload');
                return;
            }
            const iframeSrc = this.iFrame.src;
            const embedPath = '#/embed';
            const currentPath = iframeSrc.includes(embedPath) ? embedPath : '#';
            this.iFrame.src = `${iframeSrc.split(currentPath)[0]}${currentPath}/${path.replace(/^\/?#?\//, '')}`;
        }
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
 * Copyright (c) 2022
 *
 * Embed a ThoughtSpot Liveboard or visualization
 * https://developers.thoughtspot.com/docs/?pageid=embed-pinboard
 * https://developers.thoughtspot.com/docs/?pageid=embed-a-viz
 *
 * @summary Liveboard & visualization embed
 * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
 */
/**
 * Embed a ThoughtSpot Liveboard or visualization
 * @Category Liveboards and Charts
 */
class LiveboardEmbed extends V1Embed {
    // eslint-disable-next-line no-useless-constructor
    constructor(domSelector, viewConfig) {
        super(domSelector, viewConfig);
        this.defaultHeight = 500;
        /**
         * Set the iframe height as per the computed height received
         * from the ThoughtSpot app.
         * @param data The event payload
         */
        this.updateIFrameHeight = (data) => {
            this.setIFrameHeight(Math.max(data.data, this.defaultHeight));
        };
        this.embedIframeCenter = (data, responder) => {
            const obj = this.getIframeCenter();
            responder({ type: EmbedEvent.EmbedIframeCenter, data: obj });
        };
        this.setIframeHeightForNonEmbedLiveboard = (data) => {
            if (!data.data.currentPath.startsWith('/embed/viz/')) {
                this.setIFrameHeight(this.defaultHeight);
            }
        };
    }
    /**
     * Construct a map of params to be passed on to the
     * embedded Liveboard or visualization.
     */
    getEmbedParams() {
        const params = this.getBaseQueryParams();
        const { enableVizTransformations, fullHeight, defaultHeight, visibleVizs, liveboardV2, vizId, activeTabId, } = this.viewConfig;
        const preventLiveboardFilterRemoval = this.viewConfig.preventLiveboardFilterRemoval ||
            this.viewConfig.preventPinboardFilterRemoval;
        if (fullHeight === true) {
            params[Param.fullHeight] = true;
        }
        if (defaultHeight) {
            this.defaultHeight = defaultHeight;
        }
        if (enableVizTransformations !== undefined) {
            params[Param.EnableVizTransformations] = enableVizTransformations.toString();
        }
        if (preventLiveboardFilterRemoval) {
            params[Param.preventLiveboardFilterRemoval] = true;
        }
        if (visibleVizs) {
            params[Param.visibleVizs] = visibleVizs;
        }
        params[Param.livedBoardEmbed] = true;
        if (vizId) {
            params[Param.vizEmbed] = true;
        }
        if (liveboardV2 !== undefined) {
            params[Param.LiveboardV2Enabled] = liveboardV2;
        }
        const queryParams = getQueryParamString(params, true);
        return queryParams;
    }
    /**
     * Construct the URL of the embedded ThoughtSpot Liveboard or visualization
     * to be loaded within the iframe.
     * @param liveboardId The GUID of the Liveboard.
     * @param vizId The optional GUID of a visualization within the Liveboard.
     * @param runtimeFilters A list of runtime filters to be applied to
     * the Liveboard or visualization on load.
     */
    getIFrameSrc(liveboardId, vizId, runtimeFilters, activeTabId) {
        const filterQuery = getFilterQuery(runtimeFilters || []);
        const queryParams = this.getEmbedParams();
        const queryString = [filterQuery, queryParams]
            .filter(Boolean)
            .join('&');
        let url = `${this.getV1EmbedBasePath(queryString, true, false, false)}/viz/${liveboardId}`;
        if (activeTabId) {
            url = `${url}/tab/${activeTabId}`;
        }
        if (vizId) {
            url = `${url}/${vizId}`;
        }
        const tsPostHashParams = this.getThoughtSpotPostUrlParams();
        url = `${url}${tsPostHashParams}`;
        return url;
    }
    /**
     * Triggers an event to the embedded app
     * @param messageType The event type
     * @param data The payload to send with the message
     */
    trigger(messageType, data = {}) {
        const dataWithVizId = data;
        if (this.viewConfig.vizId) {
            dataWithVizId.vizId = this.viewConfig.vizId;
        }
        return super.trigger(messageType, dataWithVizId);
    }
    /**
     * Render an embedded ThoughtSpot Liveboard or visualization
     * @param renderOptions An object specifying the Liveboard ID,
     * visualization ID and the runtime filters.
     */
    render() {
        var _a;
        const { vizId, activeTabId, runtimeFilters } = this.viewConfig;
        const liveboardId = (_a = this.viewConfig.liveboardId) !== null && _a !== void 0 ? _a : this.viewConfig.pinboardId;
        if (!liveboardId) {
            this.handleError(ERROR_MESSAGE.LIVEBOARD_VIZ_ID_VALIDATION);
        }
        if (this.viewConfig.fullHeight === true) {
            this.on(EmbedEvent.RouteChange, this.setIframeHeightForNonEmbedLiveboard);
            this.on(EmbedEvent.EmbedHeight, this.updateIFrameHeight);
            this.on(EmbedEvent.EmbedIframeCenter, this.embedIframeCenter);
        }
        super.render();
        const src = this.getIFrameSrc(liveboardId, vizId, runtimeFilters, activeTabId);
        this.renderV1Embed(src);
        return this;
    }
}
/**
 * @hidden
 */
class PinboardEmbed extends LiveboardEmbed {
}

/**
 * Copyright (c) 2022
 *
 * Embed ThoughtSpot search or a saved answer
 *
 * @summary Search embed
 * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
 */
const HiddenActionItemByDefaultForSearchEmbed = [
    Action.EditACopy,
    Action.SaveAsView,
    Action.UpdateTML,
    Action.EditTML,
    Action.AnswerDelete,
];
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
        let dataSourceMode = DataSourceVisualMode.Expanded;
        if (this.viewConfig.collapseDataSources === true) {
            dataSourceMode = DataSourceVisualMode.Collapsed;
        }
        if (this.viewConfig.hideDataSources === true) {
            dataSourceMode = DataSourceVisualMode.Hidden;
        }
        return dataSourceMode;
    }
    /**
     * Construct the URL of the embedded ThoughtSpot search to be
     * loaded in the iframe
     * @param answerId The GUID of a saved answer
     * @param dataSources A list of data source GUIDs
     */
    getIFrameSrc(answerId, dataSources) {
        var _a;
        const { hideResults, expandAllDataSource, enableSearchAssist, forceTable, searchOptions, runtimeFilters, } = this.viewConfig;
        const answerPath = answerId ? `saved-answer/${answerId}` : 'answer';
        const queryParams = this.getBaseQueryParams();
        queryParams[Param.HideActions] = [
            ...((_a = queryParams[Param.HideActions]) !== null && _a !== void 0 ? _a : []),
            ...HiddenActionItemByDefaultForSearchEmbed,
        ];
        if (dataSources && dataSources.length) {
            queryParams[Param.DataSources] = JSON.stringify(dataSources);
        }
        if (searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.searchTokenString) {
            queryParams[Param.searchTokenString] = encodeURIComponent(searchOptions.searchTokenString);
            if (searchOptions.executeSearch) {
                queryParams[Param.executeSearch] = true;
            }
        }
        if (enableSearchAssist) {
            queryParams[Param.EnableSearchAssist] = true;
        }
        if (hideResults) {
            queryParams[Param.HideResult] = true;
        }
        if (forceTable) {
            queryParams[Param.ForceTable] = true;
        }
        queryParams[Param.DataSourceMode] = this.getDataSourceMode();
        queryParams[Param.UseLastSelectedDataSource] = false;
        queryParams[Param.searchEmbed] = true;
        let query = '';
        const queryParamsString = getQueryParamString(queryParams, true);
        if (queryParamsString) {
            query = `?${queryParamsString}`;
        }
        const filterQuery = getFilterQuery(runtimeFilters || []);
        if (filterQuery) {
            query += `&${filterQuery}`;
        }
        const tsPostHashParams = this.getThoughtSpotPostUrlParams();
        return `${this.getEmbedBasePath(query)}/${answerPath}${tsPostHashParams}`;
    }
    /**
     * Render the embedded ThoughtSpot search
     */
    render() {
        super.render();
        const { answerId, dataSources } = this.viewConfig;
        const src = this.getIFrameSrc(answerId, dataSources);
        this.renderIFrame(src, this.viewConfig.frameParams);
        getAuthPromise().then(() => {
            if (checkReleaseVersionInBeta(getReleaseVersion(), getEmbedConfig().suppressSearchEmbedBetaWarning)) {
                alert(ERROR_MESSAGE.SEARCHEMBED_BETA_WRANING_MESSAGE);
            }
        });
        return this;
    }
}

/**
 * Embed ThoughtSpot search bar
 *
 * @Category Search Embed
 * @version: SDK: 1.18.0 | ThoughtSpot: 8.10.0.cl, 9.0.1-sw
 */
class SearchBarEmbed extends TsEmbed {
    constructor(domSelector, viewConfig) {
        super(domSelector);
        this.viewConfig = viewConfig;
    }
    /**
     * Construct the URL of the embedded ThoughtSpot search to be
     * loaded in the iframe
     * @param dataSources A list of data source GUIDs
     */
    getIFrameSrc(dataSources) {
        var _a;
        const { searchOptions } = this.viewConfig;
        const path = 'search-bar-embed';
        const queryParams = this.getBaseQueryParams();
        queryParams[Param.HideActions] = [
            ...((_a = queryParams[Param.HideActions]) !== null && _a !== void 0 ? _a : []),
        ];
        if (dataSources && dataSources.length) {
            queryParams[Param.DataSources] = JSON.stringify(dataSources);
        }
        if (searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.searchTokenString) {
            queryParams[Param.searchTokenString] = encodeURIComponent(searchOptions.searchTokenString);
            if (searchOptions.executeSearch) {
                queryParams[Param.executeSearch] = true;
            }
        }
        queryParams[Param.UseLastSelectedDataSource] = false;
        queryParams[Param.searchEmbed] = true;
        let query = '';
        const queryParamsString = getQueryParamString(queryParams, true);
        if (queryParamsString) {
            query = `?${queryParamsString}`;
        }
        const tsPostHashParams = this.getThoughtSpotPostUrlParams();
        return `${this.getEmbedBasePath(query)}/${path}${tsPostHashParams}`;
    }
    /**
     * Render the embedded ThoughtSpot search
     */
    render() {
        super.render();
        const { dataSources } = this.viewConfig;
        const src = this.getIFrameSrc(dataSources);
        this.renderIFrame(src, this.viewConfig.frameParams);
        return this;
    }
}

export { Action, AppEmbed, AuthFailureType, AuthStatus, AuthType, DataSourceVisualMode, EmbedEvent, HostEvent, LiveboardEmbed, Page, PinboardEmbed, PrefetchFeatures, RuntimeFilterOp, SearchBarEmbed, SearchEmbed, init, logout$1 as logout, prefetch };
