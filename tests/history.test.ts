import { ExitObject, TermHistory } from '../src/history';
import { describe, it, expect, beforeEach } from 'vitest';

function isHistory(target: any): boolean {
  return target instanceof TermHistory;
}

function tExitObject(text: string): ExitObject {
    return new ExitObject([text], undefined, 0, {});
}

let test_commands: ExitObject[];

describe('input-terminal', () => {
    beforeEach(() => {
        test_commands = [tExitObject("test1"), tExitObject("test2"), tExitObject("test3")];
    });

    // CONSTRUCTION TEST
    it('should construct a History object',  () => {
        const history: TermHistory = new TermHistory();
        expect(isHistory(history)).toBe(true);
    });


    // COMMAND HISTORY TESTS
    it('should have empty command history by default', () => {
        const test_history: ExitObject[] = [];
        const history: TermHistory = new TermHistory();
        expect(history.items).toEqual(test_history);
    });
    it('should construct with custom command history',  () => {
        const history: TermHistory = new TermHistory(test_commands);
        expect(history.items).toBe(test_commands);
    });
    it('should set custom command history',  () => {
        const history: TermHistory = new TermHistory();
        history.items = test_commands;
        expect(history.items).toEqual(test_commands);
    });


    // PUSH HISTORY TESTS
    it('should return the length of the command history on push',  () => {
        const history: TermHistory = new TermHistory();
        expect(history.push(test_commands[0])).toBe(1);
    });
    it('should push command to history',  () => {
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        expect(history.items).toEqual([test_commands[1],test_commands[0]]);
    });
    it('should retain index in history when command is pushed',  () => {
        const history: TermHistory = new TermHistory();

        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.previous()

        history.push(test_commands[2]);
        expect(history.current()).toBe(test_commands[1]);
        expect(history.previous()).toBe(test_commands[0]);
    });


    // POP HISTORY TESTS
    it('should return the removed command on pop',  () => {
        const history: TermHistory = new TermHistory([test_commands[0]]);
        expect(history.pop()).toBe(test_commands[0]);
    });
    it('should remove first command from history',  () => {
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.pop()
        expect(history.items).toEqual([test_commands[0]]);
    });
    it('should retain index in history if command is popped',  () => {
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
    it('should return the last executed command on previous history call',  () => {
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.push(test_commands[2]);

        expect(history.previous()).toBe(test_commands[2]);
        expect(history.previous()).toBe(test_commands[1]);
        expect(history.previous()).toBe(test_commands[0]);
        expect(history.previous()).toBe(test_commands[0]);
    });
    it('should return undefined on previous history call with no command history',  () => {
        const history: TermHistory = new TermHistory();
        expect(history.previous()).toBe(undefined);
    });


    // NEXT HISTORY TESTS
    it('should return the next executed command on next history call',  () => {
        const history: TermHistory = new TermHistory();
        history.push(test_commands[0]);
        history.push(test_commands[1]);
        history.push(test_commands[2]);

        history.previous()
        history.previous()
        history.previous()
        expect(history.next()).toBe(test_commands[1]);
        expect(history.next()).toBe(test_commands[2]);
        expect(history.next()).toBe(undefined);
        expect(history.next()).toBe(undefined);
    });
    it('should return undefined on next history call with no command history',  () => {
        const history: TermHistory = new TermHistory();
        expect(history.next()).toBe(undefined);
    });
    it('should return undefined on next history call at top of history',  () => {
        const history: TermHistory = new TermHistory(test_commands);
        expect(history.next()).toBe(undefined);
    });

});
