import {JSDOM} from "jsdom";
import {beforeEach, describe, expect, it} from "vitest";
import {DOMOutputAdapter} from "../../src/dom/index.ts";
import type {OutputMetadata} from "../../src/output-adapter.ts";

describe("DOMOutputAdapter", () => {
    let adapter: DOMOutputAdapter;
    let output: HTMLElement;

    const metadata = (sequence: number, timestamp = 1_754_044_800_000): OutputMetadata => ({
        sequence,
        timestamp,
    });

    beforeEach(() => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><div id="output"></div></body></html>');
        global.document = dom.window.document;
        output = document.getElementById("output") as HTMLElement;
        adapter = new DOMOutputAdapter(output);
    });

    it("renders commands with their class and metadata", () => {
        adapter.command("$ echo test", metadata(1, 1_754_044_800_012));

        const span = output.querySelector("span");

        expect(span?.className).toBe("input-terminal-command");
        expect(span?.textContent).toBe("$ echo test");
        expect(span?.dataset.sequence).toBe("1");
        expect(span?.dataset.timestamp).toBe("1754044800012");
    });

    it("renders stdout with its class and metadata", () => {
        adapter.stdout("normal output", metadata(1, 1_754_044_800_123));

        const span = output.querySelector("span");

        expect(span?.className).toBe("input-terminal-stdout");
        expect(span?.textContent).toBe("normal output");
        expect(span?.dataset.sequence).toBe("1");
        expect(span?.dataset.timestamp).toBe("1754044800123");
    });

    it("renders stderr with its class and metadata", () => {
        adapter.stderr("error output", metadata(2, 1_754_044_800_456));

        const span = output.querySelector("span");

        expect(span?.className).toBe("input-terminal-stderr");
        expect(span?.textContent).toBe("error output");
        expect(span?.dataset.sequence).toBe("2");
        expect(span?.dataset.timestamp).toBe("1754044800456");
    });

    it("preserves output order and appends a newline after each value", () => {
        adapter.command("$ test", metadata(1));
        adapter.stdout("first", metadata(2));
        adapter.stderr("second", metadata(3));
        adapter.stdout("third", metadata(4));

        expect([...output.querySelectorAll("span")].map((span) => span.textContent)).toEqual([
            "$ test",
            "first",
            "second",
            "third",
        ]);
        expect(output.textContent).toBe("$ test\nfirst\nsecond\nthird\n");
    });

    it.each([
        ["string", "string"],
        [42, "42"],
        [true, "true"],
        [12n, "12"],
        [null, "null"],
        [undefined, "undefined"],
        [{key: "value"}, '{"key":"value"}'],
    ])("formats %o as %s", (value, expected) => {
        adapter.stdout(value, metadata(1));

        expect(output.querySelector("span")?.textContent).toBe(expected);
    });

    it("falls back to string conversion for circular objects", () => {
        const circular: {self?: unknown} = {};
        circular.self = circular;

        expect(() => adapter.stdout(circular, metadata(1))).not.toThrow();
        expect(output.querySelector("span")?.textContent).toBe("[object Object]");
    });

    it("clears all output children", () => {
        adapter.stdout("first", metadata(1));
        adapter.stderr("second", metadata(2));

        adapter.clear(metadata(3));

        expect(output.childNodes).toHaveLength(0);
    });
});
