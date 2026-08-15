---
title: Custom Adapters
---

## Custom Output Adapters

Implement `OutputAdapter` when output belongs in another renderer or data store:

```typescript
import { Terminal } from "input-terminal";
import type { OutputAdapter, OutputMetadata } from "input-terminal";

const entries: Array<
  | { operation: "command"; data: string; metadata: OutputMetadata }
  | { operation: "stdout" | "stderr"; data: unknown; metadata: OutputMetadata }
> = [];

const output: OutputAdapter = {
  command(data, metadata) {
    entries.push({ operation: "command", data, metadata });
  },
  stdout(data, metadata) {
    entries.push({ operation: "stdout", data, metadata });
  },
  stderr(data, metadata) {
    entries.push({ operation: "stderr", data, metadata });
  },
  clear(metadata) {
    entries.length = 0;
  }
};

const terminal = new Terminal({
  input,
  output,
  options: { printCommand: true }
});
```

The terminal passes each raw output value and its frozen metadata object to the adapter. A custom adapter can accept metadata without using it.

Adapter methods run synchronously. If a method throws, the terminal dispatches the normal output event, dispatches `outputerror`, and continues command execution. The terminal calls the adapter again for the next output operation.
