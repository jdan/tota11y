import React, { Component } from "react";
import { StyleSheet, css } from "../vendor/aphrodite";

class Toolbar extends Component {
    render() {
        return <div className={css(styles.toolbar)}>
            Hello, world!
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
        position: "fixed",
        bottom: 0,
        left: 20,

        width: 200,
        height: 400,
    },
});

export default Toolbar;
