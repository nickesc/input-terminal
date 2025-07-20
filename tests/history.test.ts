import { Terminal } from '../src/input-terminal';
import { HistoryCommand, TermHistory } from '../src/history';
import { describe, it, expect, beforeEach } from 'vitest';

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
        const history: TermHistory = new TermHistory();
        expect(isHistory(history)).toBe(true);
    });


    // COMMAND HISTORY TESTS
    it('should have empty command history by default', async () => {
        const test_history: HistoryCommand[] = [];
        const history: TermHistory = new TermHistory();
        expect(history.list).toEqual(test_history);
    });
    it('should construct with custom command history',  async () => {
        const test_history: HistoryCommand[] = [tHistoryCommand("test")];
        const history: TermHistory = new TermHistory(test_history);
        expect(history.list).toBe(test_history);
    });

    // PUSH HISTORY TESTS
    it('should return the length of the command history on push',  async () => {
        const test_command: HistoryCommand = tHistoryCommand("test");
        const history: TermHistory = new TermHistory();
        expect(history.push(test_command)).toBe(1);
    });
    it('should push command to history',  async () => {
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2")];
        const history: TermHistory = new TermHistory();

        history.push(test_commands[0]);
        history.push(test_commands[1]);
        expect(history.list).toEqual([test_commands[1],test_commands[0]]);
    });
    it('should retain index in history if command is pushed',  async () => {
        const test_history: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];
        const history: TermHistory = new TermHistory();

        history.push(test_history[0]);
        history.push(test_history[1]);

        history.previous()

        history.push(test_history[2]);
        expect(history.current()).toBe(test_history[1]);
        expect(history.previous()).toBe(test_history[0]);
    });

    // POP HISTORY TESTS
    it('should return the removed command on pop',  async () => {
        const test_command: HistoryCommand = tHistoryCommand("test");
        const history: TermHistory = new TermHistory();
        history.push(test_command);
        expect(history.pop()).toBe(test_command);
    });
    it('should remove first command from history',  async () => {
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2")];
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.pop()
        expect(history.list).toEqual([test_commands[0]]);
    });
    it('should retain index in history if command is popped',  async () => {
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];
        const history: TermHistory = new TermHistory(test_commands);
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.push(test_commands[2]);
        history.previous();

        history.pop();
        expect(history.current()).toBe(undefined);

        expect(history.previous()).toBe(test_commands[1]);
        expect(history.previous()).toBe(test_commands[0]);

        history.pop();
        expect(history.current()).toBe(test_commands[0]);
        history.pop();
        expect(history.current()).toBe(undefined);
    });

    // PREVIOUS HISTORY TESTS
    it('should return the last executed command on previous history call',  async () => {
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.push(test_commands[2]);

        expect(history.previous()).toBe(test_commands[2]);
        expect(history.previous()).toBe(test_commands[1]);
        expect(history.previous()).toBe(test_commands[0]);
        expect(history.previous()).toBe(test_commands[0]);
    });
    it('should return undefined on previous history call with no command history',  async () => {
        const history: TermHistory = new TermHistory();
        expect(history.previous()).toBe(undefined);
    });

    // NEXT HISTORY TESTS
    it('should return the next executed command on next history call',  async () => {
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.push(test_commands[2]);

        expect(history.previous()).toBe(test_commands[2]);
        expect(history.previous()).toBe(test_commands[1]);
        expect(history.previous()).toBe(test_commands[0]);
        expect(history.next()).toBe(test_commands[1]);
        expect(history.next()).toBe(test_commands[2]);
        expect(history.next()).toBe(undefined);
        expect(history.next()).toBe(undefined);
    });
    it('should return undefined on next history call with no command history',  async () => {
        const history: TermHistory = new TermHistory();
        expect(history.next()).toBe(undefined);
    });
    it('should return undefined on next history call at top of history',  async () => {
        const test_commands: HistoryCommand[] = [tHistoryCommand("test1"), tHistoryCommand("test2"), tHistoryCommand("test3")];
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.push(test_commands[2]);

        expect(history.next()).toBe(undefined);
    });

});
