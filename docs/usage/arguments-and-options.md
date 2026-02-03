---
title: Arguments and Options
---

## Arguments and Options

### Positional Arguments

Arguments are space-separated values after the command name:

```bash
greet Alice Bob Charlie
```

In the command action, `args` will be `["Alice", "Bob", "Charlie"]`.

### Type Coercion

Arguments are automatically converted to appropriate types:

| Input | Resulting Type | Value |
|-------|---------------|-------|
| `hello` | `string` | `"hello"` |
| `42` | `number` | `42` |
| `3.14` | `number` | `3.14` |
| `true` | `boolean` | `true` |
| `false` | `boolean` | `false` |

### Options Formats

Options can be specified in several formats:

```bash
# Long form boolean flag
command --verbose

# Long form with value
command --name=Alice

# Short form boolean flag
command -v

# Short form with value
command -n=Alice

# Multiple short flags combined
command -abc    # equivalent to -a -b -c
```

> Note: To assign an option a value, you must use the `=` operator.

### Accessing Options

Options are available in the `options` parameter:

```typescript
const search = new Command("search", (args, options, terminal) => {
  const query = args.join(" ");
  const caseSensitive = options.case || options.c;
  const limit = options.limit?.value || 10;
  
  terminal.stdout(`Searching for "${query}" (limit: ${limit})`);
});
```

Options structure:

```typescript
{
  verbose: { value: undefined },      // --verbose or -v
  name: { value: "Alice" },           // --name=Alice
  count: { value: 5 }                 // --count=5 (number)
}
```

### Quote Handling

Use quotes to include spaces in arguments:

```bash
# Double quotes
echo "Hello World"

# Single quotes
echo 'Hello World'

# Backticks
echo `Hello World`

# Nested quotes
echo "She said 'Hello'"

# Escaped quotes
echo "He said \"Hello\""
```
