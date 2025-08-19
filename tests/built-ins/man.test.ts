import { Terminal, ExitObject, Command } from '../../src/input-terminal';
import { man } from '../../src/built-ins/man';
import { echo } from '../../src/built-ins/echo';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe("man command tests", () => {
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

    it("should run the man command", () => {
        const exit: ExitObject = man.run(["man", "echo"], "man echo", term);
        expect(exit.command).toBe(man);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["man", "echo"]);
        expect(exit.output).toEqual(echo.manual);
    })

    it("should run the man command with no arguments", () => {
        const exit: ExitObject = man.run(["man"], "man", term);
        expect(exit.command).toBe(man);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["man"]);
        expect(exit.output).toEqual(`man: Error: No command provided.\n\n${man.manual}`);
    })

    it("should run the man command with a non-existent command", () => {
        const exit: ExitObject = man.run(["man", "nonexistent"], "man nonexistent", term);
        expect(exit.command).toBe(man);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["man", "nonexistent"]);
        expect(exit.output).toEqual('Command "nonexistent" not found');
    })

    it("should run the man command with a command that has no manual", () => {
        term.bin.add(new Command("noman", (args, options, terminal) => {return}));
        const exit: ExitObject = man.run(["man", "noman"], "man noman", term);
        expect(exit.command).toBe(man);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["man", "noman"]);
        expect(exit.output).toEqual("noman");
    })
});
