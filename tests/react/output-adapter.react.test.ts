import {StrictMode, act, createElement} from "react";
import {createRoot} from "react-dom/client";
import {describe, expect, it} from "vitest";
import {ReactOutputAdapter, useTerminalOutput} from "../../src/react/index.ts";
import type {OutputMetadata} from "../../src/output-adapter.ts";

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});

interface OutputAdapterFixtureProps {
    adapter: ReactOutputAdapter;
}

function OutputAdapterFixture({adapter}: OutputAdapterFixtureProps) {
    const entries = useTerminalOutput(adapter);

    return createElement(
        "div",
        null,
        entries.map((entry) =>
            createElement(
                "span",
                {
                    key: entry.metadata.sequence,
                    "data-operation": entry.operation,
                    "data-sequence": entry.metadata.sequence,
                    "data-timestamp": entry.metadata.timestamp,
                },
                String(entry.data),
            ),
        ),
    );
}

describe("ReactOutputAdapter reactivity", () => {
    const metadata = (sequence: number, timestamp = 1_754_044_800_000): OutputMetadata =>
        Object.freeze({sequence, timestamp});

    it("renders entries added before and after mounting", async () => {
        const adapter = new ReactOutputAdapter();
        const target = document.createElement("div");
        const root = createRoot(target);
        adapter.command("$ test", metadata(1, 1_754_044_800_012));
        adapter.stdout("before mount", metadata(2, 1_754_044_800_123));

        try {
            await act(async () => {
                root.render(createElement(OutputAdapterFixture, {adapter}));
            });

            expect([...target.querySelectorAll("span")].map((entry) => entry.textContent)).toEqual([
                "$ test",
                "before mount",
            ]);

            await act(async () => {
                adapter.stderr("after mount", metadata(3, 1_754_044_800_456));
            });

            const entries = [...target.querySelectorAll("span")];
            expect(entries.map((entry) => entry.textContent)).toEqual([
                "$ test",
                "before mount",
                "after mount",
            ]);
            expect(entries.map((entry) => entry.dataset.operation)).toEqual([
                "command",
                "stdout",
                "stderr",
            ]);
            expect(entries.map((entry) => entry.dataset.sequence)).toEqual(["1", "2", "3"]);
            expect(entries.map((entry) => entry.dataset.timestamp)).toEqual([
                "1754044800012",
                "1754044800123",
                "1754044800456",
            ]);
        } finally {
            await act(async () => root.unmount());
        }
    });

    it("removes rendered entries when output is cleared", async () => {
        const adapter = new ReactOutputAdapter();
        const target = document.createElement("div");
        const root = createRoot(target);
        adapter.stdout("first", metadata(1));
        adapter.stderr("second", metadata(2));

        try {
            await act(async () => {
                root.render(
                    createElement(
                        StrictMode,
                        null,
                        createElement(OutputAdapterFixture, {adapter}),
                    ),
                );
            });

            expect(target.querySelectorAll("span")).toHaveLength(2);

            await act(async () => {
                adapter.clear(metadata(3));
            });
            expect(target.querySelectorAll("span")).toHaveLength(0);

            await act(async () => {
                adapter.stdout("after clear", metadata(4));
            });
            expect([...target.querySelectorAll("span")].map((entry) => entry.textContent)).toEqual([
                "after clear",
            ]);
        } finally {
            await act(async () => root.unmount());
        }
    });
});
