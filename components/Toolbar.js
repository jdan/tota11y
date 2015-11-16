import React, { Component } from "react";
import { StyleSheet, css } from "../vendor/aphrodite";

import Plugin from "./plugin";
import LandmarksPlugin from "../plugins/landmarks";

class Toolbar extends Component {
    constructor() {
        super();
        this.state = {
            active: false,
        };
    }

    handleToggle() {
        this.setState({
            active: !this.state.active,
        });
    }

    render() {
        return <div className={css(styles.toolbar)}>
            <Plugin
                plugin={new LandmarksPlugin()}
                active={this.state.active}
                handleToggle={() => this.handleToggle()}
            />
        </div>;
    }
}
Toolbar.propTypes = {
    plugins: React.PropTypes.array.isRequired,
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
