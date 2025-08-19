import { Terminal, ExitObject } from '../../src/input-terminal';
import { alert } from '../../src/built-ins/alert';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe("alert command tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;
    const alertSpy = vi.spyOn(window, 'alert');

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById('terminal-input') as HTMLInputElement;
        term = new Terminal(input);
        term.init()
    });

    it("should run the alert command", () => {
        const exit: ExitObject = alert.run(["alert", "test"], "alert test", term);
        expect(exit.command).toBe(alert);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["alert", "test"]);
        expect(alertSpy).toHaveBeenCalledWith("test");
    })
});
