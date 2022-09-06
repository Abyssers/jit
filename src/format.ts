import { SpawnSyncReturns } from "node:child_process";

export interface Formatter {
    (stdout: SpawnSyncReturns<string>["stdout"], ...args: string[]): {
        [key: string]: any;
    };
}

export const formatters: { [key: string]: Formatter } = {
    log: (stdout: string, ...args: string[]): ReturnType<Formatter> => {
        /* ... */
        return {};
    },
};
