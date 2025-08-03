<h3 align="center" >
  <div>
    <a href="https://github.com/nickesc/input-terminal"><img alt="Source: Github" src="https://img.shields.io/badge/source-github-brightgreen?style=for-the-badge&logo=github&labelColor=%23505050"></a>
    <a href="https://github.com/nickesc/input-terminal/actions/workflows/ts-tests.yml"><img alt="Tests: github.com/nickesc/input-terminal/actions/workflows/ts-tests.yml" src="https://img.shields.io/github/actions/workflow/status/nickesc/input-terminal/ts-tests.yml?logo=github&label=tests&logoColor=white&style=for-the-badge&labelColor=%23505050"></a>
    <br>
    <a href="https://www.npmjs.com/package/input-terminal"><img alt="NPM: npmjs.com/package/input-terminal" src="https://img.shields.io/npm/v/input-terminal?style=for-the-badge&logo=npm&logoColor=white&label=npm&color=%23C12127&labelColor=%23505050"></a>
  </div>
  <br>
  <img src="docs/icon.svg" width="128">
  <h3 align="center">
    <code>input-terminal</code>
  </h3>
  <h6 align="center">
    by <a href="https://nickesc.github.io">N. Escobar</a> / <a href="https://github.com/nickesc">nickesc</a>
  </h6>
  <h6 align="center">
    Turn any <code>HTMLInputElement</code> into a terminal interface
  </h6>
</h3>

<br>

## About `input-terminal`

`input-terminal` allows you to turn any `HTMLInputElement` into a terminal interface. Define custom commands that can be executed by users, track command history, autocomplete commands, and more.

## Install

Install `input-terminal` via NPM:

```sh
npm i input-terminal
```

Import the `Terminal` and `Command` classes in your TypeScript or JavaScript file:

```ts
import { Terminal, Command } from "input-terminal";
```

## Basic Usage

The example below demonstrates how to instantiate a new `Terminal`, create a new `Command`, and add it to the `Terminal`'s command list.

```ts
import { Terminal, Command } from "input-terminal";

// Get the input element from your HTML
const input = document.getElementById("terminal") as HTMLInputElement;

// Create a new terminal instance
const terminal = new Terminal(input);

// Create and add a command
const say = new Command("say", (args, options, terminal) => {
    alert(args[1] ?? "nothing");
});
terminal.commands.add(say);

// Initialize the terminal
terminal.init();
```

## Reference

For full documentation of the module and its methods, please see the [Documentation](https://nickesc.github.io/input-terminal).

## License

`input-terminal` is released under the **MIT** license. For more information, see the repository's [LICENSE](/LICENSE) file.

<a href="https://github.com/nickesc/input-terminal/blob/main/LICENSE"><img class="badge-img" alt="GitHub License" src="https://img.shields.io/github/license/nickesc/input-terminal?style=for-the-badge&labelColor=%23333&color=%230070ff"></a>
