---
title: History Management
---

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
