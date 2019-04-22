/* eslint-disable no-console */
/**
 * Pre-publish checks to verify that our publish will go smoothly.
 */
const path = require("path");
const {exec} = require("child_process");

const checkPublishConfig = (publishConfig) => {
    if (!publishConfig || publishConfig.access !== "public") {
        console.error("ERROR: Missing a \"publishConfig\": {\"access\": \"public\"} section.");
        process.exit(1);
    }
};

const checkNpmUser = (currentUser) => {
    if (currentUser.trim() !== "khanacademy") {
        console.error(
            "ERROR: You are not logged in to NPM as \"khanacademy\". " +
                "Run \"npm login\" and use the password from Keeper: " +
                "NPM Open Source (https://npmjs.org)"
        );
        process.exit(1);
    }
};

const pkgJson = require(path.join(__dirname, "..", "package.json"));
const {publishConfig} = pkgJson;

checkPublishConfig(publishConfig);
exec("npm whoami", (err, currentUser) => {
    checkNpmUser(currentUser);
});
