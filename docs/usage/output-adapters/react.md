---
title: React
---

## React Output Adapter

Use `ReactOutputAdapter` with `useTerminalOutput` to render visible output in a React component. React 18 or later is required.

Create the adapter once for the lifetime of the terminal. The hook subscribes the component to its current output entries:

```tsx
import { useEffect, useMemo, useRef } from "react";
import { Terminal } from "input-terminal";
import {
  ReactOutputAdapter,
  useTerminalOutput
} from "input-terminal/react";

export function TerminalView() {
  const inputRef = useRef<HTMLInputElement>(null);
  const output = useMemo(() => new ReactOutputAdapter(), []);
  const entries = useTerminalOutput(output);

  useEffect(() => {
    const terminal = new Terminal({
      input: inputRef.current!,
      output,
      options: { printCommand: true }
    });
    terminal.init();

    return () => terminal.destroy();
  }, [output]);

  return (
    <>
      <div className="terminal-output">
        {entries.map((entry) => (
          <span
            key={entry.metadata.sequence}
            className={entry.operation}
          >
            {String(entry.data)}
          </span>
        ))}
      </div>

      <input ref={inputRef} />
    </>
  );
}
```

Each entry contains its `operation`, raw `data`, and terminal-assigned `metadata`. The adapter leaves formatting and markup to the component.

The hook returns an immutable snapshot. Output operations create a new snapshot and rerender subscribed components. Calling `terminal.clearOutput()` replaces the snapshot with an empty one.

Keep the adapter stable across renders. Creating it directly in the component body would create a new store on every render and disconnect the hook from the terminal's store.

### Server Rendering

The hook supports an empty server-rendered output area. Initialize `Terminal` in an effect so the server render and the browser's first render both see an empty adapter. The terminal starts producing output after hydration.

The adapter does not serialize preloaded output from the server. If a server renders existing entries, the browser must start with matching entries to hydrate that markup. Use an empty initial output area unless you manage that transfer in your application.

Listen to the terminal output events when you need a transcript that includes clear operations and does not empty.
