import { Command, ExitObject, ArgsOptions } from "./commands.ts";
import type { Options } from "./commands.ts";
import { TermHistory } from "./history.ts";
import { TermListeners } from "./listeners.ts";
import { TermOptions } from "./options.ts";
import { TermBin, built_ins } from "./bin.ts";
import { TermOutput } from "./output.ts";
/**
 * @license MIT
 * @author nickesc
 * @module input-terminal
 * @showGroups
 */
/**
 * Allows you to turn any `HTMLInputElement` into a terminal interface. Define custom commands that can be executed by users, track command history, autocomplete commands, and more.
 *
 * @example
 * ```typescript
 * import { Terminal, Command } from "input-terminal";
 * const input = document.getElementById("terminal") as HTMLInputElement;
 * const output = document.getElementById("output") as HTMLElement;
 * const terminal = new Terminal(input, output, { prompt: ">> " });
 * terminal.bin.add(new Command("echo", (args, options, terminal) => {
 *     terminal.stdout(args.join(" "));
 *     return {};
 * }));
 * terminal.init();
 * ```
 */
export declare class Terminal extends EventTarget {
    private _listeners;
    private _started;
    private _outputElement;
    private _currentStdoutLog;
    private _currentStderrLog;
    private emitExecutedEvent;
    private clearOutputLogs;
    /**
     * The input element that the terminal is attached to.
     * @type {HTMLInputElement}
     */
    input: HTMLInputElement;
    /**
     * The output manager for the terminal.
     * @type {TermOutput}
     */
    output: TermOutput | undefined;
    /**
     * The history of commands that have been executed.
     * @type {TermHistory}
     */
    history: TermHistory;
    /**
     * The commands that can be executed by the user.
     * @type {TermBin}
     */
    bin: TermBin;
    /**
     * The options for the terminal.
     * @type {TermOptions}
     */
    options: TermOptions;
    /**
     * Get the listeners for the terminal.
     * @type {TermListeners}
     */
    get listeners(): TermListeners;
    /**
     * Get whether the terminal has been initialized.
     * @type {boolean}
     */
    get started(): boolean;
    /**
     * Emit data to stdout. Dispatches a "stdout" event and logs the data.
     * @param {any} data - the data to emit
     * @returns {void}
     */
    stdout(data: any): void;
    /**
     * Emit data to stderr. Dispatches a "stderr" event and logs the data.
     * @param {any} data - the data to emit
     * @returns {void}
     */
    stderr(data: any): void;
    /**
     * Get a copy of the current stdout log.
     * @returns {any[]} the stdout log
     */
    getStdoutLog(): any[];
    /**
     * Get a copy of the current stderr log.
     * @returns {any[]} the stderr log
     */
    getStderrLog(): any[];
    /**
     * @param {HTMLInputElement} input - input element to turn into a terminal
     * @param {HTMLElement} [output] - optional output element to render stdout/stderr to
     * @param {object} options - terminal configuration
     * @param {ExitObject[]} commandHistory - history of commands that have been executed
     * @param {Command[]} commandList - list of commands that can be executed by the user
     */
    constructor(input: HTMLInputElement, output?: HTMLElement, options?: object, commandHistory?: ExitObject[], commandList?: Command[]);
    /**
     * Initializes the terminal. Attaches input listeners and updates the input.
     * @returns {void}
     */
    init(): void;
    /**
     * Updates the terminal's user input value.
     * @param {string} [userInput] - the value to update the input with; clears the input if no value is provided
     * @returns {void}
     */
    updateInput(userInput?: string): void;
    /**
     * Gets the terminal's user input.
     * @returns {string} The string in the input, not including the preprompt and prompt
     */
    getInputValue(): string;
    /**
     * Gets the command predictions based on the user's input.
     * @param {string} [text] - The text to get predictions for; if no text is provided, all commands are returned
     * @returns {string[]} The predictions for the terminal's user input
     */
    getPredictions(text?: string): string[];
    /**
     * Converts the user's input into an array for command execution.
     * @param {string} input - The string to convert into an array
     * @returns {string[]} The array created from the input
     */
    getInputArray(input: string): string[];
    /**
     * Get the last exit object of the terminal.
     * @returns {ExitObject | undefined} The last exit object of the terminal; if no exit objects are found, returns undefined
     */
    getLastExitObject(): ExitObject | undefined;
    /**
     * Executes a command based on the user's input.
     * @param {string} input - The command to execute
     * @returns {ExitObject} The ExitObject returned by the execution
     */
    executeCommand(input: string): ExitObject;
}
export { Command, ArgsOptions, ExitObject, TermBin, TermHistory, TermOptions, TermListeners, TermOutput, built_ins };
export type { Options };
