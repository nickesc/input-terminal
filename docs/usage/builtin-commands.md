---
title: Built-in Commands
category: Usage
---

## Built-in Commands

When `installBuiltins` is `true` (default), the default command set is available.

For more information on built-in commands, use the `commands` command to get a list of all available commands and  `man <command>` to get the manual for a specific command.

```typescript
const terminal = new Terminal(input, output, {
  installBuiltins: true
});
```
