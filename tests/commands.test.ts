import { Command, ArgsOptions, TermCommands, ExitObject, Terminal } from '../src/input-terminal';
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

function isTermCommands(target: any): boolean {
  return target instanceof TermCommands;
}

function tCommand(key: string): Command {
    return new Command(key, () => {return {}});
}

let test_commands: Command[];
let test_command: Command;

describe('TermCommands Tests', () => {
    beforeEach(() => {
        test_command = tCommand("test0");
        test_commands = [tCommand("test1"), tCommand("test2"), tCommand("test3")];
    });

    // CONSTRUCTION TEST
    it('should construct a TermCommands object',  () => {
        const commands: TermCommands = new TermCommands();
        expect(isTermCommands(commands)).toBe(true);
    });


    // COMMANDS LIST TESTS
    it('should have empty commands list by default', () => {
        const commands: TermCommands = new TermCommands();
        expect(commands.list).toEqual([]);
    });
    it('should construct with custom commands list',  () => {
        const commands: TermCommands = new TermCommands(test_commands);
        expect(commands.list).toEqual(test_commands);
    });
    it('should set the commands list', () => {
        const commands: TermCommands = new TermCommands();
        commands.list = test_commands;
        expect(commands.list).toEqual(test_commands);
    });
    it('should get the correct list', () => {
        const commands: TermCommands = new TermCommands(test_commands);
        expect(commands.list).toEqual(test_commands);
    });
    it('should get the correct key list', () => {
        const commands: TermCommands = new TermCommands(test_commands);
        expect(commands.get_command_keys()).toEqual(["test1", "test2", "test3"]);
    });


    // ADD COMMAND TESTS
    it('should add a command to the list',  () => {
        const commands: TermCommands = new TermCommands();
        const starting_length: number = commands.list.length;
        expect(commands.add(test_command)).toEqual(starting_length + 1);
        expect(commands.list).toEqual([test_command]);

    });
    it('should not add a duplicate command to the list',  () => {
        const commands: TermCommands = new TermCommands([test_command]);
        const starting_length: number = commands.list.length;
        expect(commands.add(test_command)).toEqual(starting_length);
        expect(commands.list).toEqual([test_command]);
    });


    // REMOVE COMMAND TESTS
    it('should remove a command from the list',  () => {
        const commands: TermCommands = new TermCommands(test_commands);
        const removed_command: Command | undefined = commands.remove(test_commands[0]);
        expect(commands.list).toEqual([test_commands[1], test_commands[2]]);
        expect(removed_command).toEqual(test_commands[0]);
    });
    it('should not remove a command that does not exist',  () => {
        const commands: TermCommands = new TermCommands(test_commands);
        const removed_command: Command | undefined = commands.remove(test_command);
        expect(commands.list).toEqual(test_commands);
        expect(removed_command).toEqual(undefined);
    });


    // EMPTY COMMAND TESTS
    it('should have a default empty command', () => {
        const commands: TermCommands = new TermCommands();
        expect(isCommand(commands.empty_command)).toBe(true);
    });
    it('should get the empty command', () => {
        const commands: TermCommands = new TermCommands();
        const empty_cmd = commands.empty_command;
        expect(empty_cmd.key).toEqual("");
    });
    it('should set the empty command', () => {
        const commands: TermCommands = new TermCommands();
        const custom_empty = new Command("custom_empty", () => ({ custom: "output" }));
        commands.empty_command = custom_empty;
        expect(commands.empty_command).toEqual(custom_empty);
    });
    it('should run the empty command with empty input', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const empty_input: string = "";
        const exit_object = term.execute_command(empty_input);
        expect(exit_object.command).toEqual(term.commands.empty_command);
    });
    it('should run a custom empty command with custom output', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const empty_input: string = ""
        const custom_empty = new Command("custom_empty", () => ({ message: "No command provided" }));
        term.commands.empty_command = custom_empty;
        const exit_object = term.execute_command(empty_input);
        expect(exit_object.command).toEqual(term.commands.empty_command);
    });
    it('should handle empty command errors gracefully', () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const error_empty = new Command("error_empty", () => { throw new Error("Empty command error"); });
        term.commands.empty_command = error_empty;
        const empty_input: string = ""
        const exit_object = term.execute_command(empty_input);
        expect(exit_object.output).toEqual({ error: new Error("Empty command error") });
        expect(exit_object.exit_code).toEqual(1);
        expect(exit_object.command).toEqual(error_empty);
    });
});

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
        const exit_object = command.run(user_input, term);
        expect(exit_object.output).toEqual({});
        expect(exit_object.exit_code).toEqual(0);
        expect(exit_object.user_input).toEqual(user_input);
        expect(exit_object.command).toEqual(command);
    });
    it('should return an error when the command throws an error',  () => {
        const dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        const document = dom.window.document;
        const input = document.getElementById('terminal-input') as HTMLInputElement;
        const term = new Terminal(input);
        const command: Command = new Command("test", () => {throw new Error("test error");});
        const user_input: string[] = ["test"];
        const exit_object = command.run(user_input, term);
        expect(exit_object.output).toEqual({error: new Error("test error")});
        expect(exit_object.exit_code).toEqual(1);
        expect(exit_object.user_input).toEqual(user_input);
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
        const exit_object: ExitObject = new ExitObject([], test_command, 0, {});
        expect(isExitObject(exit_object)).toBe(true);
    });
    it('should construct with the correct property values',  () => {
        const exit_object: ExitObject = new ExitObject([], test_command, 0, {});
        expect(exit_object.command).toEqual(test_command);
        expect(exit_object.timestamp).toBeDefined();
        expect(exit_object.exit_code).toEqual(0);
        expect(exit_object.user_input).toEqual([]);
        expect(exit_object.output).toEqual({});
    });
});
