import { existsSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { SpawnSyncReturns } from "node:child_process";
import { git, NullCommand, GitCommand } from "./git";
import { GitArg, GitCommandArg } from "./arg";
import { formatters, Formatter } from "./format";
import { assert, errmsgs } from "./error";

export class Repo {
    #root: string;
    #cwd: string;

    constructor(root: string) {
        assert(root !== undefined, errmsgs.notDefined("root"));
        assert(typeof root === "string", errmsgs.notStr("root"));
        assert(isAbsolute(root), errmsgs.notAbsolute(root));
        assert(existsSync(root), errmsgs.notExist(root));
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
        const { status, stdout, stderr } = git({ cwd: this.#cwd }, "branch", ["--show-current"]);
        assert(status === 0, stderr);
        return stdout.trim();
    }

    get head(): string {
        const { status, stdout, stderr } = git({ cwd: this.#cwd }, "rev-parse", ["HEAD"]);
        assert(status === 0, stderr);
        return stdout.trim();
    }

    cd(...paths: string[]): Repo {
        assert(
            Array.prototype.every.call(paths, (path: string) => typeof path === "string"),
            errmsgs.notStrs("paths")
        );
        const target = resolve(this.#cwd, ...paths);
        assert(
            !(relative(this.#root, target) === "" || relative(this.#root, target).startsWith("..")),
            errmsgs.outsideOfRoot(target)
        );
        this.#cwd = target;
        return this;
    }

    do(
        command: NullCommand | GitCommand,
        args: GitArg[] | GitCommandArg[] = [],
        ...params: string[]
    ): Pick<SpawnSyncReturns<string>, "pid" | "stdout"> & { formatted?: ReturnType<Formatter> } {
        assert(command !== undefined, errmsgs.notDefined("command"));
        assert(typeof command === "string", errmsgs.notStr("command"));
        assert(
            Array.prototype.every.call(args, (arg: GitArg | GitCommandArg) => typeof arg === "string"),
            errmsgs.notStrs("args")
        );
        assert(
            Array.prototype.every.call(params, (param: string) => typeof param === "string"),
            errmsgs.notStrs("params")
        );
        const { pid, status, stdout, stderr } = git({ cwd: this.#cwd }, command, args, ...params);
        assert(status === 0, stderr);
        return {
            pid,
            stdout,
            ...(Object.keys(formatters).length === 0 || !Object.prototype.hasOwnProperty.call(formatters, command)
                ? {}
                : {
                      formatted: formatters[command].call(null, stdout, args, ...params),
                  }),
        };
    }
}
