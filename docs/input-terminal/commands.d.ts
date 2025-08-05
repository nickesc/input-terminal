import { Terminal } from './input-terminal.ts';
/**
 * Manages and stores the arguments and options for a command.
 * @category Command Components
 */
export declare class ArgsOptions {
    private _user_input;
    private _args;
    private _options;
    /**
     * Get the arguments for the command.
     * @type {string[]}
     */
    get args(): string[];
    /**
     * Get the options for the command.
     * @type {Record<string, any>}
     */
    get options(): Record<string, any>;
    /**
     * @param {string[]} user_input - the input array to parse
     */
    constructor(user_input: string[]);
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
    get action(): (args: string[], options: Record<string, any>, terminal: Terminal) => {};
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
    constructor(key: string, action: (args: string[], options: Record<string, any>, terminal: Terminal) => {});
    /**
     * Parses an input array into an `ArgsOptions` object.
     * @param {string[]} user_input - the input array to parse
     * @returns {ArgsOptions} the parsed input
     */
    parse_input(user_input: string[]): ArgsOptions;
    /**
     * Runs the command with the given input.
     * @param {string[]} user_input - the input array to parse
     * @param {Terminal} term - the terminal to run the command in
     * @returns {ExitObject} the `ExitObject` the command returns
     */
    run(user_input: string[], raw_input: string, term: Terminal): ExitObject;
}
/**
 * An object that is returned when a command is executed.
 */
export declare class ExitObject {
    private _command;
    private _timestamp;
    private _exit_code;
    private _user_input;
    private _raw_input;
    private _output;
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
    get exit_code(): number;
    /**
     * Get the input that was used to execute the command.
     * @type {string[]}
     */
    get user_input(): string[];
    /**
     * Get the raw input that was entered to execute the command.
     * @type {string}
     */
    get raw_input(): string;
    /**
     * Get the output of the execution.
     * @type {object}
     */
    get output(): object;
    /**
     * @param {string[]} user_input - the input array that was used to execute the command
     * @param {Command | undefined} command - the command that was executed; `undefined` if the command is not found
     * @param {number} exit_code - the exit code of the command
     * @param {object} output - the output of the command
     */
    constructor(user_input: string[], raw_input: string, command: Command | undefined, exit_code: number, output: any);
}
