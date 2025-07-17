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
    it('should set custom prompt property',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_prompt: string = "a"

        const term: Terminal = new Terminal(test_input);
        term.set_prompt(test_prompt)
        expect(term.get_prompt()).toEqual(test_prompt);
    });


    // COMMAND HISTORY TESTS
    it('should have empty command history by default', async () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_history: Command[] = [];

        const term = new Terminal(test_input);
        expect(term.get_history()).toEqual([]);
    });
    it('should construct with custom command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_history: Command[] = [{user_input: ["test"]}];

        const term: Terminal = new Terminal(test_input, test_history);
        expect(term.get_history()).toBe(test_history);
    });

    // PUSH HISTORY TESTS
    it('should return the length of the command history on push',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_command: Command = {user_input: ["test"]};

        const term: Terminal = new Terminal(test_input);
        expect(term.push_history(test_command)).toBe(1);
    });
    it('should push command to history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: Command[] = [{user_input: ["test1"]}, {user_input: ["test2"]}];

        const term: Terminal = new Terminal(test_input);
        term.push_history(test_commands[0]);
        term.push_history(test_commands[1]);
        expect(term.get_history()).toEqual([test_commands[1],test_commands[0]]);
    });
    it('should retain index in history if command is pushed',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: Command[] = [{user_input: ["test1"]}, {user_input: ["test2"]}, {user_input: ["test3"]}];

        const term: Terminal = new Terminal(test_input);
        term.push_history(test_commands[0]);
        term.push_history(test_commands[1]);

        term.previous_history()

        term.push_history(test_commands[2]);
        expect(term.current_history()).toBe(test_commands[1]);
        expect(term.previous_history()).toBe(test_commands[0]);
    });

    // POP HISTORY TESTS
    it('should return the popped command on pop',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_command: Command = {user_input: ["test"]};

        const term: Terminal = new Terminal(test_input);
        term.push_history(test_command);
        expect(term.pop_history()).toBe(test_command);
    });
    it('should remove first command from history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: Command[] = [{user_input: ["test1"]}, {user_input: ["test2"]}];

        const term: Terminal = new Terminal(test_input);
        term.push_history(test_commands[0]);
        term.push_history(test_commands[1]);
        term.pop_history()
        expect(term.get_history()).toEqual([test_commands[0]]);
    });
    it('should retain index in history if command is popped',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: Command[] = [{user_input: ["test1"]}, {user_input: ["test2"]}, {user_input: ["test3"]}];

        const term: Terminal = new Terminal(test_input);
        term.push_history(test_commands[0]);
        term.push_history(test_commands[1]);
        term.push_history(test_commands[2]);
        term.previous_history();

        term.pop_history();
        expect(term.current_history()).toBe(undefined);

        expect(term.previous_history()).toBe(test_commands[1]);
        expect(term.previous_history()).toBe(test_commands[0]);

        term.pop_history();
        expect(term.current_history()).toBe(test_commands[0]);
        term.pop_history();
        expect(term.current_history()).toBe(undefined);

    });

    // PREVIOUS HISTORY TESTS
    it('should return to the last executed command on previous history call',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: Command[] = [{user_input: ["test1"]}, {user_input: ["test2"]}, {user_input: ["test3"]}];

        const term: Terminal = new Terminal(test_input);
        term.push_history(test_commands[0]);
        term.push_history(test_commands[1]);
        term.push_history(test_commands[2]);

        expect(term.previous_history()).toBe(test_commands[2]);
        expect(term.previous_history()).toBe(test_commands[1]);
        expect(term.previous_history()).toBe(test_commands[0]);
        expect(term.previous_history()).toBe(undefined);
    });
    it('should return undefined on previous history call with no command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term: Terminal = new Terminal(test_input);
        expect(term.previous_history()).toBe(undefined);
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
