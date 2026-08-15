---
title: Output System
---

## Output System

The `Terminal` sends output to its configured adapter and event listeners. Adapters are optional, so the terminal can run in headless mode. See [Output Adapters](./output-adapters.md) for documentation on built-in adapters and how to write custom ones.

### Printing Commands

Enable `printCommand` to add the displayed input to the output before each command runs:

```typescript
const terminal = new Terminal({
  input,
  output,
  options: {
    preprompt: "[user] ",
    prompt: "$ ",
    printCommand: true
  }
});
```

Executing `echo hello` sends `[user] $ echo hello` to the adapter's `command()` method and dispatches a `command` event. The terminal preserves the raw input, including leading or trailing spaces. Empty executions print the prompt by itself.

Command entries have output metadata but are separate from stdout and stderr. They are not added to `ExitObject.stdoutLog` or `ExitObject.stderrLog`.

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

### Clearing Output

Call `clearOutput()` to ask the adapter to clear its rendered output:

```typescript
terminal.clearOutput();
```

The built-in `clear` command uses this method. Clearing receives its own metadata and dispatches a `clear` event.

### Metadata and Ordering

Every command, stdout, stderr, and clear operation receives:

- `sequence`: the operation’s position in the terminal-wide output sequence
- `timestamp`: the value of `Date.now()` when the operation begins
