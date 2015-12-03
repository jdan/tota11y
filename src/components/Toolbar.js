import React from "react";
import { StyleSheet, css } from "../../vendor/aphrodite";

import Logo from "./Logo.js";
import Plugin from "./Plugin.js";

const Toolbar = ({ expanded, onExpandToggle, onPluginToggle, plugins }) => {
    const pluginList = plugins.map(({plugin, active}, i) => {
        return <Plugin
            key={i}
            plugin={plugin}
            active={active}
            onToggle={() => onPluginToggle(i)}
        />;
    });

    const toolbarId = "tota11y-toolbar";
    return <div
        id={toolbarId}
        className={css(styles.toolbar)}
        role="region"
        aria-expanded={expanded}
    >
        <div className={css(styles.plugins, expanded && styles.expanded)}>
            {pluginList}
        </div>

        <button
            className={css(styles.toggle)}
            onClick={onExpandToggle}
            aria-label="[tota11y] Toggle menu"
            aria-controls={toolbarId}
        >
            <div aria-hidden="true">
                <Logo
                    width={styleConstants.collapsedWidth}
                    height={styleConstants.collapsedHeight}
                />
            </div>
        </button>
    </div>;
};
Toolbar.propTypes = {
    plugins: React.PropTypes.arrayOf(React.PropTypes.shape({
        plugin: Plugin.propTypes.plugin,
        active: Plugin.propTypes.bool,
    })).isRequired,
    onPluginToggle: React.PropTypes.func.isRequired,

    expanded: React.PropTypes.bool.isRequired,
    onExpandToggle: React.PropTypes.func.isRequired,
};

const styleConstants = {
    background: "#333",
    foreground: "#fff",
    marginLeft: 10,
    togglePadding: 7,
    collapsedWidth: 35,
    collapsedHeight: 25,
};

const styles = StyleSheet.create({
    toolbar: {
        background: styleConstants.background,
        color: styleConstants.foreground,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        bottom: 0,
        left: styleConstants.marginLeft,
        overflow: "hidden",
        position: "fixed",
    },

    plugins: {
        display: "none",
    },

    expanded: {
        display: "block",
    },

    toggle: {
        background: styleConstants.background,
        border: "none",
        display: "block",
        padding: styleConstants.togglePadding,
        width: "100%",
    },
});

export default Toolbar;
