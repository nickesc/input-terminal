import { Terminal, ExitObject } from '../../src/input-terminal';
import { return_ } from '../../src/built-ins/return.ts';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe("return command tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById('terminal-input') as HTMLInputElement;
        term = new Terminal(input);
    });

    it("should run the return command", () => {
        const exit: ExitObject = return_.run(["return", "x"], "return x", term);
        expect(exit.command).toBe(return_);
        expect(exit.exitCode).toEqual(0);
        expect(exit.output).toEqual({});
        expect(exit.userInput).toEqual(["return", "x"]);
    })
});
