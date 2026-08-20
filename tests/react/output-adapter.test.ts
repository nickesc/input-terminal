import {beforeEach, describe, expect, it, vi} from "vitest";
import {ReactOutputAdapter} from "../../src/react/index.ts";
import type {OutputMetadata} from "../../src/output-adapter.ts";

describe("ReactOutputAdapter", () => {
    let adapter: ReactOutputAdapter;

    const metadata = (sequence: number, timestamp = 1_754_044_800_000): OutputMetadata =>
        Object.freeze({sequence, timestamp});

    beforeEach(() => {
        adapter = new ReactOutputAdapter();
    });

    it("starts with one stable empty snapshot", () => {
        const snapshot = adapter.getSnapshot();

        expect(snapshot).toEqual([]);
        expect(Object.isFrozen(snapshot)).toBe(true);
        expect(adapter.getSnapshot()).toBe(snapshot);
    });

    it("records commands, stdout, and stderr in call order", () => {
        adapter.command("$ test", metadata(1));
        adapter.stdout("first", metadata(2));
        adapter.stderr("second", metadata(3));

        expect(adapter.getSnapshot()).toEqual([
            {operation: "command", data: "$ test", metadata: metadata(1)},
            {operation: "stdout", data: "first", metadata: metadata(2)},
            {operation: "stderr", data: "second", metadata: metadata(3)},
        ]);
    });

    it("preserves raw data and metadata identity", () => {
        const data = {status: "ok"};
        const outputMetadata = metadata(1);

        adapter.stdout(data, outputMetadata);

        const entry = adapter.getSnapshot()[0]!;
        expect(entry.data).toBe(data);
        expect(entry.metadata).toBe(outputMetadata);
    });

    it("freezes entry wrappers and snapshots without freezing raw data", () => {
        const data = {status: "ok"};

        adapter.stdout(data, metadata(1));

        const snapshot = adapter.getSnapshot();
        expect(Object.isFrozen(snapshot)).toBe(true);
        expect(Object.isFrozen(snapshot[0])).toBe(true);
        expect(Object.isFrozen(data)).toBe(false);
    });

    it("creates a new snapshot after each output and clear operation", () => {
        const emptySnapshot = adapter.getSnapshot();

        adapter.stdout("first", metadata(1));
        const firstSnapshot = adapter.getSnapshot();
        adapter.stderr("second", metadata(2));
        const secondSnapshot = adapter.getSnapshot();
        adapter.clear(metadata(3));
        const clearedSnapshot = adapter.getSnapshot();

        expect(firstSnapshot).not.toBe(emptySnapshot);
        expect(secondSnapshot).not.toBe(firstSnapshot);
        expect(clearedSnapshot).not.toBe(secondSnapshot);
        expect(clearedSnapshot).toEqual([]);
    });

    it("notifies active subscribers once per operation", () => {
        const first = vi.fn();
        const second = vi.fn();
        const unsubscribeFirst = adapter.subscribe(first);
        adapter.subscribe(second);

        adapter.stdout("before unsubscribe", metadata(1));
        unsubscribeFirst();
        adapter.clear(metadata(2));

        expect(first).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(2);
    });

    it("can clear an empty adapter", () => {
        const listener = vi.fn();
        const emptySnapshot = adapter.getSnapshot();
        adapter.subscribe(listener);

        expect(() => adapter.clear(metadata(1))).not.toThrow();
        expect(adapter.getSnapshot()).not.toBe(emptySnapshot);
        expect(adapter.getSnapshot()).toEqual([]);
        expect(listener).toHaveBeenCalledOnce();
    });
});
