# Jit

<p align="left">
  <a><img src="https://img.shields.io/github/license/Abyssers/jit"></a>
  <a><img src="https://img.shields.io/github/workflow/status/Abyssers/jit/publishment"></a>
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

Running the git command:

```js
repo.do("log", "--oneline");
```

> do(command: "" | GitCommand, ...args: string[]): SpawnSyncReturns\<string\>

Switch the current working directory:

```js
repo.cd("src/routes");
```

> cd(...paths: string[]): Repo

Called in a chain:

```js
repo.cd("src").cd("../").do("add", "--all");
```

## License

[MIT](./LICENSE)

Copyright 2022 Abyssers