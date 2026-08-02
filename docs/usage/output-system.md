---
title: Output System
---

## Output System

The `Terminal` uses output adapters to render or record values. Output adapters are optional and the terminal can work without one, running in headless mode.

### stdout and stderr

Use `terminal.stdout()` and `terminal.stderr()` to output data:

```typescript
const myCommand = new Command("test", (args, options, terminal) => {
  terminal.stdout("This is standard output");
  terminal.stderr("This is an error message");
  return { status: "done" };
});
```

Both methods accept values of any JavaScript type. The terminal keeps each original value in the current command log and passes it unchanged to the configured adapter and event listeners.

If an adapter method throws, the terminal catches the error, dispatches an `outputerror` event, and continues.

### DOM Output

Use `DOMOutputAdapter` to render output into an element:

```typescript
import { Terminal } from "input-terminal";
import { DOMOutputAdapter } from "input-terminal/dom";

const input = document.getElementById("terminal") as HTMLInputElement;
const outputElement = document.getElementById("output") as HTMLElement;
const terminal = new Terminal({
  input,
  output: new DOMOutputAdapter(outputElement)
});

terminal.init();

terminal.stdout("This is standard output");
```

Output is wrapped in `<span>` elements with CSS classes:

- `input-terminal-stdout` for stdout
- `input-terminal-stderr` for stderr

Each span also receives `data-sequence` and `data-timestamp` attributes. The adapter does not show those values as visible text by default, but CSS, scripts, or a custom adapter can use them.

### Custom Output Adapters

Implement `OutputAdapter` when output belongs in another renderer or data store:

```typescript
import { Terminal } from "input-terminal";
import type { OutputAdapter, OutputMetadata } from "input-terminal";

const entries: Array<{
  channel: "stdout" | "stderr";
  data: unknown;
  metadata: OutputMetadata;
}> = [];

const output: OutputAdapter = {
  stdout(data, metadata) {
    entries.push({ channel: "stdout", data, metadata });
  },
  stderr(data, metadata) {
    entries.push({ channel: "stderr", data, metadata });
  },
  clear(metadata) {
    entries.length = 0;
  }
};

const terminal = new Terminal({ input, output });
```

### Clearing Output

Call `clearOutput()` to ask the adapter to clear its rendered output:

```typescript
terminal.clearOutput();
```

The built-in `clear` command uses this method. Clearing receives its own metadata and dispatches a `clear` event.

### Metadata and Ordering

Every stdout, stderr, and clear operation receives:

- `sequence`: index of the operation in the current output log, starting at `1`
- `timestamp`: the value of `Date.now()` when the operation begins
