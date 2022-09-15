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
        if ((args as GitCommandArg[]).includes("--oneline") || (args as GitCommandArg[]).includes("--pretty=oneline")) {
            // ...
        } else if ((args as GitCommandArg[]).includes("--pretty=reference")) {
            // ...
        } else {
            formatted = ("\n" + stdout)
                .split("\ncommit ")
                .filter(item => item !== "")
                .map(text => {
                    const commit = {
                        hash: /[a-z0-9]+/.exec(text)[0],
                        titleLine: /\n{2} {4}[^\n]+/.exec(text)[0].replace(/\n{2} {4}/, ""),
                        ...(/\nMerge: [a-z0-9]+ [a-z0-9]+\n/.test(text)
                            ? {
                                  merge: /Merge: [a-z0-9]+ [a-z0-9]+/
                                      .exec(text)[0]
                                      .replace(/Merge: /, "")
                                      .split(" "),
                              }
                            : {}),
                        ...(/\n(Author)?Date: +.+\n/.test(text)
                            ? {
                                  authorDate: new Date(
                                      /(Author)?Date: +.+/.exec(text)[0].replace(/(Author)?Date: +/, "")
                                  ),
                              }
                            : {}),
                        ...(/\nCommitDate: +.+\n/.test(text)
                            ? {
                                  committerDate: new Date(/CommitDate: +.+/.exec(text)[0].replace(/CommitDate: +/, "")),
                              }
                            : {}),
                    };
                    if (/\nAuthor: +\S+ <\S+@\S+\.\S+>\n/.test(text)) {
                        const [name, email] = /Author: +\S+ <\S+@\S+\.\S+>/
                            .exec(text)[0]
                            .replace(/(Author: +|<|>)/g, "")
                            .split(" ");
                        Object.assign(commit, { author: { name, email } });
                    }
                    if (/\nCommit: +\S+ <\S+@\S+\.\S+>\n/.test(text)) {
                        const [name, email] = /Commit: +\S+ <\S+@\S+\.\S+>/
                            .exec(text)[0]
                            .replace(/(Commit: +|<|>)/g, "")
                            .split(" ");
                        Object.assign(commit, { committer: { name, email } });
                    }
                    return commit;
                });
        }
        return formatted;
    },
};
