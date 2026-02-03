---
title: Usage
---

# Usage

This guide covers everything you need to know to use `input-terminal`, from basic setup to advanced features.

## Installation

Install via `npm`:

```bash
npm install input-terminal
```

Import in your project:

```typescript
import { Terminal, Command } from "input-terminal";
```

Or import specific components:

```typescript
import { 
  Terminal, 
  Command, 
  ExitObject, 
  TermBin, 
  TermHistory, 
  TermOptions, 
  TermOutput, 
  built_ins 
} from "input-terminal";
```

## Quick Start

### Minimal Setup

The simplest way to get started is with just an `<input>` element:

```html
<input type="text" id="terminal" />
```

Then, create a new `Terminal` instance targeting the element. This creates a functional terminal that can execute commands, though output will only be accessible programmatically or through event listeners.

```typescript
import { Terminal, Command } from "input-terminal";

const input = document.getElementById("terminal") as HTMLInputElement;
const terminal = new Terminal(input);

terminal.bin.add(new Command("hello", (args, options, terminal) => {
  terminal.stdout("Hello, World!");
  return { message: "Hello, World!" };
}));

terminal.init();
```

Call `terminal.init()` to attach input listeners and initialize the input as an terminal.

### With Output Element

If you want to render output to a DOM element, you can do so by passing the output element to the `Terminal` constructor:

```html
<input type="text" id="terminal" />
<pre id="output"></pre>
```

```typescript
const input = document.getElementById("terminal") as HTMLInputElement;
const output = document.getElementById("output") as HTMLElement;

const terminal = new Terminal(input, output);

terminal.init();
```

The terminal will render logs printed via `stdout` and `stderr` to the output element.

## Commands

### Basic Command Structure

A command consists of a key (the command name) and an action function:

```typescript
const greet = new Command("greet", (args, options, terminal) => {
  const name = args[0] || "World";
  terminal.stdout(`Hello, ${name}!`);
  return { greeted: name };
});
```

The action function receives three parameters:

- `args` - An array of positional arguments
- `options` - An object containing parsed options
- `terminal` - A reference to the `Terminal` instance

### Adding Commands

Add commands to the terminal's `bin`:

```typescript
// Add a single command
terminal.bin.add(greet);

// Add multiple commands at once
terminal.bin.add([command1, command2, command3]);
```

### Removing Commands

To remove a command from the `bin`:

```typescript
terminal.bin.remove(greet);
```

### Listing Commands

To get a list of all commands in the `bin`:

```typescript
const commands = terminal.bin.list;
// returns an array of all command objects in the bin

const commandKeys = terminal.bin.getCommandKeys();
// returns an array of all command key strings in the bin
// ["greet", "echo", "alert", ...]
```

### Adding Manual Pages

Commands can have documentation accessible via the `man` command. It can be set using the command's `manual` property:

```typescript
const greet = new Command("greet", (args, options, terminal) => {
  terminal.stdout(`Hello, ${args[0] || "World"}!`);
});

greet.manual = `greet [name]

Greets the specified name, or "World" if no name is provided.

Examples:
  greet           # outputs "Hello, World!"
  greet Alice     # outputs "Hello, Alice!"`;
```

### Custom Empty Command Handler

When the user presses <kbd>Enter</kbd> or executes a command with no input, the terminal's `emptyCommand` is executed:

```typescript
const customEmpty = new Command("", (args, options, terminal) => {
  terminal.stdout("Type 'help' for available commands");
  return {};
});

terminal.bin.emptyCommand = customEmpty;
```

### Programmatic Command Execution

Execute commands from code:

```typescript
const button = document.getElementById("button") as HTMLButtonElement;
button.addEventListener("click", () => {
  const result = terminal.executeCommand("echo Hello from code");
  console.log(result.exitCode);  // 0
});
```

### Autocomplete

Get command predictions programmatically:

```typescript
// All commands
const all = terminal.getPredictions();  // ["echo", "alert", ...]

// Filtered by prefix
const filtered = terminal.getPredictions("e");  // ["echo"]
```

Autocomplete also cycles through predictions when <kbd>Tab</kbd> is pressed from the input.

## Arguments and Options

### Positional Arguments

Arguments are space-separated values after the command name:

```bash
greet Alice Bob Charlie
```

In the command action, `args` will be `["Alice", "Bob", "Charlie"]`.

### Type Coercion

Arguments are automatically converted to appropriate types:

| Input | Resulting Type | Value |
|-------|---------------|-------|
| `hello` | `string` | `"hello"` |
| `42` | `number` | `42` |
| `3.14` | `number` | `3.14` |
| `true` | `boolean` | `true` |
| `false` | `boolean` | `false` |

### Options Formats

Options can be specified in several formats:

```bash
# Long form boolean flag
command --verbose

# Long form with value
command --name=Alice

# Short form boolean flag
command -v

# Short form with value
command -n=Alice

# Multiple short flags combined
command -abc    # equivalent to -a -b -c
```

> Note: To assign an option a value, you must use the `=` operator.

### Accessing Options

Options are available in the `options` parameter:

```typescript
const search = new Command("search", (args, options, terminal) => {
  const query = args.join(" ");
  const caseSensitive = options.case || options.c;
  const limit = options.limit?.value || 10;
  
  terminal.stdout(`Searching for "${query}" (limit: ${limit})`);
});
```

Options structure:

```typescript
{
  verbose: { value: undefined },      // --verbose or -v
  name: { value: "Alice" },           // --name=Alice
  count: { value: 5 }                 // --count=5 (number)
}
```

### Quote Handling

Use quotes to include spaces in arguments:

```bash
# Double quotes
echo "Hello World"

# Single quotes
echo 'Hello World'

# Backticks
echo `Hello World`

# Nested quotes
echo "She said 'Hello'"

# Escaped quotes
echo "He said \"Hello\""
```

## Configuration Options

Pass options to the `Terminal` constructor:

```typescript
const terminal = new Terminal(input, output, {
  prompt: ">> ",
  preprompt: "[user] ",
  previousKey: "ArrowUp",
  nextKey: "ArrowDown",
  returnKey: "Enter",
  autocompleteKey: "Tab",
  installBuiltins: true,
  addEmptyCommandToHistory: false,
  showDuplicateCommands: false
});
```

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prompt` | `string` | `"> "` | Text displayed at the start of the input |
| `preprompt` | `string` | `""` | Text displayed before the prompt |
| `previousKey` | `string` | `"ArrowUp"` | Key to navigate to previous command |
| `nextKey` | `string` | `"ArrowDown"` | Key to navigate to next command |
| `returnKey` | `string` | `"Enter"` | Key to execute command |
| `autocompleteKey` | `string` | `"Tab"` | Key to trigger autocomplete |
| `installBuiltins` | `boolean` | `true` | Whether to include built-in commands |
| `addEmptyCommandToHistory` | `boolean` | `false` | Whether empty commands are added to history |
| `showDuplicateCommands` | `boolean` | `false` | Whether to show duplicate commands when navigating history |

### Custom Options

You can also add custom properties to options:

```typescript
const terminal = new Terminal(input, output, {
  prompt: "> ",
  myCustomOption: "custom value"
});

// Access later
console.log(terminal.options.myCustomOption);
```

## Output System

### stdout and stderr

Use `terminal.stdout()` and `terminal.stderr()` to output data:

```typescript
const myCommand = new Command("test", (args, options, terminal) => {
  terminal.stdout("This is standard output");
  terminal.stderr("This is an error message");
  return { status: "done" };
});
```

### Output Rendering

When an output element is provided, `TermOutput` automatically renders output to the specified output element:

```typescript
const terminal = new Terminal(input, output);
terminal.init();

terminal.stdout("This is standard output");
```

Output is wrapped in `<span>` elements with CSS classes:

- `input-terminal-stdout` for stdout
- `input-terminal-stderr` for stderr

### Manual Output Control

You can manually control the output manager:

```typescript
// Detach output rendering
terminal.output.detach();

// Re-attach
terminal.output.attach();

// Clear output element
terminal.output.clear();

// Check if attached
if (terminal.output.attached) {
  // ...
}
```

### Output Without DOM Element

If no output element is provided, you can still use `stdout`/`stderr` via events:

```typescript
const terminal = new Terminal(input);

terminal.addEventListener("stdout", (e) => {
  console.log("stdout:", e.detail.data);
});

terminal.addEventListener("stderr", (e) => {
  console.error("stderr:", e.detail.data);
});

terminal.init();
```

## History Management

### Arrow Key Navigation

By default, use <kbd>ArrowUp</kbd> and <kbd>ArrowDown</kbd> to navigate through command history.

### Programmatic Access

To access the history programmatically, you can use the `history` object of the `Terminal` instance:

```typescript
// Get all history items
const items = terminal.history.items;

// Get the last executed command
const lastExit = terminal.getLastExitObject();

// Navigate programmatically
const prev = terminal.history.previous();
const next = terminal.history.next();
const current = terminal.history.current();

// Reset navigation position
terminal.history.resetIndex();
```

### Pre-populating History

If you want to pre-populate the history with a list of commands, you can do so by passing a list of `ExitObject`s to the terminal at creation:

```typescript
import { ExitObject, built_ins } from "input-terminal";

const historyItems = [
  new ExitObject(["echo", "test"], "echo test", built_ins.echo, 0, { output: "test" }),
  new ExitObject(["help"], "help", undefined, 1, { error: "Command not found" }),
];
let terminal = new Terminal(input, output, {}, historyItems);

```

### Modifying History

You can also add to, remove from, and replace the history programmatically using the `history.push`, `history.pop`, and `history.items` properties:

```typescript
// Add to history
terminal.history.push(exitObject);

// Remove most recent item
const removed = terminal.history.pop();

// Replace entire history
terminal.history.items = newHistoryArray;
```

### Accessing Input Value

To access the current input value from the terminal, you can use the `getInputValue` method:

```typescript
// Get user input without the prompt
const userInput = terminal.getInputValue();
```

To update the input value programmatically, you can use the `updateInput` method:

```typescript
// Update the input programmatically
terminal.updateInput("new value");
```

To get the full prompt from the terminal, you can use the `getFullPrompt` method:

```typescript
// Get the full prompt
const fullPrompt = terminal.getFullPrompt();  // e.g., "user@host $ "
```

## Event System

The Terminal extends `EventTarget` and dispatches custom events.

### Available Events

| Event | Dispatched When | Detail |
|-------|----------------|--------|
| `stdout` | `terminal.stdout()` is called | `{ data: any, timestamp: number }` |
| `stderr` | `terminal.stderr()` is called | `{ data: any, timestamp: number }` |
| `inputTerminalExecuted` | A command finishes executing | `ExitObject` |

### Listening to Events

You can listen to events from the terminal instance using the `addEventListener` method:

```typescript
terminal.addEventListener("inputTerminalExecuted", (e) => {
  const exitObject = e.detail;
  
  console.log("Command:", exitObject.command?.key);
  console.log("Exit code:", exitObject.exitCode);
  console.log("Output:", exitObject.output);
});

terminal.addEventListener("stdout", (e) => {
  console.log("stdout at", e.detail.timestamp, ":", e.detail.data);
});

terminal.addEventListener("stderr", (e) => {
  console.error("stderr:", e.detail.data);
});
```

## ExitObject and Command Results

Every command execution produces an `ExitObject`.

### ExitObject Properties

| Property | Type | Description |
|----------|------|-------------|
| `command` | `Command \| undefined` | The executed command (undefined if not found) |
| `timestamp` | `number` | Unix timestamp of execution |
| `exitCode` | `number` | 0 for success, 1 for error |
| `userInput` | `string[]` | Parsed input array |
| `rawInput` | `string` | Original input string |
| `output` | `any` | Return value from command action |
| `stdoutLog` | `any[]` | All stdout calls during execution |
| `stderrLog` | `any[]` | All stderr calls during execution |

### Accessing Results

To access the results of a command execution, you can use the `ExitObject` returned by the `executeCommand` method:

```typescript
// After command execution
const exitObject = terminal.executeCommand("echo hello");
console.log(exitObject.exitCode);  // 0
console.log(exitObject.output);    // "hello"

// Get most recent
const last = terminal.getLastExitObject();

// Access logs
console.log(last.stdoutLog);  // ["hello"]
console.log(last.stderrLog);  // []
```

## Built-in Commands

When `installBuiltins` is `true` (default), the default command set is available.

For more information on built-in commands, use the `commands` command to get a list of all available commands and  `man <command>` to get the manual for a specific command.

```typescript
const terminal = new Terminal(input, output, {
  installBuiltins: true
});
```

## CSS Classes

The library provides these CSS classes:

| Class | Applied To |
|-------|-----------|
| `input-terminal-stdout` | `<span>` elements for  each `stdout` log |
| `input-terminal-stderr` | `<span>` elements for  each `stderr` log |

### Example Styles

```css
/* stdout styling */
.input-terminal-stdout {
  color: #d4d4d4;
}

/* stderr styling */
.input-terminal-stderr {
  color: #f14c4c;
}
```
