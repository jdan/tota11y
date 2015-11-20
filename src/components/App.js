import React from "react";
import { connect } from "react-redux";

import Toolbar from "./Toolbar";

import { togglePlugin } from "../actions";

const App = ({ dispatch, toolbar }) => {
    const handlePluginToggle = (i) => {
        dispatch(togglePlugin(i));
    };

    return <Toolbar
        {...toolbar}
        onPluginToggle={handlePluginToggle}
    />;
};

// Connect the App component with the entire global state
export default connect(x => x)(App);
