'use strict';

const Chai = require('chai');
const expect = Chai.expect;

const SteamItem = require('../../index.js');

const ITEM = {
    id: "8795563285",
    owner: "76561198277655553",
    amount: 1,
    classid: "1690096482",
    instanceid: "0",
    icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFYynaSdJGhE74y0wNWIw_OlNuvXkDpSuZQmi--SrN-h3gey-Uo6YWmlIoCLMlhplhFFvwI",
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
    it("Item Hash", function() {
        expect(SteamItem.hash(ITEM)).to.equal('730|Chroma 3 Case|ffb03e0da64dafb8e02dc3baf7478a1ef80421591caa61f22494517d376a9493');
    });

    it("Listing", function() {
        expect(SteamItem.listing(ITEM)).to.deep.equal({
            name: "Chroma 3 Case",
            description: "Container Series #141\n\nContains one of the following:\n\nDual Berettas | Ventilators\n\nG3SG1 | Orange Crash\n\nor an Exceedingly Rare Special Item!\n\nType: Container, Collection: The Chroma 3 Collection, Category: Normal, Quality: Base Grade",
            steam_properties: {
                id: "8795563285",
                appid: "730",
                classid: "1690096482",
                contextid: "2",
                amount: 1,
                name: "Chroma 3 Case",
                market_hash_name: "Chroma 3 Case",
                type: "Base Grade Container",
                icon_url: "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFYynaSdJGhE74y0wNWIw_OlNuvXkDpSuZQmi--SrN-h3gey-Uo6YWmlIoCLMlhplhFFvwI"
            }
        });
    });
});
