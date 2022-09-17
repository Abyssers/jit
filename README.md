# Jit

<p align="left">
  <a><img src="https://img.shields.io/github/license/Abyssers/jit"></a>
  <a><img src="https://img.shields.io/github/workflow/status/Abyssers/jit/publish"></a>
  <a><img src="https://img.shields.io/github/issues/Abyssers/jit"></a>
  <a><img src="https://img.shields.io/github/forks/Abyssers/jit"></a>
  <a><img src="https://img.shields.io/github/stars/Abyssers/jit"></a>
</p>

A lightweight nodejs-client of Git.

## Quick Start

Install:

```sh
npm install @abysser/jit
```

Import:

```js
const { jit } = require("@abysser/jit");
```

## Usage

Create or index a Repo object:

```js
const repo = jit.repo(/* absolute path of a local repository */);
```

Get basic infos of the repo:

```js
console.log(repo.root);
console.log(repo.cwd);
console.log(repo.branch);
console.log(repo.head);
```

Run the git command:

```js
repo.do("log", ["--oneline"]);
```

Transfer parameters by replacing \<xxx\>:

```js
repo.do("log", ["--pretty=fuller", "--", "<path>"], "src/index.ts");
```

> do(command: NullCommand | GitCommand, args: GitArg[] | GitCommandArg[] = [], ...params: string[]): Pick<SpawnSyncReturns<string>, "pid" | "stdout"> & { formatted?: ReturnType\<Formatter\> }

Switch the current working directory:

```js
repo.cd("src/routes");
```

> cd(...paths: string[]): Repo

Called in a chain:

```js
repo.cd("src").cd("../").do("add", ["--all"]);
```

## License

[MIT](./LICENSE)

Copyright 2022 Abyssers