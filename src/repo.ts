import { existsSync } from "node:fs";
import { isAbsolute } from "node:path";
import { SpawnSyncReturns } from "node:child_process";
import { git } from "./git";
import { assert, JitErrorMessageGenerator as JEMG } from "./error";

export class Repo {
    #root: string;
    #cwd: string;

    constructor(root: string) {
        assert(root !== undefined, JEMG.notDefined("root"));
        assert(typeof root === "string", JEMG.notStr("root"));
        assert(isAbsolute(root), JEMG.notAbsolute(root));
        assert(existsSync(root), JEMG.notExist(root));
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
