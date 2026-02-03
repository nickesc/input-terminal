import {Terminal, Command, ExitObject, TermOutput} from "../src/input-terminal";
import {describe, it, expect, beforeEach, vi} from "vitest";
import {JSDOM} from "jsdom";

describe("Terminal stdout/stderr Event Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal(input);
    });

    it("should emit stdout event with correct data", () => {
        const listener = vi.fn();
        term.addEventListener("stdout", listener);

        term.stdout("test output");

        expect(listener).toHaveBeenCalledTimes(1);
        const event = listener.mock.calls[0][0] as CustomEvent;
        expect(event.detail.data).toBe("test output");
        expect(event.detail.timestamp).toBeDefined();
    });

    it("should emit stderr event with correct data", () => {
        const listener = vi.fn();
        term.addEventListener("stderr", listener);

        term.stderr("error output");

        expect(listener).toHaveBeenCalledTimes(1);
        const event = listener.mock.calls[0][0] as CustomEvent;
        expect(event.detail.data).toBe("error output");
        expect(event.detail.timestamp).toBeDefined();
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
});

describe("Terminal stdout/stderr Log Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal(input);
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
});

describe("TermOutput Rendering Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let output: HTMLElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM(
            '<!DOCTYPE html><html><body><input type="text" id="terminal-input"><div id="terminal-output"></div></body></html>',
        );
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        output = document.getElementById("terminal-output") as HTMLElement;
        term = new Terminal(input, output);
        term.init();
    });

    it("should create TermOutput when output element is provided", () => {
        expect(term.output).toBeInstanceOf(TermOutput);
    });

    it("should have TermOutput attached after init", () => {
        expect(term.output?.attached).toBe(true);
    });

    it("should render stdout to element with correct class", () => {
        term.stdout("test output");

        const spans = output.querySelectorAll("span");
        expect(spans.length).toBe(1);
        expect(spans[0].className).toBe("input-terminal-stdout");
        expect(spans[0].textContent).toBe("test output");
    });

    it("should render stderr to element with correct class", () => {
        term.stderr("error output");

        const spans = output.querySelectorAll("span");
        expect(spans.length).toBe(1);
        expect(spans[0].className).toBe("input-terminal-stderr");
        expect(spans[0].textContent).toBe("error output");
    });

    it("should render multiple outputs in order", () => {
        term.stdout("line 1");
        term.stderr("error");
        term.stdout("line 2");

        const spans = output.querySelectorAll("span");
        expect(spans.length).toBe(3);
        expect(spans[0].textContent).toBe("line 1");
        expect(spans[0].className).toBe("input-terminal-stdout");
        expect(spans[1].textContent).toBe("error");
        expect(spans[1].className).toBe("input-terminal-stderr");
        expect(spans[2].textContent).toBe("line 2");
        expect(spans[2].className).toBe("input-terminal-stdout");
    });

    it("should render objects as JSON", () => {
        term.stdout({key: "value", num: 42});

        const spans = output.querySelectorAll("span");
        expect(spans[0].textContent).toBe('{"key":"value","num":42}');
    });

    it("should render numbers as strings", () => {
        term.stdout(42);

        const spans = output.querySelectorAll("span");
        expect(spans[0].textContent).toBe("42");
    });

    it("should render booleans as strings", () => {
        term.stdout(true);
        term.stdout(false);

        const spans = output.querySelectorAll("span");
        expect(spans[0].textContent).toBe("true");
        expect(spans[1].textContent).toBe("false");
    });
});

describe("TermOutput Control Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let output: HTMLElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM(
            '<!DOCTYPE html><html><body><input type="text" id="terminal-input"><div id="terminal-output"></div></body></html>',
        );
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        output = document.getElementById("terminal-output") as HTMLElement;
        term = new Terminal(input, output);
        term.init();
    });

    it("should clear output element contents", () => {
        term.stdout("line 1");
        term.stdout("line 2");

        expect(output.children.length).toBeGreaterThan(0);

        term.output?.clear();

        expect(output.innerHTML).toBe("");
    });

    it("should stop rendering after detach", () => {
        term.output?.detach();

        term.stdout("should not render");

        expect(output.querySelectorAll("span").length).toBe(0);
    });

    it("should resume rendering after reattach", () => {
        term.output?.detach();
        term.stdout("should not render");

        term.output?.attach();
        term.stdout("should render");

        const spans = output.querySelectorAll("span");
        expect(spans.length).toBe(1);
        expect(spans[0].textContent).toBe("should render");
    });

    it("should report attached status correctly", () => {
        expect(term.output?.attached).toBe(true);

        term.output?.detach();
        expect(term.output?.attached).toBe(false);

        term.output?.attach();
        expect(term.output?.attached).toBe(true);
    });
});

describe("Terminal Without Output Element Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal(input);
        term.init();
    });

    it("should have undefined output when no output element provided", () => {
        expect(term.output).toBeUndefined();
    });

    it("should still emit stdout events without output element", () => {
        const listener = vi.fn();
        term.addEventListener("stdout", listener);

        term.stdout("test");

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should still capture logs without output element", () => {
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

describe("Terminal Constructor with Output Tests", () => {
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM(
            '<!DOCTYPE html><html><body><input type="text" id="terminal-input"><div id="terminal-output"></div></body></html>',
        );
        global.document = dom.window.document;
    });

    it("should accept output as second parameter", () => {
        const input = document.getElementById("terminal-input") as HTMLInputElement;
        const output = document.getElementById("terminal-output") as HTMLElement;

        const term = new Terminal(input, output);
        term.init();

        expect(term.output).toBeInstanceOf(TermOutput);
        expect(term.output?.element).toBe(output);
    });

    it("should accept undefined output with options", () => {
        const input = document.getElementById("terminal-input") as HTMLInputElement;

        const term = new Terminal(input, undefined, {prompt: ">> "});
        term.init();

        expect(term.output).toBeUndefined();
        expect(term.options.prompt).toBe(">> ");
    });

    it("should accept output with options", () => {
        const input = document.getElementById("terminal-input") as HTMLInputElement;
        const output = document.getElementById("terminal-output") as HTMLElement;

        const term = new Terminal(input, output, {prompt: ">> "});
        term.init();

        expect(term.output).toBeInstanceOf(TermOutput);
        expect(term.options.prompt).toBe(">> ");
    });
});
