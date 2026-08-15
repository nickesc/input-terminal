---
title: Svelte
---

## Svelte Output Adapter

Use `SvelteOutputAdapter` to expose visible output through a reactive `entries` array.

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { Terminal } from "input-terminal";
  import { SvelteOutputAdapter } from "input-terminal/svelte";

  let input: HTMLInputElement;
  const output = new SvelteOutputAdapter();

  onMount(() => {
    const terminal = new Terminal({
      input,
      output,
      options: { printCommand: true }
    });
    terminal.init();

    return () => terminal.destroy();
  });
</script>

<div class="terminal-output">
  {#each output.entries as entry (entry.metadata.sequence)}
    <span
      class:command={entry.operation === "command"}
      class:error={entry.operation === "stderr"}
      class:output={entry.operation === "stdout"}
    >
      {String(entry.data)}
    </span>
  {/each}
</div>

<input bind:this={input} />
```

Each entry contains its `operation`, raw `data`, and terminal-assigned `metadata`. The adapter leaves formatting to your markup.

The `entries` property provides a read-only array of visible command, stdout, and stderr entries. Calling `terminal.clearOutput()` empties the array and updates the markup. Listen to the terminal output events when you need a transcript that includes clear operations and does not empty.

> [!NOTE]
> The adapter supports Svelte 5.7 and later.
