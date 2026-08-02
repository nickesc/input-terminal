---
title: Getting Started
children:
  - ./commands.md
  - ./command-results.md
  - ./arguments-and-options.md
  - ./output-system.md
  - ./event-system.md
  - ./history-management.md
  - ./configuration-options.md
  - ./builtin-commands.md
---

## Getting Started

Import `input-terminal` in your project:

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
  built_ins,
  type TermOptions
} from "input-terminal";
```

### Minimal Setup

The simplest way to get started is with just an `<input>` element:

```html
<input type="text" id="terminal" />
```

Then, create a new `Terminal` instance targeting the element. This creates a functional terminal that can execute commands, though output will only be accessible programmatically or through event listeners.

```typescript
import { Terminal, Command } from "input-terminal";

const input = document.getElementById("terminal") as HTMLInputElement;
const terminal = new Terminal({ input });

terminal.bin.add(new Command("hello", (args, options, terminal) => {
  terminal.stdout("Hello, World!");
  return { message: "Hello, World!" };
}));

terminal.init();
```

Call `terminal.init()` to attach input listeners and initialize the input as a terminal.

### Destroying the Terminal

Call `terminal.destroy()` when you want to stop the terminal without discarding its state. This detaches input listeners and marks the terminal as not started (useful for frameworks like React and Svelte).

```typescript
terminal.destroy();

// Later, re-attach listeners and resume
terminal.init();
```

After `destroy()`, you can call `init()` again to reattach listeners. Built-in commands are only installed once, so re-initializing will not duplicate them.

### With Output Element

To render output to a DOM element, create a `DOMOutputAdapter` and pass it in the terminal configuration:

```html
<input type="text" id="terminal" />
<pre id="output"></pre>
```

```typescript
import { Terminal } from "input-terminal";
import { DOMOutputAdapter } from "input-terminal/dom";

const input = document.getElementById("terminal") as HTMLInputElement;
const output = document.getElementById("output") as HTMLElement;

const terminal = new Terminal({
  input,
  output: new DOMOutputAdapter(output)
});

terminal.init();
```

The adapter renders values sent to `stdout` and `stderr`. If you omit the adapter, the terminal remains fully usable without visible output.
