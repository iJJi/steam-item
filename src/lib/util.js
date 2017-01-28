'use strict';

/**
 * Return random item from array
 * @returns random item
 */
Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
};

/**
 * Shuffles array (destructive).
 * @see https://github.com/coolaj86/knuth-shuffle
 * @returns {Array} self
 */
Array.prototype.shuffle = function () {
    let currentIndex = this.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }

    return this;
};

const HTML_TAG_REGEX = /(<([^>]+)>)/ig;

const Util = {
    SECOND:       1000,
    MINUTE:    60*1000,
    HOUR:   60*60*1000,
    DAY: 24*60*60*1000,

    /**
     * Random integer from [0..upperBoundExclusive)
     * @param upperBoundExclusive
     */
    randomInt: upperBoundExclusive => Math.floor(Math.random() * upperBoundExclusive),

    /**
     * If n is string, parse it
     * @param n either a number or string
     */
    parseInt: n => (typeof n == 'string') ? parseInt(n, 10) : n,

    /**
     * If n is string, parse it
     * @param n either a number or string
     */
    parseFloat: n => (typeof n == 'string') ? parseFloat(n) : n,

    /**
     * Parse query string and return map
     * @param url Steam Trade URL
     * @returns query parameters, such as {partner: 'xxxx', token: 'yyyy'}
     */
    parseQuery: url => {
        const Url = require('url');
        const parsedUrl = Url.parse(url, true);
        return parsedUrl.query
    },

    /**
     * True if parameter is defined and not null
     * @param x value to test
     * @return {boolean}
     */
    notNull: x => ((typeof x !== 'undefined') && (x !== null)),

    /**
     * True if parameter is defined, not null, and not empty string
     * @param x value to test
     * @return {boolean}
     */
    notEmpty: x => ((typeof x !== 'undefined') && (x !== null) && (x !== '')),

    /**
     * True if parameter is not defined or null
     * @param x value to test
     * @return {boolean}
     */
    isNull: x => ((typeof x === 'undefined') || (x === null)),

    /**
     * True if parameter is defined and value is true
     * @param x value to test
     * @return {boolean}
     */
    isTrue: x => ((typeof x !== 'undefined') && (x)),

    /**
     * True if parameter is undefined or value is false
     * @param x value to test
     * @return {boolean}
     */
    isFalse: x => !((typeof x === 'undefined') || (x)),

    /**
     * True if parameter is defined and is an array
     * @param x value to test
     * @return {boolean}
     */
    isArray: x => ((typeof x !== 'undefined') && Array.isArray(x)),

    /**
     * True if parameter is defined and is a string
     * @param x value to test
     * @return {boolean}
     */
    isString: x => (typeof x === 'string'),

    /**
     * Returns true if object m has property k
     * @param m object
     * @param k property to test
     */
    hasKey: (m, k) => ((typeof m !== 'undefined') && (m !== null) && (typeof m !== 'object') && (k in m)),

    /**
     * Returns first defined and non-null argument
     */
    options: function () {
        for (let i = 0; i < arguments.length; i++) {
            let x = arguments[i];
            if ((typeof x !== 'undefined') && (x !== null)) {
                return x;
            }
        }
        return null;
    },

    /**
     * Current time in RFC3339 ZULU format
     */
    now: function (offsetMS = 0) {
        return (new Date(Date.now() + offsetMS)).toISOString();
    },

    /**
     * Current time as UNIX timestamp
     */
    timestamp: function (offsetMS = 0) {
        return Math.floor((Date.now() + offsetMS)/1000);
    },

    // '2016-06-03T01:20:45.702Z' => 1464916845.702
    isoDateToEpoch: function(isoDate) {
        return Util.isNull(isoDate) ? null : Math.floor(Date.parse(isoDate) / 1000);
    },

    // Return unixTime as GMT time, such as '2016-07-29 09:35:48 GMT'
    isoStringToGMT: function(date) {
        return Util.isString(date) ? date.replace(/T/, ' ').replace(/:\d{2}\.\d{3}Z/, ' GMT') : '';
    },

    // Return unix time converted to RFC3339 ZULU format
    epochToIsoString: function(epoch) {
        return Util.isNull(epoch) ? 'unspecified' : (new Date(epoch * 1000)).toISOString();
    },

    seconds: function (timeInMillis) {
        return Math.floor(timeInMillis / 1000);
    },

    copyProps: function (map, keys) {
        const result = {};
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let v = map[k];
            if (Util.notEmpty(v)) {
                result[k] = (k === 'amount' || k === 'tradable') ? v : String(v);
            }
        }
        return result;
    },

    stripHtml: function (html) {
        return Util.isString(html) ? html.replace(HTML_TAG_REGEX, "") : "";
    },

    nextPage: function (req, qs) {
        const protocol = req.get('X-Forwarded-Proto') || req.protocol;
        let port = req.get('X-Forwarded-Port') || req.app.settings.port;

        // Don't specify port if it is the default port for the protocol
        if ((protocol === 'https' && port == '443') || (protocol === 'http' && port == '80')) {
            port = null;
        }

        const Url = require('url');

        return Url.format({
            hostname: req.get('X-Forwarded-Host') || req.hostname,
            protocol: protocol,
            port: port,
            pathname: req.baseUrl + req.path,
            query: qs
        });
    }
};

module.exports = Util;