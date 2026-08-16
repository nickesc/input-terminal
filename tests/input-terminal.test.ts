import {Terminal, Command, ExitObject, built_ins} from "../src/input-terminal";
import type {CompletionProvider} from "../src/input-terminal";
import {describe, it, expect, beforeEach} from "vitest";
import {JSDOM} from "jsdom";

describe("Terminal Construction Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should construct a Terminal object", () => {
        expect(term).toBeInstanceOf(Terminal);
    });

    it("should construct with command history and commands", () => {
        const historyEntry = new ExitObject(["previous"], "previous", undefined, 0, {});
        const command = new Command("configured", () => ({}));

        const configuredTerm = new Terminal({
            input,
            history: [historyEntry],
            commands: [command],
        });

        expect(configuredTerm.history.items).toEqual([historyEntry]);
        expect(configuredTerm.bin.list).toEqual([command]);
    });
});

describe("Terminal Initialization Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should initialize and mark itself started", () => {
        term.init();
        expect(term.started).toBe(true);
    });
    it("should not be started if not initialized", () => {
        expect(term.started).toBe(false);
    });
    it("should initialize with a listener manager", () => {
        expect(term.listeners).toBeDefined();
    });
    it("should destroy and mark itself not started", () => {
        term.init();
        term.destroy();
        expect(term.started).toBe(false);
    });
    it("should initialize again after destroy without duplicating built-ins", () => {
        term.init();
        term.destroy();
        term.init();
        expect(term.started).toBe(true);
        expect(term.bin.list.length).toEqual(built_ins.length);
    });
});

describe("Terminal Input Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should construct with correct input", () => {
        expect(term.input).toBe(input);
    });
    it("should get the correct input value", () => {
        term.updateInput("test");
        expect(term.getInputValue()).toBe("test");
    });
});

describe("Terminal Prediction Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should return an empty array if no prediction is found", () => {
        expect(term.getPredictions("test")).toEqual([]);
    });
    it("should return the correct predictions", () => {
        term.bin.add(
            new Command("test1", (args, options, terminal) => {
                return true;
            }),
        );
        term.bin.add(
            new Command("test2", (args, options, terminal) => {
                return true;
            }),
        );
        expect(term.getPredictions("test")).toEqual(["test1", "test2"]);
    });

    it("should return custom predictions with the full input and cursor", () => {
        const completionProvider: CompletionProvider = ({input: providerInput, cursor, terminal}) => {
            expect(providerInput).toBe("cd projects/in");
            expect(cursor).toBe(11);
            expect(terminal).toBe(term);
            return ["cd projects/input-terminal"];
        };
        term = new Terminal({input, completionProvider});

        expect(term.getPredictions("cd projects/in", 11)).toEqual(["cd projects/input-terminal"]);
    });

    it("should fall back to command-name predictions when the provider returns undefined", () => {
        term = new Terminal({input, completionProvider: () => undefined});
        term.bin.add(new Command("testcmd", () => undefined));

        expect(term.getPredictions("test")).toEqual(["testcmd"]);
    });

    it("should not fall back when the provider returns no matches", () => {
        term = new Terminal({input, completionProvider: () => []});
        term.bin.add(new Command("testcmd", () => undefined));

        expect(term.getPredictions("test")).toEqual([]);
    });
});

describe("Terminal Input Array Parse Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should correctly parse quoted values", () => {
        expect(term.getInputArray('command "quote" "multi word quote" \'single quote\' `backtick` unquote')).toEqual([
            "command",
            "quote",
            "multi word quote",
            "single quote",
            "backtick",
            "unquote",
        ]);
    });
    it("should correctly parse quoted values with nested quotes", () => {
        expect(term.getInputArray('command "quote `nested quote`"')).toEqual(["command", "quote `nested quote`"]);
    });
    it("should correctly parse prepended backslashes to not end or start strings", () => {
        expect(term.getInputArray("command `quote\\`` \\`quote unstarted\\`")).toEqual([
            "command",
            "quote`",
            "`quote",
            "unstarted`",
        ]);
    });
    it("should recognize empty quoted strings as input values", () => {
        expect(term.getInputArray('command ""')).toEqual(["command", ""]);
    });
    it("should parse options and arguments correctly", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return [args, options];
            }),
        );
        expect(term.executeCommand("test arg1 arg2 -o --option --value=x=10").output).toEqual([
            ["arg1", "arg2"],
            {o: {value: undefined}, option: {value: undefined}, value: {value: "x=10"}},
        ]);
    });
    it("should parse option values correctly", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return [args, options];
            }),
        );
        expect(
            term.executeCommand("test --val1=20 --val2='spaced value' --val3=x=10 --val4=true --val5=false").output,
        ).toEqual([
            [],
            {
                val1: {value: 20},
                val2: {value: "spaced value"},
                val3: {value: "x=10"},
                val4: {value: true},
                val5: {value: false},
            },
        ]);
    });
});

describe("Terminal Prompt Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should change the prompt", () => {
        term.updateOptions({prompt: ">> "});
        expect(term.options.prompt).toEqual(">> ");
    });
    it("should change the preprompt", () => {
        term.updateOptions({preprompt: ">> "});
        expect(term.options.preprompt).toEqual(">> ");
    });
    it("should preserve unfinished input when changing to a longer prompt", () => {
        term.init();
        term.updateInput("echo unfinished");

        term.updateOptions({prompt: "terminal >> "});

        expect(input.value).toBe("terminal >> echo unfinished");
        expect(term.getInputValue()).toBe("echo unfinished");
    });
    it("should preserve unfinished input when changing to a shorter prompt", () => {
        term.updateOptions({prompt: "terminal >> "});
        term.init();
        term.updateInput("echo unfinished");

        term.updateOptions({prompt: "$ "});

        expect(input.value).toBe("$ echo unfinished");
        expect(term.getInputValue()).toBe("echo unfinished");
    });
    it("should preserve unfinished input when changing the prompt and preprompt together", () => {
        term.init();
        term.updateInput("echo unfinished");

        term.updateOptions({prompt: "$ ", preprompt: "[user] "});

        expect(input.value).toBe("[user] $ echo unfinished");
        expect(term.getInputValue()).toBe("echo unfinished");
    });
    it("should not redraw the input before initialization", () => {
        input.value = "existing value";

        term.updateOptions({prompt: "$ "});

        expect(input.value).toBe("existing value");
        expect(term.options.prompt).toBe("$ ");
    });
    it("should still grab the correct raw input on exit with a custom prompt", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return;
            }),
        );
        term.updateOptions({prompt: ">> ", preprompt: ">> "});
        expect(term.executeCommand("test").rawInput).toEqual("test");
    });
});

describe("Terminal Install Built-Ins Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should install built-ins by default", () => {
        term.init();
        expect(term.bin.list.length).toEqual(built_ins.length);
    });
    it("should install built-ins when enabled via constructor options", () => {
        term = new Terminal({input, options: {installBuiltins: true}});
        term.init();
        expect(term.bin.list.length).toEqual(built_ins.length);
    });
    it("should install built-ins if set to true in options", () => {
        term.updateOptions({installBuiltins: true});
        term.init();
        expect(term.bin.list.length).toEqual(built_ins.length);
    });
    it("should not install built-ins if set to false in options", () => {
        term.updateOptions({installBuiltins: false});
        term.init();
        expect(term.bin.list.length).toEqual(0);
    });
    it("should not install built-ins before initialization", () => {
        term.updateOptions({installBuiltins: true});
        expect(term.bin.list.length).toEqual(0);
    });
});

describe("Terminal Command Execution Tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal({input});
    });

    it("should return an ExitObject after execution", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return true;
            }),
        );
        expect(term.executeCommand("test")).toBeInstanceOf(ExitObject);
    });
    it("should successfully execute a known command", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return true;
            }),
        );
        expect(term.executeCommand("test").exitCode).toEqual(0);
    });
    it("should fail to execute an unknown command and log an error", () => {
        expect(term.executeCommand("test").exitCode).toEqual(1);
    });
    it("should have an exit code of 0 for an empty command", () => {
        expect(term.executeCommand("").exitCode).toEqual(0);
        expect(term.executeCommand(" ").exitCode).toEqual(0);
        expect(term.executeCommand("  ").exitCode).toEqual(0);
    });
    it("should return the correct exit object", async () => {
        const command = new Command("test", (args, options, terminal) => {
            return true;
        });
        term.bin.add(command);

        const executed = term.executeCommand("test");
        const testExit = new ExitObject(["test"], "test", command, 0, true);
        try {
            expect(executed).toEqual(testExit);
        } catch (error) {
            if (executed.timestamp !== testExit.timestamp) {
                console.warn("Timestamp mismatch");
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
    it("should get undefined as the last exit code on initialization", () => {
        expect(term.getLastExitObject()).toEqual(undefined);
    });
    it("should get the correct last exit code", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return;
            }),
        );
        const exit = term.executeCommand("test");
        expect(term.getLastExitObject()).toEqual(exit);
    });

    it("should emit executed with the returned ExitObject", () => {
        term.bin.add(new Command("test", () => true));
        const events: CustomEvent<ExitObject>[] = [];

        term.addEventListener("executed", (event) => {
            events.push(event as CustomEvent<ExitObject>);
        });

        const exit = term.executeCommand("test");

        expect(events).toHaveLength(1);
        expect(events[0]?.type).toBe("executed");
        expect(events[0]?.detail).toBe(exit);
    });

    it("should emit executed after history is updated and reset", () => {
        term.bin.add(new Command("test", () => true));
        term.history.push(new ExitObject(["previous"], "previous", undefined, 0, true));
        term.history.previous();
        let historyEntry: ExitObject | undefined;
        let currentHistoryEntry: ExitObject | undefined;

        term.addEventListener("executed", () => {
            historyEntry = term.history.items[0];
            currentHistoryEntry = term.history.current();
        });

        const exit = term.executeCommand("test");

        expect(historyEntry).toBe(exit);
        expect(currentHistoryEntry).toBeUndefined();
    });

    it("should stop notifying an executed listener after it is removed", () => {
        term.bin.add(new Command("test", () => true));
        let callCount = 0;
        const listener = (event: CustomEvent<ExitObject>) => {
            expect(event.detail).toBeInstanceOf(ExitObject);
            callCount++;
        };

        term.addEventListener("executed", listener);
        term.executeCommand("test");
        term.removeEventListener("executed", listener);
        term.executeCommand("test");

        expect(callCount).toBe(1);
    });

    it("should pass terminal correctly", () => {
        term.bin.add(
            new Command("test", (args, options, terminal) => {
                return terminal;
            }),
        );
        expect(term.executeCommand("test").output).toBe(term);
    });
});
