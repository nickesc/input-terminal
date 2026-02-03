---
title: Event System
---

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
