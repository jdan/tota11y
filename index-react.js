import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import App from "./src/components/App";
import tota11yReducer from "./src/reducers";

const store = createStore(tota11yReducer, {});

const root = document.createElement("div");
document.body.appendChild(root);

render(
    <Provider store={store}>
        <App />
    </Provider>,

    root
);
