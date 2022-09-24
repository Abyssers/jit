import { GitReturns } from "./git";
import { GitCommandArg } from "./arg";

export interface Formatter {
    (stdout: GitReturns["stdout"], args: GitReturns["args"], ...params: string[]):
        | { [key: string]: any }
        | { [key: string]: any }[];
}

export const formatters: { [key: string]: Formatter } = {
    log: (stdout: GitReturns["stdout"], args: GitReturns["args"] = []): ReturnType<Formatter> => {
        let formatted: { [key: string]: any } | { [key: string]: any }[];
        try {
            if (
                (args as GitCommandArg[]).includes("--oneline") ||
                (args as GitCommandArg[]).includes("--pretty=oneline")
            ) {
                // ...
            } else if ((args as GitCommandArg[]).includes("--pretty=reference")) {
                // ...
            } else if ((args as string[]).some(arg => /^--pretty=format:%\w+$/g.test(arg))) {
                for (let i = args.length - 1; i >= 0; i--) {
                    if (/^--pretty=format:%([HhTt]|[ac][nNeElLdDrtiIsh])$/g.test(args[i])) {
                        formatted = stdout.split("\n").filter(item => item !== "");
                        break;
                    }
                }
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
                                      committerDate: new Date(
                                          /CommitDate: +.+/.exec(text)[0].replace(/CommitDate: +/, "")
                                      ),
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
            // eslint-disable-next-line no-empty
        } catch (err) {}
        return formatted;
    },
    shortlog: (stdout: GitReturns["stdout"], args: GitReturns["args"] = []): ReturnType<Formatter> => {
        let formatted: { [key: string]: any } | { [key: string]: any }[];
        try {
            if (
                (args as string[]).some(arg => /^-(n|-numbered|e|-email|ne|en)$/.test(arg)) &&
                !(args as string[]).every(arg => /^-(s|-summary)$/.test(arg))
            ) {
                formatted = stdout.match(/\S+ (<\S+@\S+\.\S+> )?\(\d+\):\n( {6}[^\n]+\n)+\n/g).map(group => ({
                    name: /^\S+ /.exec(group)[0].trim(),
                    ...(/ <\S+@\S+\.\S+> /.test(group)
                        ? { email: / <\S+@\S+\.\S+> /.exec(group)[0].trim().replace(/[<>]/g, "") }
                        : {}),
                    commits: group.match(/ {6}[^\n]+\n/g).map(c => c.trim()),
                }));
            } else if ((args as string[]).some(arg => /^-(s(n|e|ne|en)?|(n|e|ne|en)s|(esn|nse)|-summary)$/.test(arg))) {
                formatted = stdout.match(/ *\d+\t\S+( <\S+@\S+\.\S+>)?\n/g).map(group => ({
                    name: /\t\S+/.exec(group)[0].trim(),
                    ...(/ <\S+@\S+\.\S+>\n/.test(group)
                        ? { email: / <\S+@\S+\.\S+>\n/.exec(group)[0].trim().replace(/[<>]/g, "") }
                        : {}),
                    summary: Number(/^ *\d+\t/.exec(group)[0].trim()),
                }));
            }
            // eslint-disable-next-line no-empty
        } catch (err) {}
        return formatted;
    },
    diff: (stdout: GitReturns["stdout"], args: GitReturns["args"] = []): ReturnType<Formatter> => {
        let formatted: { [key: string]: any } | { [key: string]: any }[];
        try {
            if ((args as GitCommandArg[]).includes("--name-only")) {
                formatted = stdout.split("\n").filter(name => name !== "");
            }
            // eslint-disable-next-line no-empty
        } catch (err) {}
        return formatted;
    },
};
