import { Terminal } from '../src/input-terminal';
import { Command } from '../src/commands';
import { ExitObject } from '../src/history';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isTerminal(target: any): boolean {
  return target instanceof Terminal;
}

function isExitObject(target: any): boolean {
  return target instanceof ExitObject;
}


describe('input-terminal', () => {
    it('should construct a Terminal object',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(isTerminal(term)).toBe(true);
    });


    // INITIALIZATION TESTS
    it('should initialize and mark itself started',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        term.init();
        expect(term.isStarted()).toBe(true);
    });
    it('should initialize and mark itself started',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        term.init();
        expect(term.isStarted()).toBe(true);
    });

    // INPUT TESTS
    it('should construct with correct input',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.input).toBe(test_input);
    });

    // PREDICTION TESTS
    it('should return a prediction as a string', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(typeof term.get_prediction("test")).toBe("string");
    });


    // COMMAND EXECUTION TESTS
    it('should return an exit code after execution', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(isExitObject(term.execute_command("command"))).toBe(true);
    });
    it('should call the callback after execution', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.execute_command("command", () => {return}))
    });
});
