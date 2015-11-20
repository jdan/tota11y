import React from "react";
import { StyleSheet, css } from "../../vendor/aphrodite";

import Plugin from "./Plugin.js";

const Toolbar = ({ onPluginToggle, plugins }) => {
    return <div className={css(styles.toolbar)}>
        {plugins.map(({plugin, active}, i) =>
            <Plugin
                key={i}
                plugin={plugin}
                active={active}
                onToggle={() => onPluginToggle(i)}
            />)}
    </div>;
};
Toolbar.propTypes = {
    plugins: React.PropTypes.arrayOf(React.PropTypes.shape({
        plugin: Plugin.propTypes.plugin,
        active: Plugin.propTypes.bool,
    })).isRequired,
    onPluginToggle: React.PropTypes.func.isRequired,
    expanded: React.PropTypes.bool.isRequired,
    // TODO: onExpandToggle
};

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: "#333",
        color: "#fff",
        height: 400,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        position: "fixed",
        bottom: 0,
        left: 10,
    },
});

export default Toolbar;
