import { Terminal } from '../src/input-terminal';
import { Command } from '../src/commands';
import { ExitObject } from '../src/commands';
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

    // INPUT ARRAY PARSE TESTS
    it('should correctly parse quoted values', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.getInputArray('command "quote" "multi word quote" \'single quote\' `backtick` unquote')).toEqual(["command", "quote", "multi word quote", "single quote", "backtick", "unquote"]);
    });
    it('should correctly parse quoted values with nested quotes', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.getInputArray('command "quote `nested quote`"')).toEqual(["command", "quote `nested quote`"]);
    });
    it('should correctly parse prepended backslashes to not end or start strings', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.getInputArray('command `quote\\`` \\`quote unstarted\\`')).toEqual(["command", "quote`", "`quote", "unstarted`"]);
    });
    it('should recognize empty quoted strings as input values', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.getInputArray('command ""')).toEqual(["command", ""]);
    });
    it('should parse options and arguments correctly', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        term.commands.add(new Command("test", (args, options, terminal) => {
            return [args,options]
        }))
        expect(term.execute_command("test arg1 arg2 -o --option -value=x=10").output).toEqual([["arg1","arg2"],{o:{value:undefined},option:{value:undefined},value:{value:"x=10"}}]);
    });
    it('should parse option values correctly', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        term.commands.add(new Command("test", (args, options, terminal) => {
            return [args,options]
        }))
        expect(term.execute_command("test --val1=20 --val2='spaced value' -val3=x=10").output).toEqual([[],{val1:{value:"20"},val2:{value:"spaced value"},val3:{value:"x=10"}}]);
    });


    // COMMAND EXECUTION TESTS
    it('should return an ExitObject after execution', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        term.commands.add(new Command("test", (args, options, terminal) => {
            return true
        }))
        expect(isExitObject(term.execute_command("command"))).toBe(true);
    });
    it('should successfully execute a known command', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        term.commands.add(new Command("test", (args, options, terminal) => {
            return true
        }))
        expect(term.execute_command("test").exit_code).toEqual(0);
    });
    it('should fail to execute an unknown command', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.execute_command("test").exit_code).toEqual(1);
    });
    it('should have an exit code of 0 for an empty command', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        expect(term.execute_command("").exit_code).toEqual(0);
        expect(term.execute_command(" ").exit_code).toEqual(0);
        expect(term.execute_command("  ").exit_code).toEqual(0);
    });
    it('should return the correct exit object', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        const command = new Command("test", (args, options, terminal) => {
            return true
        })
        term.commands.add(command)
        expect(term.execute_command("test")).toEqual(new ExitObject(["test"], command, 0, true));
    });

    it('should pass terminal correctly', () => {
        const dom = new JSDOM(`<!DOCTYPE html><input id="test"></input>`);
        const test_input = dom.window.document.getElementById("test") as HTMLInputElement;

        const term = new Terminal(test_input);
        term.commands.add(new Command("test", (args, options, terminal) => {
            return terminal;
        }))
        expect(term.execute_command("test").output).toBe(term);
    });
});
