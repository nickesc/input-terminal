import { Terminal, ExitObject } from '../../src/input-terminal';
import { echo } from '../../src/built-ins/echo';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach } from 'vitest';

describe("echo command tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById('terminal-input') as HTMLInputElement;
        term = new Terminal(input);
        term.init()
    });

    it("should run the echo command", () => {
        const exit: ExitObject = echo.run(["echo", "test"], "echo test", term);
        expect(exit.command).toBe(echo);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["echo", "test"]);
        expect(exit.output).toEqual("test");
    })

    it("should run the echo command with many arguments", () => {
        const exit: ExitObject = echo.run(["echo", "test", "test2", "test3"], "echo test test2 test3", term);
        expect(exit.command).toBe(echo);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["echo", "test", "test2", "test3"]);
        expect(exit.output).toEqual("test test2 test3");
    })

    it("should run the echo command with no arguments", () => {
        const exit: ExitObject = echo.run(["echo"], "echo", term);
        expect(exit.command).toBe(echo);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["echo"]);
        expect(exit.output).toEqual("");
    })

});
