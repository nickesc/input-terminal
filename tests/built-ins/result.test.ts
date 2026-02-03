import {Terminal, ExitObject} from "../../src/input-terminal";
import {result} from "../../src/built-ins/result.ts";
import {return_} from "../../src/built-ins/return.ts";
import {echo} from "../../src/built-ins/echo.ts";
import {describe, it, expect, beforeEach} from "vitest";
import {JSDOM} from "jsdom";

function isExitObject(target: any): boolean {
    return target instanceof ExitObject;
}

describe("result command tests", () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById("terminal-input") as HTMLInputElement;
        term = new Terminal(input);
        term.init();
        term.executeCommand("return");
        term.executeCommand("echo 1");
        term.executeCommand("echo 2");
        term.executeCommand("result");
    });

    it("should run the result command", () => {
        const exit: ExitObject = result.run(["result"], "result", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result"]);
        expect(isExitObject(exit.output)).toBe(true);
    });

    it("should run the result command with arguments", () => {
        const exit: ExitObject = result.run(["result", "x"], "result x", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "x"]);
        expect(isExitObject(exit.output)).toBe(true);
    });

    it("should have manual page", () => {
        expect(result.manual).toBeDefined();
        expect(result.manual?.length).toBeGreaterThan(0);
    });

    it("should return the last command's exit object", () => {
        const exit: ExitObject = result.run(["result", "-l"], "result -l", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "-l"]);
        expect(isExitObject(exit.output)).toBe(true);
        expect(exit.output.command).toEqual(result);
    });

    it("should return the first command's exit object", () => {
        const exit: ExitObject = result.run(["result", "-f"], "result -f", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "-f"]);
        expect(isExitObject(exit.output)).toBe(true);
        expect(exit.output.command).toEqual(return_);
    });

    it("should return the command at the given index", () => {
        const exit: ExitObject = result.run(["result", "-i=1"], "result -i=1", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "-i=1"]);
        expect(isExitObject(exit.output)).toBe(true);
        expect(exit.output.command).toEqual(echo);
    });

    it("should return an error for an out-of-bounds index", () => {
        const exit: ExitObject = result.run(["result", "--index=100"], "result --index=100", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "--index=100"]);
        expect(isExitObject(exit.output)).toBe(false);
        expect(exit.output.error).toEqual("Invalid index");
    });

    it("should return an error for an invalid index (string)", () => {
        const exit: ExitObject = result.run(["result", "--index=a"], "result --index=a", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "--index=a"]);
        expect(isExitObject(exit.output)).toBe(false);
        expect(exit.output.error).toEqual("Invalid index");
    });

    it("should return an error for an invalid index (empty string)", () => {
        const exit: ExitObject = result.run(["result", "--index="], "result --index=", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "--index="]);
        expect(isExitObject(exit.output)).toBe(false);
        expect(exit.output.error).toEqual("Invalid index");
    });

    it("should return an error for no index value", () => {
        const exit: ExitObject = result.run(["result", "--index"], "result --index", term);
        expect(exit.command).toBe(result);
        expect(exit.exitCode).toEqual(0);
        expect(exit.userInput).toEqual(["result", "--index"]);
        expect(isExitObject(exit.output)).toBe(false);
        expect(exit.output.error).toEqual("Invalid index");
    });

    it("should have manual page", () => {
        expect(result.manual).toBeDefined();
        expect(result.manual?.length).toBeGreaterThan(0);
    });
});
