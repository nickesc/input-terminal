import { Terminal, Command } from '../input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function isTerminal(target: any): boolean {
  return target instanceof Terminal;
}

describe('input-terminal', () => {
    it('should construct a Terminal object',  async () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(isTerminal(term)).toBe(true);
    });


    // INPUT TESTS
    it('should construct with correct input',  async () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.input).toBe(test_input);
    });


    // PREPROMPT TESTS
    it('should have empty preprompt property by default',  async () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.get_preprompt()).toEqual("");
    });
    it('should construct with custom preprompt property',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_prompt: string = "a"

        const term: Terminal = new Terminal(test_input, [], test_prompt);
        expect(term.get_preprompt()).toEqual(test_prompt);
    });
    it('should set custom preprompt property',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_pre: string = "a"

        const term: Terminal = new Terminal(test_input);
        term.set_preprompt(test_pre)
        expect(term.get_preprompt()).toEqual(test_pre);
    });


    // PROMPT TESTS
    it('should have a default prompt property',  async () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.get_prompt()).toEqual("> ");
    });
    it('should construct with custom prompt property',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_prompt: string = "a"

        const term: Terminal = new Terminal(test_input, [], "", test_prompt);
        expect(term.get_prompt()).toEqual(test_prompt);
    });
    it('should set custom prompt property',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_prompt: string = "a"

        const term: Terminal = new Terminal(test_input);
        term.set_prompt(test_prompt)
        expect(term.get_prompt()).toEqual(test_prompt);
    });




    // PREDICTION TESTS
    it('should return a prediction as a string', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(typeof term.get_prediction("test")).toBe("string");
    });


    // COMMAND EXECUTION TESTS
    it('should return an exit code after commands', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(typeof term.execute_command({user_input: ["test"]})).toBe("number");
    });
});
