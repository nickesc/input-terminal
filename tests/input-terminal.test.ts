import { Terminal, Command, ExitObject } from '../src/input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isTerminal(target: any): boolean {
  return target instanceof Terminal;
}

function isExitObject(target: any): boolean {
  return target instanceof ExitObject;
}


describe('Terminal Tests', () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById('terminal-input') as HTMLInputElement;
        term = new Terminal(input);
    });

    it('should construct a Terminal object',  () => {
        expect(isTerminal(term)).toBe(true);
    });


    // INITIALIZATION TESTS
    it('should initialize and mark itself started',  () => {
        term.init();
        expect(term.is_started()).toBe(true);
    });
    it('should initialize and mark itself started',  () => {
        term.init();
        expect(term.is_started()).toBe(true);
    });

    // INPUT TESTS
    it('should construct with correct input',  () => {
        expect(term.input).toBe(input);
    });

    // PREDICTION TESTS
    it('should return a prediction as a string', () => {
        expect(typeof term.get_prediction("test")).toBe("string");
    });

    // INPUT ARRAY PARSE TESTS
    it('should correctly parse quoted values', () => {
        expect(term.getInputArray('command "quote" "multi word quote" \'single quote\' `backtick` unquote')).toEqual(["command", "quote", "multi word quote", "single quote", "backtick", "unquote"]);
    });
    it('should correctly parse quoted values with nested quotes', () => {
        expect(term.getInputArray('command "quote `nested quote`"')).toEqual(["command", "quote `nested quote`"]);
    });
    it('should correctly parse prepended backslashes to not end or start strings', () => {
        expect(term.getInputArray('command `quote\\`` \\`quote unstarted\\`')).toEqual(["command", "quote`", "`quote", "unstarted`"]);
    });
    it('should recognize empty quoted strings as input values', () => {
        expect(term.getInputArray('command ""')).toEqual(["command", ""]);
    });
    it('should parse options and arguments correctly', () => {
        term.commands.add(new Command("test", (args, options, terminal) => {
            return [args,options]
        }))
        expect(term.execute_command("test arg1 arg2 -o --option -value=x=10").output).toEqual([["arg1","arg2"],{o:{value:undefined},option:{value:undefined},value:{value:"x=10"}}]);
    });
    it('should parse option values correctly', () => {
        term.commands.add(new Command("test", (args, options, terminal) => {
            return [args,options]
        }))
        expect(term.execute_command("test --val1=20 --val2='spaced value' -val3=x=10").output).toEqual([[],{val1:{value:"20"},val2:{value:"spaced value"},val3:{value:"x=10"}}]);
    });


    // COMMAND EXECUTION TESTS
    it('should return an ExitObject after execution', () => {
        term.commands.add(new Command("test", (args, options, terminal) => {
            return true
        }))
        expect(isExitObject(term.execute_command("command"))).toBe(true);
    });
    it('should successfully execute a known command', () => {
        term.commands.add(new Command("test", (args, options, terminal) => {
            return true
        }))
        expect(term.execute_command("test").exit_code).toEqual(0);
    });
    it('should fail to execute an unknown command', () => {
        expect(term.execute_command("test").exit_code).toEqual(1);
    });
    it('should have an exit code of 0 for an empty command', () => {
        expect(term.execute_command("").exit_code).toEqual(0);
        expect(term.execute_command(" ").exit_code).toEqual(0);
        expect(term.execute_command("  ").exit_code).toEqual(0);
    });
    it('should return the correct exit object', () => {
        const command = new Command("test", (args, options, terminal) => {
            return true
        })
        term.commands.add(command)
        expect(term.execute_command("test")).toEqual(new ExitObject(["test"], command, 0, true));
    });
    it('should get undefined as the last exit code on initialization', () => {
        expect(term.lastExitCode).toEqual(undefined);
    });
    it('should get the correct last exit code', () => {
        term.execute_command("test")
        expect(term.lastExitCode).toEqual(1);
    });

    it('should pass terminal correctly', () => {
        term.commands.add(new Command("test", (args, options, terminal) => {
            return terminal;
        }))
        expect(term.execute_command("test").output).toBe(term);
    });
});
