---
title: Event System
---

## Event System

`Terminal` extends `EventTarget` and dispatches custom events to allow for observation of terminal activity.

### Available Events

| Event | Dispatched When | Detail |
|-------|-----------------|--------|
| `stdout` | `terminal.stdout()` is called | `{ metadata: OutputMetadata, data: unknown }` |
| `stderr` | `terminal.stderr()` is called | `{ metadata: OutputMetadata, data: unknown }` |
| `clear` | `terminal.clearOutput()` is called | `{ metadata: OutputMetadata }` |
| `outputerror` | An output adapter method throws | Failed operation, metadata, original data when applicable, and error |
| `executed` | A command finishes executing | `ExitObject` |

### Listening to Events

Known event names infer their event and detail types:

```typescript
terminal.addEventListener("executed", (event) => {
  const exitObject = event.detail;

  console.log("Command:", exitObject.command?.key);
  console.log("Exit code:", exitObject.exitCode);
  console.log("Output:", exitObject.output);
});

terminal.addEventListener("stdout", (event) => {
  console.log(
    `stdout #${event.detail.metadata.sequence}`,
    event.detail.data
  );
});

terminal.addEventListener("stderr", (event) => {
  console.error("stderr:", event.detail.data);
});
```

### Output Errors

`outputerror` identifies the adapter operation that failed:

```typescript
terminal.addEventListener("outputerror", (event) => {
  if (event.detail.operation === "clear") {
    console.error("Could not clear output", event.detail.error);
  } else {
    console.error(
      `Could not render ${event.detail.operation}`,
      event.detail.data,
      event.detail.error
    );
  }
});
```
