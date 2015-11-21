import assert from "assert";

import { plugins as pluginsReducer } from "../src/reducers.js";
import { togglePlugin } from "../src/actions.js";

describe("Plugins reducer", () => {
    it("should toggle plugins on", () => {
        const state = [
            {
                active: false,
            },
            {
                active: false,
            },
        ];

        const newState = pluginsReducer(state, togglePlugin(0));
        assert.equal(true, newState[0].active);
    });

    it("should toggle plugins off", () => {
        const state = [
            {
                active: false,
            },
            {
                active: true,
            },
        ];

        const newState = pluginsReducer(state, togglePlugin(1));
        assert.equal(false, newState[1].active);
    });

    it("should only allow one active plugin at a time", () => {
        const state = [
            {
                active: false,
            },
            {
                active: true,
            },
            {
                active: false,
            },
        ];

        const newState = pluginsReducer(state, togglePlugin(0));

        // The first should be toggled on, with the second changing to false
        assert.equal(true, newState[0].active);
        assert.equal(false, newState[1].active);
        assert.equal(false, newState[2].active);
    });
});
