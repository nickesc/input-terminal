---
title: Output System
---

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
