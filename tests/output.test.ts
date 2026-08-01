import {Terminal, Command, ExitObject} from "../src/input-terminal";
import {DOMOutputAdapter} from "../src/dom/index.ts";
import type {OutputAdapter, OutputMetadata} from "../src/input-terminal";
import {describe, it, expect, beforeEach, vi} from "vitest";
import {JSDOM} from "jsdom";

type RecordedOutputOperation =
    | {metadata: OutputMetadata; operation: "stdout" | "stderr"; data: unknown}
    | {metadata: OutputMetadata; operation: "clear"};

class RecordingOutputAdapter implements OutputAdapter {
    public operations: RecordedOutputOperation[] = [];

    public stdout(data: unknown, metadata: OutputMetadata): void {
        this.operations.push({metadata, operation: "stdout", data});
    }

    public stderr(data: unknown, metadata: OutputMetadata): void {
        this.operations.push({metadata, operation: "stderr", data});
    }

    public clear(metadata: OutputMetadata): void {
        this.operations.push({metadata, operation: "clear"});
    }
}

describe("Terminal stdout/stderr Event Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should emit stdout event with correct data", () => {
        const listener = vi.fn();
        term.addEventListener("stdout", listener);

        term.stdout("test output");

        expect(listener).toHaveBeenCalledTimes(1);
        const event = listener.mock.calls[0][0] as CustomEvent;
        expect(event.detail.data).toBe("test output");
        expect(event.detail.metadata.sequence).toBe(1);
        expect(event.detail.metadata.timestamp).toEqual(expect.any(Number));
    });

    it("should emit stderr event with correct data", () => {
        const listener = vi.fn();
        term.addEventListener("stderr", listener);

        term.stderr("error output");

        expect(listener).toHaveBeenCalledTimes(1);
        const event = listener.mock.calls[0][0] as CustomEvent;
        expect(event.detail.data).toBe("error output");
        expect(event.detail.metadata.sequence).toBe(1);
        expect(event.detail.metadata.timestamp).toEqual(expect.any(Number));
    });

    it("should emit stdout events with different data types", () => {
        const listener = vi.fn();
        term.addEventListener("stdout", listener);

        term.stdout("string");
        term.stdout(123);
        term.stdout({key: "value"});
        term.stdout(true);

        expect(listener).toHaveBeenCalledTimes(4);
        expect((listener.mock.calls[0][0] as CustomEvent).detail.data).toBe("string");
        expect((listener.mock.calls[1][0] as CustomEvent).detail.data).toBe(123);
        expect((listener.mock.calls[2][0] as CustomEvent).detail.data).toEqual({key: "value"});
        expect((listener.mock.calls[3][0] as CustomEvent).detail.data).toBe(true);
    });

    it("should sequence stdout and stderr from one terminal-wide counter", () => {
        const events: CustomEvent[] = [];
        const listener = (event: Event) => events.push(event as CustomEvent);
        term.addEventListener("stdout", listener);
        term.addEventListener("stderr", listener);

        term.stdout("first");
        term.stderr("second");
        term.stdout("third");

        expect(events.map((event) => event.detail.metadata.sequence)).toEqual([1, 2, 3]);
    });

    it("should capture Date.now when each operation begins", () => {
        const dispatchEvent = vi.spyOn(term, "dispatchEvent").mockReturnValue(true);
        const now = vi.spyOn(Date, "now").mockReturnValue(1_000);

        term.stdout("first");
        now.mockReturnValue(2_000);
        term.stderr("second");

        const stdoutEvent = dispatchEvent.mock.calls[0][0] as CustomEvent;
        const stderrEvent = dispatchEvent.mock.calls[1][0] as CustomEvent;
        const stdoutTimestamp = stdoutEvent.detail.metadata.timestamp;
        const stderrTimestamp = stderrEvent.detail.metadata.timestamp;
        now.mockRestore();

        expect(stdoutTimestamp).toBe(1_000);
        expect(stderrTimestamp).toBe(2_000);
    });

    it("should freeze output metadata", () => {
        const listener = vi.fn();
        term.addEventListener("stdout", listener);

        term.stdout("test");

        const event = listener.mock.calls[0][0] as CustomEvent;
        expect(Object.isFrozen(event.detail.metadata)).toBe(true);
    });

    it("should preserve the sequence across destroy and reinitialization", () => {
        const events: CustomEvent[] = [];
        const listener = (event: Event) => events.push(event as CustomEvent);
        term.addEventListener("stdout", listener);
        term.addEventListener("stderr", listener);

        term.stdout("before");
        term.init();
        term.destroy();
        term.init();
        term.stderr("after");

        expect(events.map((event) => event.detail.metadata.sequence)).toEqual([1, 2]);
    });
});

describe("Terminal Output Adapter Routing Tests", () => {
    let input: HTMLInputElement;

    beforeEach(() => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
    });

    it("should route stdout, stderr, and clear directly to the configured adapter", () => {
        const output = new RecordingOutputAdapter();
        const term = new Terminal({input, output});
        const stdoutValue = {channel: "stdout"};
        const stderrValue = {channel: "stderr"};

        term.stdout(stdoutValue);
        term.stderr(stderrValue);
        term.clearOutput();

        expect(output.operations.map((operation) => operation.operation)).toEqual(["stdout", "stderr", "clear"]);
        expect((output.operations[0] as {data: unknown}).data).toBe(stdoutValue);
        expect((output.operations[1] as {data: unknown}).data).toBe(stderrValue);
        expect(output.operations.map((operation) => operation.metadata.sequence)).toEqual([1, 2, 3]);
    });

    it("should update logs before the adapter and call the adapter before the event", () => {
        const order: string[] = [];
        let term: Terminal;
        const output: OutputAdapter = {
            stdout(data, metadata) {
                expect(term.getStdoutLog()).toEqual(["test"]);
                order.push("stdout adapter");
            },
            stderr(data, metadata) {
                expect(term.getStderrLog()).toEqual(["error"]);
                order.push("stderr adapter");
            },
            clear(metadata) {},
        };
        term = new Terminal({input, output});
        term.addEventListener("stdout", () => order.push("stdout event"));
        term.addEventListener("stderr", () => order.push("stderr event"));

        term.stdout("test");
        term.stderr("error");

        expect(order).toEqual(["stdout adapter", "stdout event", "stderr adapter", "stderr event"]);
    });

    it("should pass the same metadata object to the adapter and normal event", () => {
        const output = new RecordingOutputAdapter();
        const term = new Terminal({input, output});
        const events: CustomEvent[] = [];
        const listener = (event: Event) => events.push(event as CustomEvent);
        term.addEventListener("stdout", listener);
        term.addEventListener("stderr", listener);
        term.addEventListener("clear", listener);

        term.stdout("normal");
        term.stderr("error");
        term.clearOutput();

        expect(events).toHaveLength(3);
        for (const [index, event] of events.entries()) {
            expect(event.detail.metadata).toBe(output.operations[index]?.metadata);
        }
    });

    it("should keep the configured adapter across initialization and destruction", () => {
        const output = new RecordingOutputAdapter();
        const term = new Terminal({input, output});

        term.init();
        term.destroy();
        term.stdout("after destroy");

        expect(term.output).toBe(output);
        expect(output.operations).toHaveLength(1);
    });
});

describe("Terminal stdout/stderr Log Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should capture stdout log during command execution", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                terminal.stdout("output 1");
                terminal.stdout("output 2");
                return {};
            }),
        );

        const exit = term.executeCommand("test");

        expect(exit.stdoutLog).toEqual(["output 1", "output 2"]);
    });

    it("should capture stderr log during command execution", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                terminal.stderr("error 1");
                terminal.stderr("error 2");
                return {};
            }),
        );

        const exit = term.executeCommand("test");

        expect(exit.stderrLog).toEqual(["error 1", "error 2"]);
    });

    it("should capture both stdout and stderr logs", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                terminal.stdout("output");
                terminal.stderr("error");
                terminal.stdout("more output");
                return {};
            }),
        );

        const exit = term.executeCommand("test");

        expect(exit.stdoutLog).toEqual(["output", "more output"]);
        expect(exit.stderrLog).toEqual(["error"]);
    });

    it("should clear logs between command executions", () => {
        term.bin.add(
            new Command("test1", (args, options, terminal) => {
                terminal.stdout("first command output");
                return {};
            }),
        );
        term.bin.add(
            new Command("test2", (args, options, terminal) => {
                terminal.stdout("second command output");
                return {};
            }),
        );

        const exit1 = term.executeCommand("test1");
        const exit2 = term.executeCommand("test2");

        expect(exit1.stdoutLog).toEqual(["first command output"]);
        expect(exit2.stdoutLog).toEqual(["second command output"]);
    });

    it("should have empty logs for commands that don't use stdout/stderr", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return {result: "no output"};
            }),
        );

        const exit = term.executeCommand("test");

        expect(exit.stdoutLog).toEqual([]);
        expect(exit.stderrLog).toEqual([]);
    });

    it("should print an error to stderr for unknown commands", () => {
        const exit = term.executeCommand("unknown");

        expect(exit.stdoutLog).toEqual([]);
        expect(exit.stderrLog).not.toEqual([]);
    });

    it("should return a copy of logs via getStdoutLog and getStderrLog", () => {
        term.stdout("test");
        term.stderr("error");

        const stdoutLog = term.getStdoutLog();
        const stderrLog = term.getStderrLog();

        // Modify the returned arrays
        stdoutLog.push("modified");
        stderrLog.push("modified");

        // Original logs should be unchanged
        expect(term.getStdoutLog()).toEqual(["test"]);
        expect(term.getStderrLog()).toEqual(["error"]);
    });

    it("should update logs before output listeners run", () => {
        const stdoutLogDuringEvent: unknown[][] = [];
        const stderrLogDuringEvent: unknown[][] = [];
        term.addEventListener("stdout", () => stdoutLogDuringEvent.push(term.getStdoutLog()));
        term.addEventListener("stderr", () => stderrLogDuringEvent.push(term.getStderrLog()));

        term.stdout("normal");
        term.stderr("error");

        expect(stdoutLogDuringEvent).toEqual([["normal"]]);
        expect(stderrLogDuringEvent).toEqual([["error"]]);
    });
});

describe("Terminal Clear Output Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let output: HTMLElement;
    let outputAdapter: DOMOutputAdapter;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM(
            '<!DOCTYPE html><html><body><input type="text" id="terminal-input"><div id="terminal-output"></div></body></html>',
        );
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        output = document.getElementById("terminal-output") as HTMLElement;
        outputAdapter = new DOMOutputAdapter(output);
        term = new Terminal({input, output: outputAdapter});
        term.init();
    });

    it("should clear rendered output before dispatching the clear event", () => {
        output.innerHTML = "<span>existing output</span>";
        const outputDuringEvent: string[] = [];
        const listener = vi.fn((event: Event) => outputDuringEvent.push(output.innerHTML));
        term.addEventListener("clear", listener);

        term.clearOutput();

        expect(output.innerHTML).toBe("");
        expect(outputDuringEvent).toEqual([""]);
        expect(listener).toHaveBeenCalledTimes(1);
        const event = listener.mock.calls[0][0] as CustomEvent;
        expect(event.detail.metadata.sequence).toBe(1);
        expect(event.detail.metadata.timestamp).toEqual(expect.any(Number));
        expect(Object.isFrozen(event.detail.metadata)).toBe(true);
    });

    it("should sequence clear with stdout and stderr without resetting the counter", () => {
        const events: CustomEvent[] = [];
        const listener = (event: Event) => events.push(event as CustomEvent);
        term.addEventListener("stdout", listener);
        term.addEventListener("stderr", listener);
        term.addEventListener("clear", listener);

        term.stdout("first");
        term.stderr("second");
        term.clearOutput();
        term.stdout("fourth");

        expect(events.map((event) => event.detail.metadata.sequence)).toEqual([1, 2, 3, 4]);
    });

    it("should emit and sequence clear without an output adapter", () => {
        const headlessTerm = new Terminal({input});
        const events: CustomEvent[] = [];
        const listener = (event: Event) => events.push(event as CustomEvent);
        headlessTerm.addEventListener("clear", listener);
        headlessTerm.addEventListener("stdout", listener);

        headlessTerm.clearOutput();
        headlessTerm.stdout("after clear");

        expect(events.map((event) => event.type)).toEqual(["clear", "stdout"]);
        expect(events.map((event) => event.detail.metadata.sequence)).toEqual([1, 2]);
    });

    it("should preserve logs, history, and input", () => {
        const historyEntry = new ExitObject(["previous"], "previous", undefined, 0, {});
        term.history.push(historyEntry);
        term.stdout("normal");
        term.stderr("error");
        term.updateInput("unfinished input");

        term.clearOutput();

        expect(term.getStdoutLog()).toEqual(["normal"]);
        expect(term.getStderrLog()).toEqual(["error"]);
        expect(term.history.items).toEqual([historyEntry]);
        expect(term.getInputValue()).toBe("unfinished input");
    });
});

describe("Terminal Without Output Adapter Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
        term.init();
    });

    it("should have undefined output when no output adapter is provided", () => {
        expect(term.output).toBeUndefined();
    });

    it("should still emit stdout events without an output adapter", () => {
        const listener = vi.fn();
        term.addEventListener("stdout", listener);

        term.stdout("test");

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should still capture logs without an output adapter", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                terminal.stdout("output");
                return {};
            }),
        );

        const exit = term.executeCommand("test");

        expect(exit.stdoutLog).toEqual(["output"]);
    });
});

describe("Terminal Constructor Configuration Tests", () => {
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM(
            '<!DOCTYPE html><html><body><input type="text" id="terminal-input"><div id="terminal-output"></div></body></html>',
        );
        global.document = dom.window.document;
    });

    it("should accept an output adapter", () => {
        const input = document.getElementById("terminal-input") as HTMLInputElement;
        const output = new RecordingOutputAdapter();

        const term = new Terminal({input, output});
        term.init();

        expect(term.output).toBe(output);
    });

    it("should accept options without an output adapter", () => {
        const input = document.getElementById("terminal-input") as HTMLInputElement;

        const term = new Terminal({input, options: {prompt: ">> "}});
        term.init();

        expect(term.output).toBeUndefined();
        expect(term.options.prompt).toBe(">> ");
    });

    it("should accept an output adapter with options", () => {
        const input = document.getElementById("terminal-input") as HTMLInputElement;
        const output = new RecordingOutputAdapter();

        const term = new Terminal({input, output, options: {prompt: ">> "}});
        term.init();

        expect(term.output).toBe(output);
        expect(term.options.prompt).toBe(">> ");
    });
});
