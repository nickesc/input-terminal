import { Command, ExitObject, ArgsOptions } from './commands.ts';
import { TermHistory } from './history.ts';
import { TermListeners } from './listeners.ts';
import { TermOptions } from './options.ts';
import { TermBin, built_ins } from './bin.ts';
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
 * const terminal = new Terminal(input, { prompt: ">> " });
 * terminal.bin.add(new Command("echo", (args, options, terminal) => {
 *     console.log(args);
 *     return {};
 * }));
 * terminal.init();
 * ```
 */
export declare class Terminal extends EventTarget {
    #private;
    private _listeners;
    private _started;
    /**
     * The input element that the terminal is attached to.
     * @type {HTMLInputElement}
     */
    input: HTMLInputElement;
    /**
     * The element that the terminal should output text to.
     * @type {HTMLElement}
     */
    output: HTMLElement | undefined;
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
     * @param {HTMLInputElement} input - input element to turn into a terminal
     * @param {object} options - terminal configuration
     * @param {ExitObject[]} commandHistory - history of commands that have been executed
     * @param {Command[]} commandList - list of commands that can be executed by the user
     */
    constructor(input: HTMLInputElement, options?: object, commandHistory?: ExitObject[], commandList?: Command[]);
    /**
     * Initializes the terminal. Attaches input listeners and updates the input.
     * @returns {void}
     */
    init(): void;
    /**
     * Updates the terminal's user input value.
     * @param {string} [user_input] - the value to update the input with; clears the input if no value is provided
     * @returns {void}
     */
    update_input(user_input?: string): void;
    /**
     * Gets the terminal's user input.
     * @returns {string} The string in the input, not including the preprompt and prompt
     */
    get_input_value(): string;
    /**
     * Gets the command predictions based on the user's input.
     * @param {string} [text] - The text to get predictions for; if no text is provided, all commands are returned
     * @returns {string[]} The predictions for the terminal's user input
     */
    get_predictions(text?: string): string[];
    /**
     * Converts the user's input into an array for command execution.
     * @param {string} input - The string to convert into an array
     * @returns {string[]} The array created from the input
     */
    get_input_array(input: string): string[];
    /**
     * Get the last exit object of the terminal.
     * @type {ExitObject | undefined}
     */
    get_last_exit_object(): ExitObject | undefined;
    /**
     * Executes a command based on the user's input.
     * @param {string} input - The command to execute
     * @returns {ExitObject} The ExitObject returned by the execution
     */
    execute_command(input: string): ExitObject;
}
export { Command, ArgsOptions, ExitObject, TermBin, TermHistory, TermOptions, TermListeners, built_ins };
