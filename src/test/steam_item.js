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
    tradable: 1,
    marketable: 1,
    commodity: 1,
    market_tradable_restriction: "7",
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
        internal_name: "CSGO_Type_WeaponCase",
        name: "Container",
        category: "Type",
        category_name: "Type"
    }, {
        internal_name: "set_community_12",
        name: "The Chroma 3 Collection",
        category: "ItemSet",
        category_name: "Collection"
    }, {
        internal_name: "normal",
        name: "Normal",
        category: "Quality",
        category_name: "Category"
    }, {
        internal_name: "Rarity_Common",
        name: "Base Grade",
        category: "Rarity",
        color: "b0c3d9",
        category_name: "Quality"
    }],
    pos: 1,
    appid: 730,
    contextid: 2,
    is_stackable: false
};

describe("Steam Item", function() {
    it("Properties", function() {
        expect(SteamItem.properties(ITEM)).to.deep.equal({
            id: "8795563285",
            owner_steamid: "76561198277655553",
            appid: "730",
            classid: "1690096482",
            contextid: "2",
            amount: 1,
            name: "Chroma 3 Case",
            market_hash_name: "Chroma 3 Case",
            type: "Base Grade Container",
            tradable: 1,
            icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0DFSua4xJ2DAgs7KRFav4WpKhVn1r2aJGQX7ou0kdjbz6L1ZL-ClTsG6sEpjLvE8Y2i21Lm_kdpZG-lJ4KUbEZgNkYNvyBp",
            inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
        });
    });

    it("Fungible", function() {
        expect(SteamItem.fungible(ITEM)).to.be.true;
    });

    it("Trade Hold", function() {
        expect(SteamItem.tradeHold(ITEM)).to.be.null;

        expect(SteamItem.tradeHold(Object.assign({}, ITEM, {
            tradable: 0,
            owner_descriptions: [
                {
                    "type": "",
                    "value": "Tradable after: [date]1492642800[/date].",
                    "color": "FF0000"
                }
            ]
        }))).to.equal('2017-04-19T23:00:00.000Z');
    });

    it("Inspect Url", function() {
        expect(SteamItem.inspectUrl(ITEM)).to.equal("steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175");
    });

    it("needsWearValue", function() {
        const item = {
            id: "8795563285",
            appid: "730",
            name: "Sword",
            market_hash_name: "Sword (Field-Tested)",
            inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
        };

        expect(SteamItem.needsWearValue(item)).to.be.true;

        // name and market_hashname are the same
        expect(SteamItem.needsWearValue(Object.assign({}, item, {
            name: "Chroma 3 Case",
            market_hash_name: "Chroma 3 Case",
        }))).to.be.false;

        // appid != '730'
        expect(SteamItem.needsWearValue(Object.assign({}, item, {
            appid: "123"
        }))).to.be.false;

        // appid != '730'
        expect(SteamItem.needsWearValue(Object.assign({}, item, {
            appid: "123"
        }))).to.be.false;

        // inspect_url null or missing
        expect(SteamItem.needsWearValue(Object.assign({}, item, {
            inspect_url: null
        }))).to.be.false;
    });

    it("Listing Safe Tag", function () {
        expect(SteamItem.listingSafeTag('market_hash_name: M4A1-S | Flashback (Field-Tested) ')).to.equal('market_hash_name: M4A1S Flashback FieldTested');
    });

    it("Listing", function() {
        expect(SteamItem.listing(ITEM)).to.deep.equal({
            name: "Chroma 3 Case",
            description: "Container Series #141\n\nContains one of the following:\n\nDual Berettas | Ventilators\n\nG3SG1 | Orange Crash\n\nor an Exceedingly Rare Special Item!\n\nType: Container, Collection: The Chroma 3 Collection, Category: Normal, Quality: Base Grade",
            tags: [
                "market_name: Chroma 3 Case",
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
                classid: "1690096482",
                contextid: "2",
                amount: 1,
                name: "Chroma 3 Case",
                market_hash_name: "Chroma 3 Case",
                type: "Base Grade Container",
                tradable: 1,
                icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0DFSua4xJ2DAgs7KRFav4WpKhVn1r2aJGQX7ou0kdjbz6L1ZL-ClTsG6sEpjLvE8Y2i21Lm_kdpZG-lJ4KUbEZgNkYNvyBp",
                inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
            }
        });

        expect(SteamItem.listing(Object.assign({}, ITEM, {
            tradable: 0,
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
                "market_name: Chroma 3 Case",
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
                classid: "1690096482",
                contextid: "2",
                amount: 1,
                name: "Chroma 3 Case",
                market_hash_name: "Chroma 3 Case",
                type: "Base Grade Container",
                tradable: 0,
                held_until: "2017-04-19T23:00:00.000Z",
                icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0DFSua4xJ2DAgs7KRFav4WpKhVn1r2aJGQX7ou0kdjbz6L1ZL-ClTsG6sEpjLvE8Y2i21Lm_kdpZG-lJ4KUbEZgNkYNvyBp",
                inspect_url: "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D633534240071254175"
            }
        });
    });
});
