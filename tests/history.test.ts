import { Terminal } from '../src/input-terminal';
import { Command, TermCommands } from '../src/commands';
import { HistoryCommand, TermHistory } from '../src/history';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isTerminal(target: any): boolean {
  return target instanceof Terminal;
}
function isHistory(target: any): boolean {
  return target instanceof TermHistory;
}

function tHistoryCommand(text: string): HistoryCommand {
    return new HistoryCommand([text], undefined, 0);
}

describe('input-terminal', () => {
    it('should construct a History object',  async () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const history = new TermHistory();
        expect(isHistory(history)).toBe(true);
    });


    // COMMAND HISTORY TESTS
    it('should have empty command history by default', async () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_history: HistoryCommand[] = [];

        const term = new Terminal(test_input);
        expect(term.history.list).toEqual([]);
    });
    it('should construct with custom command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_history: HistoryCommand[] = [tHistoryCommand("test")];

        const term: Terminal = new Terminal(test_input, test_history);
        expect(term.history.list).toBe(test_history);
    });

    // PUSH HISTORY TESTS
    it('should return the length of the command history on push',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_command: HistoryCommand = tHistoryCommand("test");

        const term: Terminal = new Terminal(test_input);
        expect(term.history.push(test_command)).toBe(1);
    });
    it('should push command to history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2")];

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_commands[0]);
        term.history.push(test_commands[1]);
        expect(term.history.list).toEqual([test_commands[1],test_commands[0]]);
    });
    it('should retain index in history if command is pushed',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_commands[0]);
        term.history.push(test_commands[1]);

        term.history.previous()

        term.history.push(test_commands[2]);
        expect(term.history.current()).toBe(test_commands[1]);
        expect(term.history.previous()).toBe(test_commands[0]);
    });

    // POP HISTORY TESTS
    it('should return the popped command on pop',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_command: HistoryCommand = tHistoryCommand("test");

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_command);
        expect(term.history.pop()).toBe(test_command);
    });
    it('should remove first command from history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2")];

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_commands[0]);
        term.history.push(test_commands[1]);
        term.history.pop()
        expect(term.history.list).toEqual([test_commands[0]]);
    });
    it('should retain index in history if command is popped',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_commands[0]);
        term.history.push(test_commands[1]);
        term.history.push(test_commands[2]);
        term.history.previous();

        term.history.pop();
        expect(term.history.current()).toBe(undefined);

        expect(term.history.previous()).toBe(test_commands[1]);
        expect(term.history.previous()).toBe(test_commands[0]);

        term.history.pop();
        expect(term.history.current()).toBe(test_commands[0]);
        term.history.pop();
        expect(term.history.current()).toBe(undefined);

    });

    // PREVIOUS HISTORY TESTS
    it('should return the last executed command on previous history call',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_commands[0]);
        term.history.push(test_commands[1]);
        term.history.push(test_commands[2]);

        expect(term.history.previous()).toBe(test_commands[2]);
        expect(term.history.previous()).toBe(test_commands[1]);
        expect(term.history.previous()).toBe(test_commands[0]);
        expect(term.history.previous()).toBe(test_commands[0]);
    });
    it('should return undefined on previous history call with no command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term: Terminal = new Terminal(test_input);
        expect(term.history.previous()).toBe(undefined);
    });

    // NEXT HISTORY TESTS
    it('should return the next executed command on next history call',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_commands[0]);
        term.history.push(test_commands[1]);
        term.history.push(test_commands[2]);

        expect(term.history.previous()).toBe(test_commands[2]);
        expect(term.history.previous()).toBe(test_commands[1]);
        expect(term.history.previous()).toBe(test_commands[0]);
        expect(term.history.next()).toBe(test_commands[1]);
        expect(term.history.next()).toBe(test_commands[2]);
        expect(term.history.next()).toBe(undefined);
        expect(term.history.next()).toBe(undefined);
    });
    it('should return undefined on next history call with no command history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term: Terminal = new Terminal(test_input);
        expect(term.history.next()).toBe(undefined);
    });
    it('should return undefined on next history call at top of history',  async () => {
        const dom: JSDOM = new JSDOM(`<!DOCTYPE html><input id=="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];

        const term: Terminal = new Terminal(test_input);
        term.history.push(test_commands[0]);
        term.history.push(test_commands[1]);
        term.history.push(test_commands[2]);

        expect(term.history.next()).toBe(undefined);
    });

});
