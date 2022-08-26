module.exports = (() => {
    const { existsSync } = require("node:fs");
    const { isAbsolute } = require("node:path");
    const { spawnSync } = require("node:child_process");

    const ERR_TYPES = {
        NOT_STRING: name => `"${name}" is not of type string`,
        NOT_DEFINED: name => `"${name}" is not defined.`,
        NOT_ABSOLUTE: path => `"${path}" is not an absolute path.`,
        NOT_EXIST: path => `"${path}" does not exist.`,
    };

    function assert(condition, message) {
        function err(message) {
            throw new Error(message);
        }

        if (message !== undefined) {
            if (typeof condition === "function") {
                condition = condition();
            }
            if (!condition && typeof message === "string") {
                err(message);
            }
        } else {
            if (typeof condition === "function") {
                condition(err);
            }
        }
    }

    function git(...args) {
        return spawnSync(
            "git",
            Array.prototype.flat
                .call(args, Infinity)
                .filter(arg => typeof arg === "string")
                .map(arg => arg.trim()),
            { encoding: "utf8" }
        );
    }

    return class Jit {
        /**
         * @param {string} rootPath The root path of a repository.
         */
        constructor(rootPath) {
            assert(rootPath !== undefined, ERR_TYPES.NOT_DEFINED("rootPath"));
            assert(typeof rootPath === "string", ERR_TYPES.NOT_STRING("rootPath"));
            assert(isAbsolute(rootPath), ERR_TYPES.NOT_ABSOLUTE(rootPath));
            assert(existsSync(rootPath), ERR_TYPES.NOT_EXIST(rootPath));
            assert(err => {
                const { status, stderr } = git("-v");
                if (status !== 0) err(stderr);
            });
            this.props = new Proxy(
                {
                    rootPath,
                },
                {
                    set: () => false,
                }
            );
        }
    };
})();
