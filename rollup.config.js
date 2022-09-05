const json = require("@rollup/plugin-json");
const eslint = require("@rollup/plugin-eslint");
const typescript = require("@rollup/plugin-typescript");
const strip = require("@rollup/plugin-strip");

module.exports = {
    input: "src/index.js",
    output: {
        dir: "dist/index.js",
        format: "cjs",
    },
    plugins: [json(), eslint(), typescript(), strip()],
};
