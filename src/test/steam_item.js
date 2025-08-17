'use strict';

const Chai = require('chai');
const expect = Chai.expect;

const SteamItem = require('../lib/steam_item.js');

const ITEM = {
    id: "8795563285",
    owner: "76561198277655553",
    amount: 1,
    classid: "1690096482",
    instanceid: "0",
    icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFYynaSdJGhE74y0wNWIw_OlNuvXkDpSuZQmi--SrN-h3gey-Uo6YWmlIoCLMlhplhFFvwI",
    icon_url_large: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0DFSua4xJ2DAgs7KRFav4WpKhVn1r2aJGQX7ou0kdjbz6L1ZL-ClTsG6sEpjLvE8Y2i21Lm_kdpZG-lJ4KUbEZgNkYNvyBp",
    icon_drag_url: "",
    name: "Chroma 3 Case",
    market_hash_name: "Chroma 3 Case",
    market_name: "Chroma 3 Case",
    name_color: "D2D2D2",
    background_color: "",
    type: "Base Grade Container",
    tradable: true,
    marketable: 1,
    commodity: 1,
    market_tradable_restriction: 7,
    market_marketable_restriction: 7,
    actions: [{
      link: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175",
      name : "Inspect in Game..."
    }],
    descriptions: [{
        type: "html",
        value: " "
    }, {
        type: "html",
        value: "Container Series #141",
        color: "99ccff"
    }, {
        type: "html",
        value: " "
    }, {
        type: "html",
        value: "Contains one of the following:"
    }, {
        type: "html",
        value: "Dual Berettas | Ventilators",
        color: "4b69ff"
    }, {
        type: "html",
        value: "G3SG1 | Orange Crash",
        color: "4b69ff"
    }, {
        type: "html",
        value: "or an Exceedingly Rare Special Item!",
        color: "ffd700"
    }, {
        type: "html",
        value: " "
    }, {
        type: "html",
        value: "",
        color: "00a000",
        app_data: {
            limited: 1
        }
    }],
    owner_descriptions: "",
    tags: [{
        category: "Type",
        internal_name: "CSGO_Type_WeaponCase",
        localized_category_name: "Type",
        localized_tag_name: "Container"
    }, {
        category: "ItemSet",
        internal_name: "set_community_12",
        localized_category_name: "Collection",
        localized_tag_name: "The Chroma 3 Collection"
    }, {
        category: "Quality",
        internal_name: "normal",
        localized_category_name: "Category",
        localized_tag_name: "Normal"
    }, {
        category: "Rarity",
        internal_name: "Rarity_Common",
        localized_category_name: "Quality",
        localized_tag_name: "Base Grade",
        color: "b0c3d9"
    }],
    pos: 1,
    assetid: "8795563285",
    new_assetid: "42039711787",
    appid: 730,
    contextid: 2,
    new_contextid: 3,
    is_stackable: false
};

describe("Steam Item", function() {
    it("Properties", function() {
        expect(SteamItem.properties(ITEM)).to.deep.equal({
            id: "8795563285",
            owner_steamid: "76561198277655553",
            appid: "730",
            classid: "1690096482",
            assetid: "8795563285",
            new_assetid: "42039711787",
            contextid: "2",
            new_contextid: "3",
            amount: 1,
            name: "Chroma 3 Case",
            market_hash_name: "Chroma 3 Case",
            type: "Base Grade Container",
            tradable: true,
            market_tradable_restriction: 7,
            icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0DFSua4xJ2DAgs7KRFav4WpKhVn1r2aJGQX7ou0kdjbz6L1ZL-ClTsG6sEpjLvE8Y2i21Lm_kdpZG-lJ4KUbEZgNkYNvyBp",
            inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
        });
    });

    it("Fungible", function() {
        expect(SteamItem.fungible(ITEM)).to.be.true;
    });

    it("Trade Hold", function() {
        expect(SteamItem.tradeHold(ITEM)).to.be.null;

        // DOTA 2
        expect(SteamItem.tradeHold(Object.assign({}, ITEM, {
            tradable: false,
            owner_descriptions: [
                {
                    "value": "\nOn Trade Cooldown Until: Tue Jun  9 15:03:54 2020"
                }
            ]
        }))).to.equal('2020-06-09T22:03:54.000Z');

        expect(SteamItem.tradeHold(Object.assign({}, ITEM, {
            tradable: false,
            owner_descriptions: [
                {
                    "type": "html",
                    "value": "Tradable After XXXXX",
                    "color": "ff4040"
                }
            ]
        })).substring(0,10)).to.equal((new Date(Date.now() + (7*24*60*60*1000))).toISOString().substring(0,10));

        expect(() => {
            SteamItem.tradeHold(Object.assign({}, ITEM, {
                tradable: false,
                owner_descriptions: [
                    {
                        "type": "html",
                        "value": "Tradable After-",
                        "color": "ff4040"
                    }
                ]
            }))
        }).to.throw("Failed to parse: Tradable After-");
    });

    it("Inspect Url", function() {
        expect(SteamItem.inspectUrl(ITEM)).to.equal("steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175");
    });

    it("needsItemInfo", function() {
        const item = {
            id: "8795563285",
            appid: "730",
            name: "Sword",
            market_hash_name: "Sword (Field-Tested)",
            inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
        };

        expect(SteamItem.needsItemInfo(item)).to.be.true;

        // name and market_hashname are the same
        expect(SteamItem.needsItemInfo(Object.assign({}, item, {
            name: "Chroma 3 Case",
            market_hash_name: "Chroma 3 Case",
        }))).to.be.false;

        // appid != '730'
        expect(SteamItem.needsItemInfo(Object.assign({}, item, {
            appid: "123"
        }))).to.be.false;

        // appid != '730'
        expect(SteamItem.needsItemInfo(Object.assign({}, item, {
            appid: "123"
        }))).to.be.false;

        // inspect_url null or missing
        expect(SteamItem.needsItemInfo(Object.assign({}, item, {
            inspect_url: null
        }))).to.be.false;
    });

    it("Canonical Tag", function () {
        expect(SteamItem.canonicalTag(" market_hash_name: M4A1-S  |  Flashback (Field-Tested)\n\r")).to.equal('market_hash_name: M4A1-S | Flashback (Field-Tested)');
    });

    it("Listing", function() {
        expect(SteamItem.listing(ITEM)).to.deep.equal({
            name: "Chroma 3 Case",
            description: "Container Series #141\n\nContains one of the following:\n\nDual Berettas | Ventilators\n\nG3SG1 | Orange Crash\n\nor an Exceedingly Rare Special Item!\n\nType: Container, Collection: The Chroma 3 Collection, Category: Normal, Quality: Base Grade",
            tags: [
                "name: Chroma 3 Case",
                "market_hash_name: Chroma 3 Case",
                "Type: Container",
                "Collection: The Chroma 3 Collection",
                "Category: Normal",
                "Quality: Base Grade"
            ],
            steam_properties: {
                id: "8795563285",
                owner_steamid: "76561198277655553",
                appid: "730",
                assetid: "8795563285",
                classid: "1690096482",
                contextid: "2",
                amount: 1,
                name: "Chroma 3 Case",
                market_hash_name: "Chroma 3 Case",
                new_assetid: "42039711787",
                new_contextid: "3",
                type: "Base Grade Container",
                tradable: true,
                market_tradable_restriction: 7,
                icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0DFSua4xJ2DAgs7KRFav4WpKhVn1r2aJGQX7ou0kdjbz6L1ZL-ClTsG6sEpjLvE8Y2i21Lm_kdpZG-lJ4KUbEZgNkYNvyBp",
                inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
            }
        });

        // Test held_until
        expect(SteamItem.listing(Object.assign({}, ITEM, {
            tradable: false,
            owner_descriptions: [
                {
                    "type": "",
                    "value": "Tradable after: [date]1492642800[/date].",
                    "color": "FF0000"
                }
            ]
        }))).to.deep.equal({
            name: "Chroma 3 Case",
            description: "Container Series #141\n\nContains one of the following:\n\nDual Berettas | Ventilators\n\nG3SG1 | Orange Crash\n\nor an Exceedingly Rare Special Item!\n\nType: Container, Collection: The Chroma 3 Collection, Category: Normal, Quality: Base Grade",
            tags: [
                "name: Chroma 3 Case",
                "market_hash_name: Chroma 3 Case",
                "Type: Container",
                "Collection: The Chroma 3 Collection",
                "Category: Normal",
                "Quality: Base Grade"
            ],
            steam_properties: {
                id: "8795563285",
                owner_steamid: "76561198277655553",
                appid: "730",
                assetid: "8795563285",
                classid: "1690096482",
                contextid: "2",
                amount: 1,
                name: "Chroma 3 Case",
                market_hash_name: "Chroma 3 Case",
                new_assetid: "42039711787",
                new_contextid: "3",
                type: "Base Grade Container",
                tradable: false,
                market_tradable_restriction: 7,
                held_until: "2017-04-19T23:00:00.000Z",
                icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0DFSua4xJ2DAgs7KRFav4WpKhVn1r2aJGQX7ou0kdjbz6L1ZL-ClTsG6sEpjLvE8Y2i21Lm_kdpZG-lJ4KUbEZgNkYNvyBp",
                inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
            }
        });

        // Test empty string for icon_url
        expect(SteamItem.listing(Object.assign({}, ITEM, {
            tradable: false,
            icon_url: "",
            icon_url_large: ""
        }))).to.deep.equal({
            name: "Chroma 3 Case",
            description: "Container Series #141\n\nContains one of the following:\n\nDual Berettas | Ventilators\n\nG3SG1 | Orange Crash\n\nor an Exceedingly Rare Special Item!\n\nType: Container, Collection: The Chroma 3 Collection, Category: Normal, Quality: Base Grade",
            tags: [
                "name: Chroma 3 Case",
                "market_hash_name: Chroma 3 Case",
                "Type: Container",
                "Collection: The Chroma 3 Collection",
                "Category: Normal",
                "Quality: Base Grade"
            ],
            steam_properties: {
                id: "8795563285",
                owner_steamid: "76561198277655553",
                appid: "730",
                assetid: "8795563285",
                classid: "1690096482",
                contextid: "2",
                amount: 1,
                name: "Chroma 3 Case",
                market_hash_name: "Chroma 3 Case",
                new_assetid: "42039711787",
                new_contextid: "3",
                type: "Base Grade Container",
                tradable: false,
                market_tradable_restriction: 7,
                inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
            }
        });
    });
});
