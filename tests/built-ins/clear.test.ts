import {Terminal, ExitObject} from "../../src/input-terminal";
import {clear} from "../../src/built-ins/clear";
import {JSDOM} from "jsdom";
import {describe, it, expect, beforeEach, vi} from "vitest";

describe("clear command tests", () => {
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

    it("should run the clear command", () => {
        output.innerHTML = "<span>test</span>";
        const clearSpy = vi.spyOn(term.output!, "clear");
        const exit: ExitObject = clear.run(["clear"], "clear", term);
        expect(exit.command).toBe(clear);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["clear"]);
        expect(exit.output).toEqual({});
        expect(clearSpy).toHaveBeenCalledTimes(1);
        expect(output.innerHTML).toBe("");
    });

    it("should have manual page", () => {
        expect(clear.manual).toBeDefined();
        expect(clear.manual?.length).toBeGreaterThan(0);
    });
});
