import React from "react";
import { render } from "react-dom";
import { compose, createStore } from "redux";
import { Provider } from "react-redux";
import { devTools } from "redux-devtools";
import { DevTools, DebugPanel, LogMonitor } from "redux-devtools/lib/react";

import Tota11y from "./src/components/App";
import tota11yReducer from "./src/reducers";

const finalCreateStore = compose(devTools())(createStore);
const store = finalCreateStore(tota11yReducer);

// Chrome Accessibility Developer Tools - required once as a global
require("script!./node_modules/accessibility-developer-tools/dist/js/axs_testing.js");

const root = document.createElement("div");
document.body.appendChild(root);

render(
    <div>
        <Provider store={store}>
            <Tota11y />
        </Provider>
        <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
    </div>,

    root
);
