import { combineReducers } from "redux";
import { TOGGLE_PLUGIN } from "./actions";

import LandmarksPlugin from "../plugins/landmarks.js";

function expanded(state = false) {
    // TODO: Respond to actions here to change the state
    return state;
}

const initialPluginsState = [
    {
        plugin: LandmarksPlugin,
        active: false,
    },
];
function plugins(state = initialPluginsState, action) {
    switch (action.type) {
        case TOGGLE_PLUGIN:
            return [
                ...state.slice(0, action.index),
                {
                    ...state[action.index],

                    // Toggle the active state
                    active: !state[action.index].active,
                },
                ...state.slice(action.index + 1),
            ];
        default:
            return state;
    }
}

const toolbar = combineReducers({ expanded, plugins });
const tota11yReducer = combineReducers({ toolbar });

export default tota11yReducer;
