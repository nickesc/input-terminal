---
title: Output Adapters
children:
  - ./output-adapters/dom.md
  - ./output-adapters/svelte.md
  - ./output-adapters/custom.md
---

## Output Adapters

An output adapter renders or records values from `terminal.stdout()`, `terminal.stderr()`, and `terminal.clearOutput()`. Pass one through `TerminalConfig.output`:

```typescript
const terminal = new Terminal({ input, output });
```

Choose an adapter based on who owns the rendered state:

- [DOM](./output-adapters/dom.md) appends output to an `HTMLElement`.
- [Svelte](./output-adapters/svelte.md) exposes output through a reactive array.
- [Custom Adapters](./output-adapters/custom.md) connect the terminal to another renderer or data store.

You can omit `output` when you want a headless terminal. The terminal will still record command logs and dispatch output events.
