'use strict';

const Util = require('./util.js');

const ITEM_PROPS = [
    'id', 'appid', 'contextid', 'amount', 'name',
    'type', 'tradable', 'classid', 'icon_url', 'market_hash_name',
    'original_id'
];

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

function itemProps(item) {
    var props = Util.copyProps(item, ITEM_PROPS);

    // Owner Steam ID
    props.owner_steamid = item.owner || item.owner_steamid;

    // Icon URL, larger one is preferred
    props.icon_url = item.icon_url_large || item.icon_url;

    // Set inspect_url
    const inspect_url = inspectUrl(item);
    if (Util.notNull(inspect_url)) {
        props.inspect_url = inspect_url;
    }

    return props;
}

module.exports = {
    listing: function (item, steamProperties) {
        steamProperties = Object.assign(steamProperties || {}, itemProps(item));

        // Description
        var description = [];

        if (Util.isArray(item.fraudwarnings)) {
            description = description.concat(item.fraudwarnings);
        }

        if (item.descriptions) {
            description = description.concat(item.descriptions.map(function(d) {
                //console.log('  d =', JSON.stringify(d, null, 2));

                const value = d.value;
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

        if (Util.isArray(item.tags)) {
            description.push(item.tags.map(function(t) { return t.category_name ? t.category_name+": "+t.name : t.name; }).join(', ')); 
        }

        return {
            name: item.market_hash_name || item.market_name || item.name,
            description: description.filter(function(x) { return Util.notEmpty(x); }).join("\n\n"),
            steam_properties: steamProperties
        };
    },

    properties: itemProps,

    inspectUrl: inspectUrl,

    fungible: function (item) {
        return item.name == (item.market_hash_name || item.market_name);
    }
};
