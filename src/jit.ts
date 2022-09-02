import { isAbsolute, resolve } from "node:path";
import { Repo } from "./repo";
import { git } from "./git";
import { assert, JitErrorMessageGenerator as JEMG } from "./error";

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
            const { status, stderr } = git({ cwd: __dirname }, "", "-v");
            if (status !== 0) err(stderr);
        });

        this.#repos = new Map();
    }

    version(): string {
        const { status, stdout, stderr } = git({ cwd: __dirname }, "", "-v");
        assert(status === 0, stderr);
        return /(\d+.)*\d+/i.exec(stdout)[0];
    }

    repo(path: string): Repo {
        assert(path !== undefined, JEMG.notDefined("path"));
        assert(typeof path === "string", JEMG.notStr("path"));
        assert(isAbsolute(path), JEMG.notAbsolute(path));
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
