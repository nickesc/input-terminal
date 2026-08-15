---
title: DOM
---

## DOM Output Adapter

Use `DOMOutputAdapter` to render output into an element:

```typescript
import { Terminal } from "input-terminal";
import { DOMOutputAdapter } from "input-terminal/dom";

const input = document.getElementById("terminal") as HTMLInputElement;
const outputElement = document.getElementById("output") as HTMLElement;
const terminal = new Terminal({
  input,
  output: new DOMOutputAdapter(outputElement),
  options: { printCommand: true }
});

terminal.init();
terminal.stdout("This is standard output");
```

The adapter wraps each value in a `<span>` and assigns a class based on the output operation:

- `input-terminal-command` for the prompt and command
- `input-terminal-stdout` for stdout
- `input-terminal-stderr` for stderr

Each span also receives `data-sequence` and `data-timestamp` attributes. The adapter leaves those values out of the visible text. CSS and scripts can read the attributes when needed.

Calling `terminal.clearOutput()` removes the output element's child nodes.
