import React from "react";
import { connect } from "react-redux";

import Toolbar from "./Toolbar";

import { toggleExpanded, togglePlugin } from "../actions";

const App = ({ dispatch, toolbar }) => {
    const handlePluginToggle = (i) => {
        dispatch(togglePlugin(i));
    };

    const handleExpandToggle = () => {
        dispatch(toggleExpanded());
    };

    return <Toolbar
        {...toolbar}
        onExpandToggle={handleExpandToggle}
        onPluginToggle={handlePluginToggle}
    />;
};

// Connect the App component with the entire global state
export default connect(x => x)(App);
