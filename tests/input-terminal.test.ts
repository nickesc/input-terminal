import { Terminal, Command, ExitObject, built_ins } from '../src/input-terminal';
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
        expect(term.started).toBe(true);
    });
    it('should not be started if not initialized',  () => {
        expect(term.started).toBe(false);
    });
    it('should initialize with a listener manager',  () => {
        expect(term.listeners).toBeDefined();
    });

    // INPUT TESTS
    it('should construct with correct input',  () => {
        expect(term.input).toBe(input);
    });
    it('should get the correct input value',  () => {
        term.updateInput("test");
        expect(term.getInputValue()).toBe("test");
    });

    // PREDICTION TESTS
    it('should return an empty array if no prediction is found', () => {
        expect(term.getPredictions("test")).toEqual([]);
    });
    it('should return the correct predictions', () => {
        term.bin.add(new Command("test1", (args, options, terminal) => {return true;}));
        term.bin.add(new Command("test2", (args, options, terminal) => {return true;}));
        expect(term.getPredictions("test")).toEqual(["test1", "test2"]);
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
        term.bin.add(new Command("test", (args, options, terminal) => {
            return [args,options]
        }))
        expect(term.executeCommand("test arg1 arg2 -o --option -value=x=10").output).toEqual([["arg1","arg2"],{o:{value:undefined},option:{value:undefined},value:{value:"x=10"}}]);
    });
    it('should parse option values correctly', () => {
        term.bin.add(new Command("test", (args, options, terminal) => {
            return [args,options]
        }))
        expect(term.executeCommand("test --val1=20 --val2='spaced value' -val3=x=10 --val4=true --val5=false").output).toEqual([[],{val1:{value:20},val2:{value:"spaced value"},val3:{value:"x=10"},val4:{value:true},val5:{value:false}}]);
    });

    // PROMPT TESTS
    it("should change the prompt", () => {
        term.options.prompt = ">> ";
        expect(term.options.prompt).toEqual(">> ");
    });
    it("should change the preprompt", () => {
        term.options.preprompt = ">> ";
        expect(term.options.preprompt).toEqual(">> ");
    });
    it("should still grab the correct raw input on exit with a custom prompt", () => {
        term.options.prompt = ">> ";
        term.options.preprompt = ">> ";
        expect(term.executeCommand("test").rawInput).toEqual("test");
    });

    // INSTALL BUILT-INS TESTS
    it("should have the correct number of installed built-ins", () => {
        term.init()
        expect(term.bin.list.length).toEqual(built_ins.length);
    });
    it("should install built-ins if set to true in options", () => {
        term.options.installBuiltins = true;
        term.init()
        expect(term.bin.list.length).toEqual(built_ins.length);
    });
    it("should not install built-ins if set to false in options", () => {
        term.options.installBuiltins = false;
        term.init()
        expect(term.bin.list.length).toEqual(0);
    });

    // COMMAND EXECUTION TESTS
    it('should return an ExitObject after execution', () => {
        term.bin.add(new Command("test", (args, options, terminal) => {
            return true
        }))
        expect(isExitObject(term.executeCommand("command"))).toBe(true);
    });
    it('should successfully execute a known command', () => {
        term.bin.add(new Command("test", (args, options, terminal) => {
            return true
        }))
        expect(term.executeCommand("test").exitCode).toEqual(0);
    });
    it('should fail to execute an unknown command', () => {
        expect(term.executeCommand("test").exitCode).toEqual(1);
    });
    it('should have an exit code of 0 for an empty command', () => {
        expect(term.executeCommand("").exitCode).toEqual(0);
        expect(term.executeCommand(" ").exitCode).toEqual(0);
        expect(term.executeCommand("  ").exitCode).toEqual(0);
    });
    it('should return the correct exit object', async () => {
        const command = new Command("test", (args, options, terminal) => {
            return true
        })
        term.bin.add(command)

        const executed = term.executeCommand("test")
        const testExit = new ExitObject(["test"], "test", command, 0, true)
        try {
            expect(executed).toEqual(testExit);
        } catch (error) {
            if (executed.timestamp !== testExit.timestamp) {
                console.warn("Timestamp mismatch")
                expect(executed.exitCode).toEqual(testExit.exitCode);
                expect(executed.output).toEqual(testExit.output);
                expect(executed.timestamp).toBeDefined();
                expect(executed.command).toEqual(testExit.command);
                expect(executed.userInput).toEqual(testExit.userInput);
                expect(executed.rawInput).toEqual(testExit.rawInput);
            } else {
                expect(executed).toEqual(testExit);
            }
        }
    });
    it('should get undefined as the last exit code on initialization', () => {
        expect(term.getLastExitObject()).toEqual(undefined);
    });
    it('should get the correct last exit code', () => {
        const exit = term.executeCommand("test")
        expect(term.getLastExitObject()).toEqual(exit);
    });

    it('should pass terminal correctly', () => {
        term.bin.add(new Command("test", (args, options, terminal) => {
            return terminal;
        }))
        expect(term.executeCommand("test").output).toBe(term);
    });
});
