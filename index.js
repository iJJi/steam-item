'use strict';

const Sha = require('sha.js');
const Util = require('./src/lib/util.js');

const ITEM_PROPS = [
    'id', 'appid', 'contextid', 'amount', 'name',
    'type', 'tradeable', 'classid', 'icon_url', 'market_hash_name'
];

function itemProps(item) {
    return Util.copyProps(item, ITEM_PROPS);
}

module.exports = {
    listing: function (item, steamProperties = null) {
        steamProperties = Object.assign(steamProperties || {}, itemProps(item));

        // Description
        let description = [];

        if (Util.isArray(item.fraudwarnings)) {
            description = description.concat(item.fraudwarnings);
        }

        if (item.descriptions) {
            description = description.concat(item.descriptions.map(d => {
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

                let v = Util.stripHtml(value).trim();
                if (v == '')  return null;

                //console.log(`  v='${v}'`);
                return v;
            }));
        }

        if (Util.isArray(item.tags)) {
            description.push(item.tags.map(t => t.category_name ? `${t.category_name}: ${t.name}` : t.name).join(', '));
        }

        return {
            name: item.market_hash_name || item.market_name || item.name,
            description: description.filter(x => Util.notEmpty(x)).join("\n\n"),
            steam_properties: steamProperties
        };
    },

    properties: itemProps,

    hash: function (item) {
        const sha256 = Sha('sha256');

        if (item.type) {
            sha256.update(item.type);
        }

        for (let t in item.tags) {
            sha256.update(`|${t.category_name || t.category}: ${t.internal_name || t.name}`);
        }

        return `${item.appid}|${item.market_hash_name || item.market_name || item.name}|${sha256.digest('hex')}`;
    }
};
