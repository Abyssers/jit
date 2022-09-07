import { spawnSync, SpawnSyncOptions, SpawnSyncOptionsWithStringEncoding, SpawnSyncReturns } from "node:child_process";
import { GitArg, GitCommandArg } from "./arg";

type MainPorcelainCommand =
    | "add"
    | "am"
    | "archive"
    | "bisect"
    | "branch"
    | "bundle"
    | "checkout"
    | "cherry-pick"
    | "citool"
    | "clean"
    | "clone"
    | "commit"
    | "describe"
    | "diff"
    | "fetch"
    | "format-patch"
    | "gc"
    | "gitk"
    | "grep"
    | "gui"
    | "init"
    | "log"
    | "maintenance"
    | "merge"
    | "mv"
    | "notes"
    | "pull"
    | "push"
    | "range-diff"
    | "rebase"
    | "reset"
    | "restore"
    | "revert"
    | "rm"
    | "shortlog"
    | "show"
    | "sparse-checkout"
    | "stash"
    | "status"
    | "submodule"
    | "switch"
    | "tag"
    | "worktree";

type AncillaryCommand =
    | "config"
    | "fast-export"
    | "fast-import"
    | "filter-branch"
    | "mergetool"
    | "pack-refs"
    | "prune"
    | "reflog"
    | "remote"
    | "repack"
    | "replace"
    | "annotate"
    | "blame"
    | "bugreport"
    | "count-objects"
    | "difftool"
    | "fsck"
    | "gitweb"
    | "help"
    | "instaweb"
    | "merge-tree"
    | "rerere"
    | "show-branch"
    | "verify-commit"
    | "verify-tag"
    | "whatchanged";

type InteractingCommand =
    | "archimport"
    | "cvsexportcommit"
    | "cvsimport"
    | "cvsserver"
    | "imap-send"
    | "p4"
    | "quiltimport"
    | "request-pull"
    | "send-email"
    | "svn";

type LowLevelCommand =
    | "apply"
    | "checkout-index"
    | "commit-graph"
    | "commit-tree"
    | "hash-object"
    | "index-pack"
    | "merge-file"
    | "merge-index"
    | "mktag"
    | "mktree"
    | "multi-pack-index"
    | "pack-objects"
    | "prune-packed"
    | "read-tree"
    | "symbolic-ref"
    | "unpack-objects"
    | "update-index"
    | "update-ref"
    | "write-tree"
    | "cat-file"
    | "cherry"
    | "diff-files"
    | "diff-index"
    | "diff-tree"
    | "for-each-ref"
    | "for-each-repo"
    | "get-tar-commit-id"
    | "ls-files"
    | "ls-remote"
    | "ls-tree"
    | "merge-base"
    | "name-rev"
    | "pack-redundant"
    | "rev-list"
    | "rev-parse"
    | "show-index"
    | "show-ref"
    | "unpack-file"
    | "var"
    | "verify-pack"
    | "daemon"
    | "fetch-pack"
    | "http-backend"
    | "send-pack"
    | "update-server-info"
    | "check-attr"
    | "check-ignore"
    | "check-mailmap"
    | "check-ref-format"
    | "column"
    | "credential"
    | "credential-cache"
    | "credential-store"
    | "fmt-merge-msg"
    | "hook"
    | "interpret-trailers"
    | "mailinfo"
    | "mailsplit"
    | "merge-one-file"
    | "patch-id"
    | "sh-i18n"
    | "sh-setup"
    | "stripspace";

export type NullCommand = "";
export type GitCommand = MainPorcelainCommand | AncillaryCommand | InteractingCommand | LowLevelCommand;

export function git(
    options: SpawnSyncOptions,
    command: NullCommand | GitCommand = "",
    args: GitArg[] | GitCommandArg[] = [],
    ...params: string[]
): SpawnSyncReturns<string> {
    options = Object.assign({ encoding: "utf8" }, options);
    params = Array.prototype.flat.call(params, Infinity).filter((param: string) => typeof param === "string");
    return spawnSync(
        "git",
        Array.prototype.flat
            .call(command === "" ? args : [command, ...args], Infinity)
            .filter((arg: GitArg | GitCommandArg) => typeof arg === "string")
            .map((arg: GitArg | GitCommandArg) => arg.trim().replace(/<\w+>/g, () => params.shift())),
        options as SpawnSyncOptionsWithStringEncoding
    );
}
