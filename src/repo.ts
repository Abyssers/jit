import { existsSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
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
        const { status, stderr } = git({ cwd: this.#cwd }, "status");
        assert(status === 0, stderr);

        this.#root = root;
        this.#cwd = root;
    }

    get root(): string {
        return this.#root;
    }

    get cwd(): string {
        return this.#cwd;
    }

    get branch(): string {
        const { status, stdout, stderr } = git({ cwd: this.#cwd }, "branch", "--show-current");
        assert(status === 0, stderr);
        return stdout.trim();
    }

    cd(...paths: string[]): Repo {
        assert(
            Array.prototype.every.call(paths, (path: string) => typeof path === "string"),
            JEMG.notStrs("paths")
        );
        const target = resolve(this.#cwd, ...paths);
        assert(
            !(relative(this.#root, target) === "" || relative(this.#root, target).startsWith("..")),
            JEMG.outsideOfRoot(target)
        );
        this.#cwd = target;
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
