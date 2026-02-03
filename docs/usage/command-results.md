---
title: Command Results
category: Usage
---

## Command Results

Every command execution produces an `ExitObject`.

### ExitObject Properties

| Property | Type | Description |
|----------|------|-------------|
| `command` | `Command \| undefined` | The executed command (undefined if not found) |
| `timestamp` | `number` | Unix timestamp of execution |
| `exitCode` | `number` | 0 for success, 1 for error |
| `userInput` | `string[]` | Parsed input array |
| `rawInput` | `string` | Original input string |
| `output` | `any` | Return value from command action |
| `stdoutLog` | `any[]` | All stdout calls during execution |
| `stderrLog` | `any[]` | All stderr calls during execution |

### Accessing Results

To access the results of a command execution, you can use the `ExitObject` returned by the `executeCommand` method:

```typescript
// After command execution
const exitObject = terminal.executeCommand("echo hello");
console.log(exitObject.exitCode);  // 0
console.log(exitObject.output);    // "hello"

// Get most recent
const last = terminal.getLastExitObject();

// Access logs
console.log(last.stdoutLog);  // ["hello"]
console.log(last.stderrLog);  // []
```
