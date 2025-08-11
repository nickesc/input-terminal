import { Command, TermBin, Terminal } from '../src/input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

function isTermBin(target: any): boolean {
  return target instanceof TermBin;
}

function isCommand(target: any): boolean {
    return target instanceof Command;
}


function tCommand(key: string): Command {
    return new Command(key, () => {return {}});
}

let testBin: Command[];
let testCommand: Command;

describe('TermBin Tests', () => {
    beforeEach(() => {
        testCommand = tCommand("test0");
        testBin = [tCommand("test1"), tCommand("test2"), tCommand("test3")];
    });

    // CONSTRUCTION TEST
    it('should construct a TermBin object',  () => {
        const bin: TermBin = new TermBin();
        expect(isTermBin(bin)).toBe(true);
    });


    // BIN LIST TESTS
    it('should have empty bin by default', () => {
        const bin: TermBin = new TermBin();
        expect(bin.list).toEqual([]);
    });
    it('should construct with custom bin list',  () => {
        const bin: TermBin = new TermBin(testBin);
        expect(bin.list).toEqual(testBin);
    });
    it('should set the bin list', () => {
        const bin: TermBin = new TermBin();
        bin.list = testBin;
        expect(bin.list).toEqual(testBin);
    });
    it('should get the correct list', () => {
        const bin: TermBin = new TermBin(testBin);
        expect(bin.list).toEqual(testBin);
    });
    it('should get the correct key list', () => {
        const bin: TermBin = new TermBin(testBin);
        expect(bin.getCommandKeys()).toEqual(["test1", "test2", "test3"]);
    });


    // ADD COMMAND TESTS
    it('should add a command to the list',  () => {
        const bin: TermBin = new TermBin();
        const startingLength: number = bin.list.length;
        expect(bin.add(testCommand)).toEqual(startingLength + 1);
        expect(bin.list).toEqual([testCommand]);
    });
    it('should throw an error when adding the same command object', () => {
        const bin: TermBin = new TermBin([testCommand]);
        expect(() => bin.add(testCommand)).toThrow('Command with key "test0" already exists');
        expect(bin.list).toEqual([testCommand]);
    });
    it('should throw an error when adding a command with an existing key', () => {
        const bin: TermBin = new TermBin([testCommand]);
        const duplicateKeyCommand = new Command("test0", () => ({ different: "action" }));
        expect(() => bin.add(duplicateKeyCommand)).toThrow('Command with key "test0" already exists');
        expect(bin.list).toEqual([testCommand]);
    });
    it('should throw an error when setting a list with duplicate keys', () => {
        const bin: TermBin = new TermBin();
        const duplicatebin = [
            new Command("test1", () => ({ action: "first" })),
            new Command("test1", () => ({ action: "second" }))
        ];
        expect(() => bin.list = duplicatebin).toThrow('Command with key "test1" already exists');
        expect(bin.list).toEqual([duplicatebin[0]]);
    });
    it('should add multiple commands to the list',  () => {
        const bin: TermBin = new TermBin();
        bin.add(testCommand);
        bin.add(testBin);
        expect(bin.list).toEqual([testCommand, ...testBin]);
    });


    // REMOVE COMMAND TESTS
    it('should remove a command from the list',  () => {
        const bin: TermBin = new TermBin(testBin);
        const removedCommand: Command | undefined = bin.remove(testBin[0]);
        expect(bin.list).toEqual([testBin[1], testBin[2]]);
        expect(removedCommand).toEqual(testBin[0]);
    });
    it('should not remove a command that does not exist',  () => {
        const bin: TermBin = new TermBin(testBin);
        const removedCommand: Command | undefined = bin.remove(testCommand);
        expect(bin.list).toEqual(testBin);
        expect(removedCommand).toEqual(undefined);
    });


    // EMPTY COMMAND TESTS
    it('should have a default empty command', () => {
        const bin: TermBin = new TermBin();
        expect(isCommand(bin.emptyCommand)).toBe(true);
    });
    it('should get the empty command', () => {
        const bin: TermBin = new TermBin();
        const emptyCommand = bin.emptyCommand;
        expect(emptyCommand.key).toEqual("");
    });
    it('should set the empty command', () => {
        const bin: TermBin = new TermBin();
        const customEmpty = new Command("customEmpty", () => ({ custom: "output" }));
        bin.emptyCommand = customEmpty;
        expect(bin.emptyCommand).toEqual(customEmpty);
    });
    it('should run the empty command with empty input', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const emptyInput: string = "";
        const exitObject = term.executeCommand(emptyInput);
        expect(exitObject.command).toEqual(term.bin.emptyCommand);
    });
    it('should run a custom empty command with custom output', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const emptyInput: string = ""
        const customEmpty = new Command("customEmpty", () => ({ message: "No command provided" }));
        term.bin.emptyCommand = customEmpty;
        const exitObject = term.executeCommand(emptyInput);
        expect(exitObject.command).toEqual(term.bin.emptyCommand);
    });
    it('should handle empty command errors gracefully', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const errorEmpty = new Command("errorEmpty", () => { throw new Error("Empty command error"); });
        term.bin.emptyCommand = errorEmpty;
        const emptyInput: string = ""
        const exitObject = term.executeCommand(emptyInput);
        expect(exitObject.output).toEqual({ error: new Error("Empty command error") });
        expect(exitObject.exitCode).toEqual(1);
        expect(exitObject.command).toEqual(errorEmpty);
    });
});
