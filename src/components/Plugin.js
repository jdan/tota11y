import React, { Component } from "react";
import { StyleSheet, css } from "../../vendor/aphrodite";

import legacyAnnotateFactory from "../../plugins/shared/annotate";

const Plugin = ({ plugin, active, onToggle }) => {
    const indicator = <div
        className={css(styles.indicator, active && styles.active)}
        aria-hidden="true"
    >
        &#x2713;
    </div>;

    return <div>
        <label className={css(styles.plugin)}>
            <div className={css(styles.control)}>
                <input
                    className={css(styles.checkbox)}
                    type="checkbox"
                    checked={active}
                    onChange={onToggle}
                />
                {indicator}
            </div>

            <div className={css(styles.info)}>
                <div className={css(styles.title)}>
                    {plugin.title}
                </div>
                <div className={css(styles.description)}>
                    {plugin.description}
                </div>
            </div>
        </label>

        {active &&
            <PluginRunner plugin={plugin} />
        }
    </div>;
};

Plugin.propTypes = {
    plugin: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        run: React.PropTypes.func.isRequired,
        cleanup: React.PropTypes.func,
    }).isRequired,

    active: React.PropTypes.bool.isRequired,
    onToggle: React.PropTypes.func.isRequired,
};

class PluginRunner extends Component {
    constructor(props) {
        super(props);
        this.annotate = legacyAnnotateFactory(props.plugin.title);
    }

    componentDidMount() {
        this.props.plugin.run(this.annotate);
    }

    componentWillUnmount() {
        if (this.props.plugin.cleanup) {
            this.props.plugin.cleanup();
        }
        this.annotate.removeAll();
    }

    render() {
        return null;
    }
}

PluginRunner.PropTypes = {
    plugin: Plugin.propTypes.plugin,
};

const constants = {
    indicatorSize: 16,
    indicatorFontSize: 13,
    lightBorderColor: "#999",
    darkBorderColor: "#555",
    kaGreen: "#639b24",
};

const styles = StyleSheet.create({
    plugin: {
        alignItems: "center",
        borderBottom: `1px solid ${constants.darkBorderColor}`,
        cursor: "pointer",
        display: "flex",
        fontWeight: 400,
        margin: 0,
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 0,

        // TODO: user-select mixin
        userSelect: "none",
        WebkitUserSelect: "none",
    },

    control: {
        margin: "0 15px",
    },

    // Typical "sr-only" class
    // TODO(jordan): We'll likely need this elsewhere
    checkbox: {
        border: 0,
        clip: "rect(0, 0, 0, 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: 1,
    },

    indicator: {
        borderRadius: constants.indicatorSize,
        border: `1px solid ${constants.lightBorderColor}`,
        boxSizing: "border-box",
        color: "transparent",
        fontSize: constants.indicatorFontSize,
        height: constants.indicatorSize,
        lineHeight: `${constants.indicatorSize}px`,
        padding: "0 0 0 1px",
        width: constants.indicatorSize,
    },

    active: {
        backgroundColor: constants.kaGreen,
        borderColor: constants.kaGreen,
        color: "white",
    },

    info: {
        lineHeight: 1.35,
    },

    title: {
        fontSize: 14,
        fontWeight: "bold",
    },

    description: {
        fontSize: 11,
        fontStyle: "italic",
        width: 200,
    },
});

export default Plugin;
