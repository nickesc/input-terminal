<script lang="ts">
    import type {SvelteOutputAdapter} from "../../src/svelte/index.ts";

    let {adapter}: {adapter: SvelteOutputAdapter} = $props();
</script>

{#each adapter.entries as entry (entry.metadata.sequence)}
    <span
        data-operation={entry.operation}
        data-sequence={entry.metadata.sequence}
        data-timestamp={entry.metadata.timestamp}
    >{String(entry.data)}</span>
{/each}
