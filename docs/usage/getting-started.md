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
  - ./css-classes.md
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
  TermOptions, 
  TermOutput, 
  built_ins 
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
