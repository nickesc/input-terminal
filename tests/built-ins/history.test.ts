import {Terminal, ExitObject} from "../../src/input-terminal";
import {history} from "../../src/built-ins/history";
import {JSDOM} from "jsdom";
import {describe, it, expect, beforeEach} from "vitest";

describe("history command tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal(input);
        term.init();
        term.executeCommand("echo first");
        term.executeCommand("return");
        term.executeCommand("echo second");
    });

    it("should run the history command", () => {
        const expectedHistory = term.history.items.map((item) => item.rawInput);
        const exit: ExitObject = history.run(["history"], "history", term);
        expect(exit.command).toBe(history);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["history"]);
        expect(exit.output).toEqual({history: expectedHistory});
    });

    it("should have manual page", () => {
        expect(history.manual).toBeDefined();
        expect(history.manual?.length).toBeGreaterThan(0);
    });
});
