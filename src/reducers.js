import { combineReducers } from "redux";
import { TOGGLE_EXPANDED, TOGGLE_PLUGIN } from "./actions";

import AltTextPlugin from "../plugins/alt-text.js";
import LandmarksPlugin from "../plugins/landmarks.js";

function expanded(state = false, action) {
    return action.type === TOGGLE_EXPANDED ? !state : state;
}

const initialPluginsState = [
    {
        plugin: AltTextPlugin,
        active: false,
    },
    {
        plugin: LandmarksPlugin,
        active: false,
    },
];

// TODO: We can unit test this!
export function plugins(state = initialPluginsState, action) {
    switch (action.type) {
        case TOGGLE_PLUGIN:
            return state.map((plugin, i) => {
                return {
                    ...plugin,
                    // Toggle the plugin if it matches our action's index,
                    // otherwise set active to false as we can only have one
                    // active plugin at a time.
                    active: (action.index === i) ? !plugin.active : false,
                };
            });
        default:
            return state;
    }
}

const toolbar = combineReducers({ expanded, plugins });
const tota11yReducer = combineReducers({ toolbar });

export default tota11yReducer;
