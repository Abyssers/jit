import { spawnSync, SpawnSyncReturns } from "node:child_process";

export function git(...args: string[]): SpawnSyncReturns<string> {
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
