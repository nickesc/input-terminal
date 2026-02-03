---
title: Commands
---

## Commands

### Basic Command Structure

A command consists of a key (the command name) and an action function:

```typescript
const greet = new Command("greet", (args, options, terminal) => {
  const name = args[0] || "World";
  terminal.stdout(`Hello, ${name}!`);
  return { greeted: name };
});
```

The action function receives three parameters:

- `args` - An array of positional arguments
- `options` - An object containing parsed options
- `terminal` - A reference to the `Terminal` instance

### Adding Commands

Add commands to the terminal's `bin`:

```typescript
// Add a single command
terminal.bin.add(greet);

// Add multiple commands at once
terminal.bin.add([command1, command2, command3]);
```

### Removing Commands

To remove a command from the `bin`:

```typescript
terminal.bin.remove(greet);
```

### Listing Commands

To get a list of all commands in the `bin`:

```typescript
const commands = terminal.bin.list;
// returns an array of all command objects in the bin

const commandKeys = terminal.bin.getCommandKeys();
// returns an array of all command key strings in the bin
// ["greet", "echo", "alert", ...]
```

### Adding Manual Pages

Commands can have documentation accessible via the `man` command. It can be set using the command's `manual` property:

```typescript
const greet = new Command("greet", (args, options, terminal) => {
  terminal.stdout(`Hello, ${args[0] || "World"}!`);
});

greet.manual = `greet [name]

Greets the specified name, or "World" if no name is provided.

Examples:
  greet           # outputs "Hello, World!"
  greet Alice     # outputs "Hello, Alice!"`;
```

### Custom Empty Command Handler

When the user presses <kbd>Enter</kbd> or executes a command with no input, the terminal's `emptyCommand` is executed:

```typescript
const customEmpty = new Command("", (args, options, terminal) => {
  terminal.stdout("Type 'help' for available commands");
  return {};
});

terminal.bin.emptyCommand = customEmpty;
```

### Programmatic Command Execution

Execute commands from code:

```typescript
const button = document.getElementById("button") as HTMLButtonElement;
button.addEventListener("click", () => {
  const result = terminal.executeCommand("echo Hello from code");
  console.log(result.exitCode);  // 0
});
```

### Autocomplete

Get command predictions programmatically:

```typescript
// All commands
const all = terminal.getPredictions();  // ["echo", "alert", ...]

// Filtered by prefix
const filtered = terminal.getPredictions("e");  // ["echo"]
```

Autocomplete also cycles through predictions when <kbd>Tab</kbd> is pressed from the input.
