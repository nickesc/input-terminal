import {beforeEach, describe, expect, it} from "vitest";
import {SvelteOutputAdapter} from "../../src/svelte/index.ts";
import type {OutputMetadata} from "../../src/output-adapter.ts";

describe("SvelteOutputAdapter", () => {
    let adapter: SvelteOutputAdapter;

    const metadata = (sequence: number, timestamp = 1_754_044_800_000): OutputMetadata =>
        Object.freeze({sequence, timestamp});

    beforeEach(() => {
        adapter = new SvelteOutputAdapter();
    });

    it("starts with no visible entries", () => {
        expect(adapter.entries).toEqual([]);
    });

    it("records commands, stdout, and stderr in call order", () => {
        adapter.command("$ test", metadata(1));
        adapter.stdout("first", metadata(2));
        adapter.stderr("second", metadata(3));
        adapter.stdout("third", metadata(4));

        expect(adapter.entries).toEqual([
            {operation: "command", data: "$ test", metadata: metadata(1)},
            {operation: "stdout", data: "first", metadata: metadata(2)},
            {operation: "stderr", data: "second", metadata: metadata(3)},
            {operation: "stdout", data: "third", metadata: metadata(4)},
        ]);
    });

    it("preserves raw data and metadata identity", () => {
        const data = {status: "ok"};
        const outputMetadata = metadata(1);

        adapter.stdout(data, outputMetadata);

        const entry = adapter.entries[0]!;
        expect(entry.data).toBe(data);
        expect(entry.metadata).toBe(outputMetadata);
    });

    it("freezes entry wrappers without freezing raw data", () => {
        const data = {status: "ok"};

        adapter.stdout(data, metadata(1));

        const entry = adapter.entries[0]!;
        expect(Object.isFrozen(entry)).toBe(true);
        expect(Object.isFrozen(data)).toBe(false);
    });

    it("keeps one live entries array across output and clear operations", () => {
        const entries = adapter.entries;

        adapter.stdout("first", metadata(1));
        expect(adapter.entries).toBe(entries);
        expect(entries).toHaveLength(1);

        adapter.clear(metadata(2));
        expect(adapter.entries).toBe(entries);
        expect(entries).toEqual([]);

        adapter.stderr("after clear", metadata(3));
        expect(adapter.entries).toBe(entries);
        expect(entries).toEqual([
            {operation: "stderr", data: "after clear", metadata: metadata(3)},
        ]);
    });

    it("can clear an empty adapter", () => {
        const entries = adapter.entries;

        expect(() => adapter.clear(metadata(1))).not.toThrow();
        expect(adapter.entries).toBe(entries);
        expect(entries).toEqual([]);
    });
});
