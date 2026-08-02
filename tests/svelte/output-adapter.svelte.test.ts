import {flushSync, mount, unmount} from "svelte";
import {describe, expect, it} from "vitest";
import {SvelteOutputAdapter} from "../../src/svelte/index.ts";
import OutputAdapterFixture from "./output-adapter.fixture.svelte";
import type {OutputMetadata} from "../../src/output-adapter.ts";

describe("SvelteOutputAdapter reactivity", () => {
    const metadata = (sequence: number, timestamp = 1_754_044_800_000): OutputMetadata =>
        Object.freeze({sequence, timestamp});

    it("renders entries added before and after mounting", async () => {
        const adapter = new SvelteOutputAdapter();
        const target = document.createElement("div");
        adapter.stdout("before mount", metadata(1, 1_754_044_800_123));

        const component = mount(OutputAdapterFixture, {target, props: {adapter}});

        try {
            flushSync();
            expect([...target.querySelectorAll("span")].map((entry) => entry.textContent)).toEqual([
                "before mount",
            ]);

            flushSync(() => {
                adapter.stderr("after mount", metadata(2, 1_754_044_800_456));
            });

            const entries = [...target.querySelectorAll("span")];
            expect(entries.map((entry) => entry.textContent)).toEqual([
                "before mount",
                "after mount",
            ]);
            expect(entries.map((entry) => entry.dataset.operation)).toEqual(["stdout", "stderr"]);
            expect(entries.map((entry) => entry.dataset.sequence)).toEqual(["1", "2"]);
            expect(entries.map((entry) => entry.dataset.timestamp)).toEqual([
                "1754044800123",
                "1754044800456",
            ]);
        } finally {
            await unmount(component);
        }
    });

    it("removes rendered entries when output is cleared", async () => {
        const adapter = new SvelteOutputAdapter();
        const target = document.createElement("div");
        adapter.stdout("first", metadata(1));
        adapter.stderr("second", metadata(2));

        const component = mount(OutputAdapterFixture, {target, props: {adapter}});

        try {
            flushSync();
            expect(target.querySelectorAll("span")).toHaveLength(2);

            flushSync(() => {
                adapter.clear(metadata(3));
            });
            expect(target.querySelectorAll("span")).toHaveLength(0);

            flushSync(() => {
                adapter.stdout("after clear", metadata(4));
            });
            expect([...target.querySelectorAll("span")].map((entry) => entry.textContent)).toEqual([
                "after clear",
            ]);
        } finally {
            await unmount(component);
        }
    });
});
