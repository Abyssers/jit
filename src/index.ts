import { existsSync } from "node:fs";
import { isAbsolute } from "node:path";
import { spawnSync, SpawnSyncReturns } from "node:child_process";
import { NOT_ABSOLUTE, NOT_DEFINED, NOT_EXIST, NOT_STRING } from "./errmsg";

function assert(condition: boolean, message: string): void;
function assert(condition: () => boolean, message: string): void;
function assert(condition: (err: (message: string) => void) => void): void;
function assert(
    condition: boolean | (() => boolean) | ((err: (message: string) => void) => void),
    message?: string
): void {
    if (message !== undefined) {
        if (typeof condition === "function") {
            condition = (condition as () => boolean)();
        }
        if (!condition && typeof message === "string") {
            throw new Error(message);
        }
    } else {
        if (typeof condition === "function") {
            condition((message: string) => {
                throw new Error(message);
            });
        }
    }
}

function git(...args: string[]): SpawnSyncReturns<string> {
    const { cwd } = this || { cwd: __dirname };
    return spawnSync(
        "git",
        Array.prototype.flat
            .call(args, Infinity)
            .filter((arg: string) => typeof arg === "string")
            .map((arg: string) => arg.trim()),
        { ...(cwd ? { cwd } : {}), encoding: "utf8" }
    );
}

class Jit {
    #repos: Map<string, Repo>;

    constructor() {
        assert(err => {
            const { status, stderr } = git("-v");
            if (status !== 0) err(stderr);
        });

        this.#repos = new Map();
    }

    repo(path: string): Repo {
        assert(path !== undefined, NOT_DEFINED("path"));
        assert(!!path, NOT_STRING("path"));
        if (this.#repos.has(path)) {
            return this.#repos.get(path);
        } else {
            const repo = new Repo(path);
            this.#repos.set(path, repo);
            return repo;
        }
    }
}

class Repo {
    #root: string;
    #cwd: string;

    constructor(root: string) {
        assert(root !== undefined, NOT_DEFINED("root"));
        assert(typeof root === "string", NOT_STRING("root"));
        assert(isAbsolute(root), NOT_ABSOLUTE(root));
        assert(existsSync(root), NOT_EXIST(root));
        assert(err => {
            const { status, stderr } = git.call({ cwd: this.#cwd }, "status");
            if (status !== 0) err(stderr);
        });

        this.#root = root;
        this.#cwd = root;
    }

    log(...args: string[]): SpawnSyncReturns<string> {
        return git.call({ cwd: this.#cwd }, "log", ...args);
    }
}

export default new Jit();
