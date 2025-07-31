import { Command, TermCommands, ExitObject } from '../src/input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';

function isCommand(target: any): boolean {
    return target instanceof Command;
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
});

describe('Command Tests', () => {
    // COMMAND TESTS
    it('should construct a Command object',  () => {
        const command: Command = new Command("test", () => {return {}});
        expect(isCommand(command)).toBe(true);
    });
    it('should construct with a key',  () => {
        const command: Command = new Command("test", () => {return {}});
        expect(command.key).toEqual("test");
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

    it('should construct an exit object',  () => {
        const exit_object: ExitObject = new ExitObject([], test_command, 0, {});
        expect(exit_object.command).toEqual(test_command);
        expect(exit_object.timestamp).toBeDefined();
        expect(exit_object.exit_code).toEqual(0);
        expect(exit_object.user_input).toEqual([]);
        expect(exit_object.output).toEqual({});
    });
});
