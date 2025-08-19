import { Command, ArgsOptions, ExitObject, Terminal } from '../src/input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

function tCommand(key: string): Command {
    return new Command(key, () => {return});
}

let testCommands: Command[];
let testCommand: Command;

describe('Command Construction Tests', () => {
    it('should construct a Command object',  () => {
        const command: Command = new Command("test", () => {return});
        expect(command).toBeInstanceOf(Command);
    });
    it('should construct with the correct properties',  () => {
        const command: Command = new Command("test", () => {return});
        expect(command.key).toEqual("test");
        expect(command.action).toBeDefined();
    });
})

describe('Command Parse Tests', () => {
    it('should return an ArgsOptions object',  () => {
        const command: Command = new Command("test", () => {return});
        const input: string[] = ["test", "--option1", "--option2=1", "--option3=", "arg1", "arg2", "arg 3"];
        const parsedInput: ArgsOptions = command.parseInput(input);
        expect(parsedInput).toBeInstanceOf(ArgsOptions);
    });
    it('should parse the input correctly and return an ArgsOptions object',  () => {
        const command: Command = new Command("test", () => {return});
        const input: string[] = ["test", "--option1", "--option2=1", "--option3=", "arg1", "2", "true"];
        const parsedInput: ArgsOptions = command.parseInput(input);
        expect(parsedInput.options).toEqual({option1: {value:undefined}, option2: {value: 1}, option3: {value:undefined}});
        expect(parsedInput.args).toEqual(["arg1", 2, true]);
    });
    it('should log error if unable to parse input',  () => {
        const command: Command = new Command("test", () => {return});
        const input: string[] = ["test", "--="];
        const parsedInput = command.parseInput(input);
        expect(parsedInput.options).toEqual({});
    });
});

describe('Command Run Tests', () => {
    let term: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById('terminal-input') as HTMLInputElement;
        term = new Terminal(input);
    });

    it('should run the command with the correct input',  () => {
        const command: Command = new Command("test", () => {return});
        const userInput: string[] = ["test", "--option1", "--option2=1", "--option3=", "arg1", "arg2", "arg 3"];
        const exitObject = command.run(userInput, userInput.join(" "), term);
        expect(exitObject.output).toEqual(undefined);
        expect(exitObject.exitCode).toEqual(0);
        expect(exitObject.userInput).toEqual(userInput);
        expect(exitObject.rawInput).toEqual(userInput.join(" "));
        expect(exitObject.command).toEqual(command);
    });
    it('should return an error when the command throws an error',  () => {
        const command: Command = new Command("test", () => {throw new Error("test error");});
        const userInput: string[] = ["test"];
        const exitObject = command.run(userInput, userInput.join(" "), term);
        expect(exitObject.output).toEqual({error: new Error("test error")});
        expect(exitObject.exitCode).toEqual(1);
        expect(exitObject.userInput).toEqual(userInput);
        expect(exitObject.rawInput).toEqual(userInput.join(" "));
        expect(exitObject.command).toEqual(command);
    });
});

describe('Command Manual Tests', () => {
    it('should set the manual for the command',  () => {
        const command: Command = new Command("test", () => {return});
        command.manual = "test manual";
        expect(command.manual).toEqual("test manual");
    });
    it('should throw an error if the manual is set after it has been set',  () => {
        const command: Command = new Command("test", () => {return});
        command.manual = "test manual";
        expect(() => {command.manual = "test manual 2";}).toThrow();
    });
});

describe('ExitObject Tests', () => {
    beforeEach(() => {
        testCommand = tCommand("test0");
        testCommands = [tCommand("test1"), tCommand("test2"), tCommand("test3")];
    });

    it('should construct an exit object',  () => {
        const exitObject: ExitObject = new ExitObject([], "", testCommand, 0, {});
        expect(exitObject).toBeInstanceOf(ExitObject);
    });
    it('should construct with the correct property values',  () => {
        const exitObject: ExitObject = new ExitObject([], "", testCommand, 0, undefined);
        expect(exitObject.command).toEqual(testCommand);
        expect(exitObject.timestamp).toBeDefined();
        expect(exitObject.exitCode).toEqual(0);
        expect(exitObject.userInput).toEqual([]);
        expect(exitObject.rawInput).toEqual("");
        expect(exitObject.output).toEqual(undefined);
    });
});
