import { Command, ArgsOptions, ExitObject, Terminal } from '../src/input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

function isCommand(target: any): boolean {
    return target instanceof Command;
}

function isArgsOptions(target: any): boolean {
    return target instanceof ArgsOptions;
}

function isExitObject(target: any): boolean {
    return target instanceof ExitObject;
}

function tCommand(key: string): Command {
    return new Command(key, () => {return {}});
}

let test_commands: Command[];
let test_command: Command;



describe('Command Tests', () => {
    // COMMAND TESTS
    it('should construct a Command object',  () => {
        const command: Command = new Command("test", () => {return {}});
        expect(isCommand(command)).toBe(true);
    });
    it('should construct with the correct properties',  () => {
        const command: Command = new Command("test", () => {return {}});
        expect(command.key).toEqual("test");
        expect(command.action).toBeDefined();
    });
    it('should return an ArgsOptions object',  () => {
        const command: Command = new Command("test", () => {return {}});
        const input: string[] = ["test", "--option1", "--option2=1", "--option3=", "arg1", "arg2", "arg 3"];
        const parsed_input: ArgsOptions = command.parse_input(input);
        expect(isArgsOptions(parsed_input)).toBe(true);
    });
    it('should parse the input correctly and return an ArgsOptions object',  () => {
        const command: Command = new Command("test", () => {return {}});
        const input: string[] = ["test", "--option1", "--option2=1", "--option3=", "arg1", "arg2", "arg 3"];
        const parsed_input: ArgsOptions = command.parse_input(input);
        expect(parsed_input.options).toEqual({option1: {value:undefined}, option2: {value: "1"}, option3: {value:undefined}});
        expect(parsed_input.args).toEqual(["arg1", "arg2", "arg 3"]);
    });
    it('should log error if unable to parse input',  () => {
        const command: Command = new Command("test", () => {return {}});
        const input: string[] = ["test", "--="];
        const parsed_input = command.parse_input(input);
        expect(parsed_input.options).toEqual({});
    });
    it('should run the command with the correct input',  () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const command: Command = new Command("test", () => {return {}});
        const user_input: string[] = ["test", "--option1", "--option2=1", "--option3=", "arg1", "arg2", "arg 3"];
        const exit_object = command.run(user_input, user_input.join(" "), term);
        expect(exit_object.output).toEqual({});
        expect(exit_object.exit_code).toEqual(0);
        expect(exit_object.user_input).toEqual(user_input);
        expect(exit_object.raw_input).toEqual(user_input.join(" "));
        expect(exit_object.command).toEqual(command);
    });
    it('should return an error when the command throws an error',  () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const command: Command = new Command("test", () => {throw new Error("test error");});
        const user_input: string[] = ["test"];
        const exit_object = command.run(user_input, user_input.join(" "), term);
        expect(exit_object.output).toEqual({error: new Error("test error")});
        expect(exit_object.exit_code).toEqual(1);
        expect(exit_object.user_input).toEqual(user_input);
        expect(exit_object.raw_input).toEqual(user_input.join(" "));
        expect(exit_object.command).toEqual(command);
    });
});

describe('ExitObject Tests', () => {
    beforeEach(() => {
        test_command = tCommand("test0");
        test_commands = [tCommand("test1"), tCommand("test2"), tCommand("test3")];
    });
    // EXIT OBJECT TESTS
    it('should construct an exit object',  () => {
        const exit_object: ExitObject = new ExitObject([], "", test_command, 0, {});
        expect(isExitObject(exit_object)).toBe(true);
    });
    it('should construct with the correct property values',  () => {
        const exit_object: ExitObject = new ExitObject([], "", test_command, 0, {});
        expect(exit_object.command).toEqual(test_command);
        expect(exit_object.timestamp).toBeDefined();
        expect(exit_object.exit_code).toEqual(0);
        expect(exit_object.user_input).toEqual([]);
        expect(exit_object.raw_input).toEqual("");
        expect(exit_object.output).toEqual({});
    });
});
