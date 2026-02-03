---
title: Configuration Options
---

## Configuration Options

Pass options to the `Terminal` constructor:

```typescript
const terminal = new Terminal(input, output, {
  prompt: ">> ",
  preprompt: "[user] ",
  previousKey: "ArrowUp",
  nextKey: "ArrowDown",
  returnKey: "Enter",
  autocompleteKey: "Tab",
  installBuiltins: true,
  addEmptyCommandToHistory: false,
  showDuplicateCommands: false
});
```

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prompt` | `string` | `"> "` | Text displayed at the start of the input |
| `preprompt` | `string` | `""` | Text displayed before the prompt |
| `previousKey` | `string` | `"ArrowUp"` | Key to navigate to previous command |
| `nextKey` | `string` | `"ArrowDown"` | Key to navigate to next command |
| `returnKey` | `string` | `"Enter"` | Key to execute command |
| `autocompleteKey` | `string` | `"Tab"` | Key to trigger autocomplete |
| `installBuiltins` | `boolean` | `true` | Whether to include built-in commands |
| `addEmptyCommandToHistory` | `boolean` | `false` | Whether empty commands are added to history |
| `showDuplicateCommands` | `boolean` | `false` | Whether to show duplicate commands when navigating history |

### Custom Options

You can also add custom properties to options:

```typescript
const terminal = new Terminal(input, output, {
  prompt: "> ",
  myCustomOption: "custom value"
});

// Access later
console.log(terminal.options.myCustomOption);
```
