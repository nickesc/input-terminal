import {Terminal, ExitObject} from "../../src/input-terminal";
import {commands} from "../../src/built-ins/commands";
import {JSDOM} from "jsdom";
import {describe, it, expect, beforeEach} from "vitest";

describe("commands command tests", () => {
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

    it("should run the commands command", () => {
        const expectedCommands = term.bin.getCommandKeys();
        const exit: ExitObject = commands.run(["commands"], "commands", term);
        expect(exit.command).toBe(commands);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["commands"]);
        expect(exit.output).toEqual({commands: expectedCommands});
        expect(exit.stdoutLog).toEqual([expectedCommands.join("\n")]);
    });

    it("should have manual page", () => {
        expect(commands.manual).toBeDefined();
        expect(commands.manual?.length).toBeGreaterThan(0);
    });
});
