import { Terminal } from '../src/input-terminal';
import { Command } from '../src/command';
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
        const test_history: HistoryCommand[] = [];

        const term = new Terminal(test_input);
        expect(term.commandHistory.history).toEqual([]);
    });
    it('should construct with custom command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_history: HistoryCommand[] = [tHistoryCommand("test")];

        const term: Terminal = new Terminal(test_input, test_history);
        expect(term.commandHistory.history).toBe(test_history);
    });

    // PUSH HISTORY TESTS
    it('should return the length of the command history on push',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_command: HistoryCommand = tHistoryCommand("test");

        const term: Terminal = new Terminal(test_input);
        expect(term.commandHistory.push_history(test_command)).toBe(1);
    });
    it('should push command to history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2")];

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_commands[0]);
        term.commandHistory.push_history(test_commands[1]);
        expect(term.commandHistory.history).toEqual([test_commands[1],test_commands[0]]);
    });
    it('should retain index in history if command is pushed',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_commands[0]);
        term.commandHistory.push_history(test_commands[1]);

        term.commandHistory.previous_history()

        term.commandHistory.push_history(test_commands[2]);
        expect(term.commandHistory.current_history()).toBe(test_commands[1]);
        expect(term.commandHistory.previous_history()).toBe(test_commands[0]);
    });

    // POP HISTORY TESTS
    it('should return the popped command on pop',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_command: HistoryCommand = tHistoryCommand("test");

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_command);
        expect(term.commandHistory.pop_history()).toBe(test_command);
    });
    it('should remove first command from history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2")];

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_commands[0]);
        term.commandHistory.push_history(test_commands[1]);
        term.commandHistory.pop_history()
        expect(term.commandHistory.history).toEqual([test_commands[0]]);
    });
    it('should retain index in history if command is popped',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_commands[0]);
        term.commandHistory.push_history(test_commands[1]);
        term.commandHistory.push_history(test_commands[2]);
        term.commandHistory.previous_history();

        term.commandHistory.pop_history();
        expect(term.commandHistory.current_history()).toBe(undefined);

        expect(term.commandHistory.previous_history()).toBe(test_commands[1]);
        expect(term.commandHistory.previous_history()).toBe(test_commands[0]);

        term.commandHistory.pop_history();
        expect(term.commandHistory.current_history()).toBe(test_commands[0]);
        term.commandHistory.pop_history();
        expect(term.commandHistory.current_history()).toBe(undefined);

    });

    // PREVIOUS HISTORY TESTS
    it('should return the last executed command on previous history call',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_commands[0]);
        term.commandHistory.push_history(test_commands[1]);
        term.commandHistory.push_history(test_commands[2]);

        expect(term.commandHistory.previous_history()).toBe(test_commands[2]);
        expect(term.commandHistory.previous_history()).toBe(test_commands[1]);
        expect(term.commandHistory.previous_history()).toBe(test_commands[0]);
        expect(term.commandHistory.previous_history()).toBe(test_commands[0]);
    });
    it('should return undefined on previous history call with no command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term: Terminal = new Terminal(test_input);
        expect(term.commandHistory.previous_history()).toBe(undefined);
    });

    // NEXT HISTORY TESTS
    it('should return the next executed command on next history call',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_commands[0]);
        term.commandHistory.push_history(test_commands[1]);
        term.commandHistory.push_history(test_commands[2]);

        expect(term.commandHistory.previous_history()).toBe(test_commands[2]);
        expect(term.commandHistory.previous_history()).toBe(test_commands[1]);
        expect(term.commandHistory.previous_history()).toBe(test_commands[0]);
        expect(term.commandHistory.next_history()).toBe(test_commands[1]);
        expect(term.commandHistory.next_history()).toBe(test_commands[2]);
        expect(term.commandHistory.next_history()).toBe(undefined);
        expect(term.commandHistory.next_history()).toBe(undefined);
    });
    it('should return undefined on next history call with no command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term: Terminal = new Terminal(test_input);
        expect(term.commandHistory.next_history()).toBe(undefined);
    });
    it('should return undefined on next history call at top of history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.commandHistory.push_history(test_commands[0]);
        term.commandHistory.push_history(test_commands[1]);
        term.commandHistory.push_history(test_commands[2]);

        expect(term.commandHistory.next_history()).toBe(undefined);
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
