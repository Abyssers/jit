import { SpawnSyncReturns } from "node:child_process";
import { GitArg, GitCommandArg } from "./arg";

export interface Formatter {
    (stdout: SpawnSyncReturns<string>["stdout"], args: GitArg[] | GitCommandArg[], ...params: string[]):
        | { [key: string]: any }
        | { [key: string]: any }[];
}

export const formatters: { [key: string]: Formatter } = {
    log: (
        stdout: SpawnSyncReturns<string>["stdout"],
        args: GitArg[] | GitCommandArg[] = [],
        ...params: string[]
    ): ReturnType<Formatter> => {
        let formatted: { [key: string]: any } | { [key: string]: any }[];
        if (args.length === 0 || Array.prototype.includes.call(args, "--pretty=medium")) {
            formatted = stdout
                .split("commit ")
                .filter(item => item !== "")
                .map(text => {
                    const [name, email] = /Author: \S+ <\S+@\S+\.\S+>/
                        .exec(text)[0]
                        .replace(/(Author: |<|>)/g, "")
                        .split(" ");
                    return {
                        hash: /[a-z0-9]+/.exec(text)[0],
                        author: { name, email },
                        authorDate: new Date(/Date: {3}.+/.exec(text)[0].replace(/Date: {3}/, "")),
                        titleLine: /\n{2} {4}.+/.exec(text)[0].replace(/\n{2} {4}/, ""),
                    };
                });
        }
        return formatted;
    },
};
