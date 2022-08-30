import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { SpawnSyncReturns } from "node:child_process";
import { git, NullCommand, GitCommand } from "./git";
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
            const { status, stderr } = git({ cwd: this.#cwd }, "status");
            if (status !== 0) err(stderr);
        });

        this.#root = root;
        this.#cwd = root;
    }

    cd(...paths: string[]): Repo {
        assert(
            Array.prototype.every.call(paths, (path: string) => typeof path === "string"),
            JEMG.notStrs("paths")
        );
        this.#cwd = resolve(this.#cwd, ...paths);
        return this;
    }

    do(command: NullCommand | GitCommand, ...args: string[]): SpawnSyncReturns<string> {
        assert(command !== undefined, JEMG.notDefined("command"));
        assert(typeof command === "string", JEMG.notStr("command"));
        assert(
            Array.prototype.every.call(args, (arg: string) => typeof arg === "string"),
            JEMG.notStrs("args")
        );
        return git({ cwd: this.#cwd }, command, ...args);
    }
}
