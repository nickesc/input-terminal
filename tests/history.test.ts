import {TermHistory, ExitObject, Terminal} from "../src/input-terminal";
import {describe, it, expect, beforeEach} from "vitest";
import {JSDOM} from "jsdom";

function tExitObject(text: string): ExitObject {
    return new ExitObject([text], text, undefined, 0, {});
}

let testCommands: ExitObject[];

describe("TermHistory Tests", () => {
    beforeEach(() => {
        testCommands = [tExitObject("test1"), tExitObject("test2"), tExitObject("test3")];
    });

    // CONSTRUCTION TEST
    it("should construct a History object", () => {
        const history: TermHistory = new TermHistory();
        expect(history).toBeInstanceOf(TermHistory);
    });
});

describe("TermHistory Command History Tests", () => {
    beforeEach(() => {
        testCommands = [tExitObject("test1"), tExitObject("test2"), tExitObject("test3")];
    });

    it("should have empty command history by default", () => {
        const testHistory: ExitObject[] = [];
        const history: TermHistory = new TermHistory();
        expect(history.items).toEqual(testHistory);
    });
    it("should construct with custom command history", () => {
        const history: TermHistory = new TermHistory(testCommands);
        expect(history.items).toBe(testCommands);
    });
    it("should set custom command history", () => {
        const history: TermHistory = new TermHistory();
        history.items = testCommands;
        expect(history.items).toEqual(testCommands);
    });
});

describe("TermHistory Push History Tests", () => {
    beforeEach(() => {
        testCommands = [tExitObject("test1"), tExitObject("test2"), tExitObject("test3")];
    });

    it("should return the length of the command history on push", () => {
        const history: TermHistory = new TermHistory();
        expect(history.push(testCommands[0])).toBe(1);
    });
    it("should push command to history", () => {
        const history: TermHistory = new TermHistory();
        history.push(testCommands[0]);
        history.push(testCommands[1]);
        expect(history.items).toEqual([testCommands[1], testCommands[0]]);
    });
    it("should retain index in history when command is pushed", () => {
        const history: TermHistory = new TermHistory();

        history.push(testCommands[0]);
        history.push(testCommands[1]);
        history.previous();

        history.push(testCommands[2]);
        expect(history.current()).toBe(testCommands[1]);
        expect(history.previous()).toBe(testCommands[0]);
    });
    it("should push multiple commands to history", () => {
        const history: TermHistory = new TermHistory();
        const testItem: ExitObject = new ExitObject(["test"], "test", undefined, 0, {});
        history.push(testItem);
        history.push(testCommands);
        expect(history.items).toEqual([...testCommands, testItem]);
    });
});

describe("TermHistory Pop History Tests", () => {
    beforeEach(() => {
        testCommands = [tExitObject("test1"), tExitObject("test2"), tExitObject("test3")];
    });

    it("should return the removed command on pop", () => {
        const history: TermHistory = new TermHistory([testCommands[0]]);
        expect(history.pop()).toBe(testCommands[0]);
    });
    it("should remove first command from history", () => {
        const history: TermHistory = new TermHistory();
        history.push(testCommands[0]);
        history.push(testCommands[1]);
        history.pop();
        expect(history.items).toEqual([testCommands[0]]);
    });
    it("should retain index in history if command is popped", () => {
        const history: TermHistory = new TermHistory(testCommands);
        history.push(testCommands[0]);
        history.push(testCommands[1]);
        history.push(testCommands[2]);
        history.previous();

        history.pop();
        expect(history.current()).toBe(undefined);
        expect(history.previous()).toBe(testCommands[1]);
        expect(history.previous()).toBe(testCommands[0]);

        history.pop();
        expect(history.current()).toBe(testCommands[0]);
        history.pop();
        expect(history.current()).toBe(undefined);
    });
});

describe("TermHistory Previous History Tests", () => {
    beforeEach(() => {
        testCommands = [tExitObject("test1"), tExitObject("test2"), tExitObject("test3")];
    });

    it("should return the last executed command on previous history call", () => {
        const history: TermHistory = new TermHistory();
        history.push(testCommands[0]);
        history.push(testCommands[1]);
        history.push(testCommands[2]);

        expect(history.previous()).toBe(testCommands[2]);
        expect(history.previous()).toBe(testCommands[1]);
        expect(history.previous()).toBe(testCommands[0]);
        expect(history.previous()).toBe(null);
    });
    it("should return undefined on previous history call with no command history", () => {
        const history: TermHistory = new TermHistory();
        expect(history.previous()).toBe(undefined);
    });
});

describe("TermHistory Next History Tests", () => {
    beforeEach(() => {
        testCommands = [tExitObject("test1"), tExitObject("test2"), tExitObject("test3")];
    });

    it("should return the next executed command on next history call", () => {
        const history: TermHistory = new TermHistory();
        history.push(testCommands[0]);
        history.push(testCommands[1]);
        history.push(testCommands[2]);

        history.previous();
        history.previous();
        history.previous();
        expect(history.next()).toBe(testCommands[1]);
        expect(history.next()).toBe(testCommands[2]);
        expect(history.next()).toBe(undefined);
        expect(history.next()).toBe(undefined);
    });
    it("should return undefined on next history call with no command history", () => {
        const history: TermHistory = new TermHistory();
        expect(history.next()).toBe(undefined);
    });
    it("should return undefined on next history call at top of history", () => {
        const history: TermHistory = new TermHistory(testCommands);
        expect(history.next()).toBe(undefined);
    });
});

describe("TermHistory Empty Command History Tests", () => {
    let terminal: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        terminal = new Terminal(input);
        terminal.init();
    });

    it("should not add an empty command to history when addEmptyCommandToHistory is disabled", () => {
        terminal.options.addEmptyCommandToHistory = false;
        terminal.updateInput("");
        const event = new dom.window.KeyboardEvent("keydown", {key: "Enter"});
        input.dispatchEvent(event);
        expect(terminal.history.items.length).toBe(0);
    });

    it("should add an empty command to history when addEmptyCommandToHistory is enabled", () => {
        terminal.options.addEmptyCommandToHistory = true;
        terminal.updateInput("");
        const event = new dom.window.KeyboardEvent("keydown", {key: "Enter"});
        input.dispatchEvent(event);
        expect(terminal.history.items.length).toBe(1);
    });
});
