import { isAbsolute, resolve } from "node:path";
import { Repo } from "./repo";
import { git } from "./git";
import { assert, errmsgs } from "./error";

class Jit {
    static #instance: Jit = undefined;
    static instance(): Jit {
        if (this.#instance === undefined) {
            this.#instance = new Jit();
        }
        return this.#instance;
    }

    #repos: Map<string, Repo>;

    constructor() {
        assert(err => {
            const { status, stderr } = git({ cwd: __dirname }, "", ["-v"]);
            if (status !== 0) err(stderr);
        });

        this.#repos = new Map();
    }

    get version(): string {
        const { status, stdout, stderr } = git({ cwd: __dirname }, "", ["-v"]);
        assert(status === 0, stderr);
        return /(\d+.)*\d+/i.exec(stdout)[0];
    }

    repo(path: string): Repo {
        assert(path !== undefined, errmsgs.notDefined("path"));
        assert(typeof path === "string", errmsgs.notStr("path"));
        assert(isAbsolute(path), errmsgs.notAbsolute(path));
        path = resolve(path);
        if (this.#repos.has(path)) {
            return this.#repos.get(path);
        } else {
            const repo = new Repo(path);
            this.#repos.set(path, repo);
            return repo;
        }
    }
}

export const jit: Jit = Jit.instance();
