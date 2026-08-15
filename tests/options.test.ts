import {Terminal} from "../src/input-terminal";
import type {TermOptions} from "../src/input-terminal";
import {describe, it, expect, beforeEach} from "vitest";
import {JSDOM} from "jsdom";

describe("Terminal Options Tests", () => {
    let terminal: Terminal;
    let input: HTMLInputElement;

    const customOptions = {
        previousKey: "Up",
        nextKey: "Down",
        returnKey: "Return",
        autocompleteKey: "Tabulator",
        prompt: "prompt",
        preprompt: "preprompt",
        printCommand: true,
        installBuiltins: false,
        addEmptyCommandToHistory: true,
        showDuplicateCommands: true,
    };

    beforeEach(() => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        terminal = new Terminal({input});
    });

    it("should construct with default options", () => {
        const options: TermOptions = terminal.options;
        expect(options.previousKey).toEqual("ArrowUp");
        expect(options.nextKey).toEqual("ArrowDown");
        expect(options.returnKey).toEqual("Enter");
        expect(options.autocompleteKey).toEqual("Tab");
        expect(options.preprompt).toEqual("");
        expect(options.prompt).toEqual("> ");
        expect(options.installBuiltins).toEqual(true);
        expect(options.printCommand).toEqual(false);
        expect(options.addEmptyCommandToHistory).toEqual(false);
        expect(options.showDuplicateCommands).toEqual(false);
    });

    it("should construct with custom options", () => {
        terminal = new Terminal({input, options: customOptions});
        const options = terminal.options;
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.returnKey).toEqual(customOptions.returnKey);
        expect(options.autocompleteKey).toEqual(customOptions.autocompleteKey);
        expect(options.preprompt).toEqual(customOptions.preprompt);
        expect(options.prompt).toEqual(customOptions.prompt);
        expect(options.installBuiltins).toEqual(customOptions.installBuiltins);
        expect(options.printCommand).toEqual(customOptions.printCommand);
        expect(options.addEmptyCommandToHistory).toEqual(customOptions.addEmptyCommandToHistory);
        expect(options.showDuplicateCommands).toEqual(customOptions.showDuplicateCommands);
    });

    it("should construct with partial custom options", () => {
        const customOptions = {
            previousKey: "PageUp",
            nextKey: "PageDown",
        };
        terminal = new Terminal({input, options: customOptions});
        const options = terminal.options;
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.returnKey).toEqual("Enter");
    });
    it("should store custom options", () => {
        terminal = new Terminal({input, options: {myCustomOption: "custom value"}});
        expect(terminal.options.myCustomOption).toEqual("custom value");
    });

    it("should expose frozen option snapshots", () => {
        expect(Object.isFrozen(terminal.options)).toBe(true);
        expect(() => Object.assign(terminal.options, {prompt: ">> "})).toThrow(TypeError);
    });

    it("should replace the option snapshot when options are updated", () => {
        const previousOptions = terminal.options;
        terminal.updateOptions({prompt: ">> "});
        expect(terminal.options).not.toBe(previousOptions);
        expect(previousOptions.prompt).toBe("> ");
        expect(terminal.options.prompt).toBe(">> ");
    });
});
