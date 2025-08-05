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

let test_bin: Command[];
let test_command: Command;

describe('TermBin Tests', () => {
    beforeEach(() => {
        test_command = tCommand("test0");
        test_bin = [tCommand("test1"), tCommand("test2"), tCommand("test3")];
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
        const bin: TermBin = new TermBin(test_bin);
        expect(bin.list).toEqual(test_bin);
    });
    it('should set the bin list', () => {
        const bin: TermBin = new TermBin();
        bin.list = test_bin;
        expect(bin.list).toEqual(test_bin);
    });
    it('should get the correct list', () => {
        const bin: TermBin = new TermBin(test_bin);
        expect(bin.list).toEqual(test_bin);
    });
    it('should get the correct key list', () => {
        const bin: TermBin = new TermBin(test_bin);
        expect(bin.get_command_keys()).toEqual(["test1", "test2", "test3"]);
    });


    // ADD COMMAND TESTS
    it('should add a command to the list',  () => {
        const bin: TermBin = new TermBin();
        const starting_length: number = bin.list.length;
        expect(bin.add(test_command)).toEqual(starting_length + 1);
        expect(bin.list).toEqual([test_command]);
    });
    it('should throw an error when adding the same command object', () => {
        const bin: TermBin = new TermBin([test_command]);
        expect(() => bin.add(test_command)).toThrow('Command with key "test0" already exists');
        expect(bin.list).toEqual([test_command]);
    });
    it('should throw an error when adding a command with an existing key', () => {
        const bin: TermBin = new TermBin([test_command]);
        const duplicateKeyCommand = new Command("test0", () => ({ different: "action" }));
        expect(() => bin.add(duplicateKeyCommand)).toThrow('Command with key "test0" already exists');
        expect(bin.list).toEqual([test_command]);
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
        bin.add(test_command);
        bin.add(test_bin);
        expect(bin.list).toEqual([test_command, ...test_bin]);
    });


    // REMOVE COMMAND TESTS
    it('should remove a command from the list',  () => {
        const bin: TermBin = new TermBin(test_bin);
        const removed_command: Command | undefined = bin.remove(test_bin[0]);
        expect(bin.list).toEqual([test_bin[1], test_bin[2]]);
        expect(removed_command).toEqual(test_bin[0]);
    });
    it('should not remove a command that does not exist',  () => {
        const bin: TermBin = new TermBin(test_bin);
        const removed_command: Command | undefined = bin.remove(test_command);
        expect(bin.list).toEqual(test_bin);
        expect(removed_command).toEqual(undefined);
    });


    // EMPTY COMMAND TESTS
    it('should have a default empty command', () => {
        const bin: TermBin = new TermBin();
        expect(isCommand(bin.empty_command)).toBe(true);
    });
    it('should get the empty command', () => {
        const bin: TermBin = new TermBin();
        const empty_cmd = bin.empty_command;
        expect(empty_cmd.key).toEqual("");
    });
    it('should set the empty command', () => {
        const bin: TermBin = new TermBin();
        const custom_empty = new Command("custom_empty", () => ({ custom: "output" }));
        bin.empty_command = custom_empty;
        expect(bin.empty_command).toEqual(custom_empty);
    });
    it('should run the empty command with empty input', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const empty_input: string = "";
        const exit_object = term.execute_command(empty_input);
        expect(exit_object.command).toEqual(term.bin.empty_command);
    });
    it('should run a custom empty command with custom output', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const empty_input: string = ""
        const custom_empty = new Command("custom_empty", () => ({ message: "No command provided" }));
        term.bin.empty_command = custom_empty;
        const exit_object = term.execute_command(empty_input);
        expect(exit_object.command).toEqual(term.bin.empty_command);
    });
    it('should handle empty command errors gracefully', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const error_empty = new Command("error_empty", () => { throw new Error("Empty command error"); });
        term.bin.empty_command = error_empty;
        const empty_input: string = ""
        const exit_object = term.execute_command(empty_input);
        expect(exit_object.output).toEqual({ error: new Error("Empty command error") });
        expect(exit_object.exit_code).toEqual(1);
        expect(exit_object.command).toEqual(error_empty);
    });
});
