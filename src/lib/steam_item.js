'use strict';

var Util = require('./util.js');
var ObjectAssign = require('./object_assign.js');

var ITEM_PROPS = [
    'id', 'appid', 'contextid', 'amount', 'name',
    'type', 'tradable', 'classid', 'icon_url', 'market_hash_name',
    'original_id'
];

var LISTING_TAG_COUNT_MAX = 32;
var LISTING_TAG_LENGTH_MAX = 128;

function inspectUrl(item) {
    // Find inspect_url
    if (Util.notNull(item.inspect_url)) {
        return item.inspect_url;
    }

    if (item.actions && item.actions.length > 0) {
        for (var i = 0; i < item.actions.length; i++) {
            var action = item.actions[i];
            if (action.name && action.name.indexOf('Inspect') == 0) {
                return action.link;
            }
        }
    }

    return null;
}

// item is returned from https://api.steampowered.com/IEconItems_730
function needsWearValue(item) {
    return Util.notNull(item) && Util.isNull(item.wear_value) &&
        (item.appid == '730') && Util.notNull(item.inspect_url) &&
        Util.notNull(item.name) && Util.notNull(item.market_hash_name) && (item.name !== item.market_hash_name);
}

function tradeHold(item) {
    if (!item.tradable) {
        var ownerDescriptions = item.owner_descriptions;
        if (Util.isArray(ownerDescriptions)) {
            for (var i = 0; i < ownerDescriptions.length; i++) {
                var desc = ownerDescriptions[i].value;
                if (Util.isString(desc)) {
                    let match = desc.match(/^Tradable after: \[date\](\d+)\[\/date\]\.$/);
                    if (Util.notNull(match)) {
                        var timestamp = Util.parseInt(match[1]);
                        if (timestamp > 0) {
                            return Util.epochToIsoString(timestamp)
                        }
                    }
                }
            }
        }
    }

    return null;
}

function itemProps(item) {
    var props = Util.copyProps(item, ITEM_PROPS);

    // Owner Steam ID
    props.owner_steamid = item.owner || item.owner_steamid;

    // Icon URL, larger one is preferred
    props.icon_url = item.icon_url_large || item.icon_url;

    // Set inspect_url
    var inspect_url = inspectUrl(item);
    if (Util.notNull(inspect_url)) {
        props.inspect_url = inspect_url;
    }

    var trade_hold = tradeHold(item);
    if (Util.notNull(trade_hold)) {
        props.held_until = trade_hold;
    }

    var wearValue = item.wear_value;
    if (Util.notNull(wearValue)) {
        props.wear_value = wearValue;
    }

    var float = item.float;
    if (Util.notNull(float)) {
        props.float = float;
    }

    return props;
}

// Canonical tag
function canonicalTag(s) {
    return Util.isNull(s) ? s : s.replace(/\s+/g, ' ').trim().slice(0, LISTING_TAG_LENGTH_MAX);
}

module.exports = {
    listing: function (item, steamProperties) {
        steamProperties = ObjectAssign({}, steamProperties, itemProps(item));

        // Description
        var description = [];

        if (Util.isArray(item.fraudwarnings)) {
            description = description.concat(item.fraudwarnings);
        }

        if (item.descriptions) {
            description = description.concat(item.descriptions.map(function(d) {
                //console.log('  d =', JSON.stringify(d, null, 2));

                var value = d.value;
                if (!value) {
                    return null;
                }

                // Check sticker
                if (value.indexOf('id="sticker_info"') > 0) {
                    steamProperties.sticker = value;
                    return null;
                }
                else if (item.appid == 570 && value.indexOf('<div style=') >= 0) { // sticker for Dota2
                    steamProperties.sticker = value.replace(/color: rgb\(255, 255, 255\)/g, 'color: rgb(55, 55, 55)');
                    return null;
                }

                var v = Util.stripHtml(value).trim();
                if (v == '')  return null;

                //console.log("  v="+v);
                return v;
            }));
        }

        // Deal with tags
        let tags = [];
        if (Util.isArray(item.tags)) {
            tags = item.tags.map(function(t) { return t.category_name ? t.category_name+": "+t.name : t.name; });
            description.push(tags.join(', '));
        }

        if (item.market_hash_name) {
            tags.unshift('market_hash_name: ' + item.market_hash_name);
        }
        if (item.name) {
            tags.unshift('name: ' + item.name);
        }

        // Make tags confirm to listing limits
        tags = tags.map(function (t) {
            return canonicalTag(t);
        }).filter(function (t) {
            return Util.notEmpty(t);
        }).slice(0, LISTING_TAG_COUNT_MAX);

        description = description.filter(function(x) { return Util.notEmpty(x); }).join("\n\n");
        return {
            name: item.market_hash_name || item.market_name || item.name,
            description: Util.notEmpty(description) ? description : '.',
            tags: tags,
            steam_properties: steamProperties
        };
    },

    properties: itemProps,
    inspectUrl: inspectUrl,
    needsWearValue: needsWearValue,
    canonicalTag: canonicalTag,

    fungible: function (item) {
        return item.name == (item.market_hash_name || item.market_name);
    },

    // Return tradeHold release time, if any
    tradeHold: tradeHold
};
