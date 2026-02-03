import { Terminal } from "./input-terminal.ts";
/**
 * The structure for the object used to store the options for a command. Each key is an option name, and the value is an object with a `value` property.
 * @category Command Components
 */
export type Options = Record<string, {
    value: string | number | boolean;
}>;
/**
 * Manages and stores the arguments and options for a command.
 * @category Command Components
 */
export declare class ArgsOptions {
    private _userInput;
    private _args;
    private _options;
    /**
     * Get the arguments for the command.
     * @type {(string|number|boolean)[]}
     */
    get args(): (string | number | boolean)[];
    /**
     * Get the options for the command.
     * @type {Options}
     */
    get options(): Options;
    /**
     * @param {string[]} userInput - the input array to parse
     */
    constructor(userInput: string[]);
    private castStringToValue;
    private isValidOptionKey;
    private string2opt;
    private init;
}
/**
 * An executable command that can be added to a terminal's command list.
 */
export declare class Command {
    private _key;
    private _action;
    private _manual;
    /**
     * Get the key used to identify the command.
     * @type {string}
     */
    get key(): string;
    /**
     * Get the function to execute when the command is run.
     * @type {function}
     */
    get action(): (args: (string | number | boolean)[], options: Options, terminal: Terminal) => {};
    /**
     * Get the manual for the command.
     * @type {string}
     */
    get manual(): string | undefined;
    /**
     * Set the manual for the command.
     * @param {string} manual - the manual for the command
     */
    set manual(manual: string);
    /**
     * @param {string} key - the key used to identify the command
     * @param {function} action - the function to execute when the command is run
     */
    constructor(key: string, action: (args: (string | number | boolean)[], options: Options, terminal: Terminal) => any);
    /**
     * Parses an input array into an `ArgsOptions` object.
     * @param {string[]} userInput - the input array to parse
     * @returns {ArgsOptions} the parsed input
     */
    parseInput(userInput: string[]): ArgsOptions;
    /**
     * Runs the command with the given input.
     * @param {string[]} userInput - the input array to parse
     * @param {string} rawInput - the raw input that was used to execute the command
     * @param {Terminal} term - the terminal to run the command in
     * @returns {ExitObject} the `ExitObject` the command returns
     */
    run(userInput: string[], rawInput: string, term: Terminal): ExitObject;
}
/**
 * An object that is returned when a command is executed.
 */
export declare class ExitObject {
    private _command;
    private _timestamp;
    private _exitCode;
    private _userInput;
    private _rawInput;
    private _output;
    private _stdoutLog;
    private _stderrLog;
    /**
     * Get the command that was executed.
     * @type {Command | undefined}
     */
    get command(): Command | undefined;
    /**
     * Get the timestamp of the execution.
     * @type {number}
     */
    get timestamp(): number;
    /**
     * Get the exit code of the execution.
     * @type {number}
     */
    get exitCode(): number;
    /**
     * Get the input that was used to execute the command.
     * @type {string[]}
     */
    get userInput(): string[];
    /**
     * Get the raw input that was entered to execute the command.
     * @type {string}
     */
    get rawInput(): string;
    /**
     * Get the output of the execution.
     * @type {any}
     */
    get output(): any;
    /**
     * Get the stdout log of the execution.
     * @type {any[]}
     */
    get stdoutLog(): any[];
    /**
     * Get the stderr log of the execution.
     * @type {any[]}
     */
    get stderrLog(): any[];
    /**
     * @param {string[]} userInput - the input array that was used to execute the command
     * @param {string} rawInput - the raw input that was used to execute the command
     * @param {Command | undefined} command - the command that was executed; `undefined` if the command is not found
     * @param {number} exitCode - the exit code of the command
     * @param {object} output - the output of the command
     * @param {any[]} stdoutLog - the stdout log of the command
     * @param {any[]} stderrLog - the stderr log of the command
     */
    constructor(userInput: string[], rawInput: string, command: Command | undefined, exitCode: number, output: any, stdoutLog?: any[], stderrLog?: any[]);
}
