import { Terminal } from '../src/input-terminal';
import { Command } from '../src/commands';
import { HistoryCommand } from '../src/history';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isTerminal(target: any): boolean {
  return target instanceof Terminal;
}

function tHistoryCommand(text: string): HistoryCommand {
    return new HistoryCommand([text], undefined, 0);
}

describe('input-terminal', () => {
    it('should construct a Terminal object',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(isTerminal(term)).toBe(true);
    });


    // INPUT TESTS
    it('should construct with correct input',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.input).toBe(test_input);
    });


    // PREPROMPT TESTS
    it('should have empty preprompt property by default',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.preprompt).toEqual("");
    });
    it('should set custom preprompt property',  () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_pre: string = "a";

        const term: Terminal = new Terminal(test_input);
        term.preprompt = test_pre;
        expect(term.preprompt).toEqual(test_pre);
    });


    // PROMPT TESTS
    it('should have a default prompt property',  () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.prompt).toEqual("> ");
    });
    it('should set custom prompt property',  () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_prompt: string = "a"

        const term: Terminal = new Terminal(test_input);
        term.prompt = test_prompt;
        expect(term.prompt).toEqual(test_prompt);
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
        expect(typeof term.execute_command(new Command("test"))).toBe("number");
    });
});
