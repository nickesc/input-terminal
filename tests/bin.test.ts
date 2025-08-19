import { Command, TermBin, Terminal } from '../src/input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

function tCommand(key: string): Command {
    return new Command(key, () => {return {}});
}

let testBin: Command[];
let testCommand: Command;

function setTestArrays(): void {
    testCommand = tCommand("test0");
    testBin = [tCommand("test1"), tCommand("test2"), tCommand("test3")];
}

describe('TermBin Construction Tests', () => {
    beforeEach(() => {
        setTestArrays();
    });

    it('should construct a TermBin object',  () => {
        const bin: TermBin = new TermBin();
        expect(bin).toBeInstanceOf(TermBin);
    });
});

describe('TermBin List Tests', () => {
    beforeEach(() => {
        setTestArrays();
    });

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
});

describe('TermBin Add Command Tests', () => {
    beforeEach(() => {
        setTestArrays();
    });

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
});

describe('TermBin Remove Command Tests', () => {
    beforeEach(() => {
        setTestArrays();
    });

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
});

describe('TermBin Empty Command Tests', () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        setTestArrays();
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById('terminal-input') as HTMLInputElement;
        term = new Terminal(input);
    });

    it('should have a default empty command', () => {
        const bin: TermBin = new TermBin();
        expect(bin.emptyCommand).toBeInstanceOf(Command);
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
        const emptyInput: string = "";
        const exitObject = term.executeCommand(emptyInput);
        expect(exitObject.command).toEqual(term.bin.emptyCommand);
    });
    it('should run a custom empty command with custom output', () => {
        const emptyInput: string = ""
        const customEmpty = new Command("customEmpty", () => ({ message: "No command provided" }));
        term.bin.emptyCommand = customEmpty;
        const exitObject = term.executeCommand(emptyInput);
        expect(exitObject.command).toEqual(term.bin.emptyCommand);
    });
    it('should handle errors in the empty command gracefully', () => {
        const errorEmpty = new Command("errorEmpty", () => { throw new Error("Empty command error"); });
        term.bin.emptyCommand = errorEmpty;
        const emptyInput: string = ""
        const exitObject = term.executeCommand(emptyInput);
        expect(exitObject.output).toEqual({ error: new Error("Empty command error") });
        expect(exitObject.exitCode).toEqual(1);
        expect(exitObject.command).toEqual(errorEmpty);
    });
});
