import { TermCommands, Command, ExitObject, ArgsOptions } from "./commands.js";
import { TermHistory } from "./history.js";
import { TermListeners } from "./listeners.js";
import { TermOptions } from "./options.js";
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
 * terminal.commands.add(new Command("echo", (args, options, terminal) => {
 *     console.log(args);
 *     return {};
 * }));
 * terminal.init();
 * ```
 * @category none
 */
export class Terminal {
    _listeners;
    _started = false;
    _lastExitCode = undefined;
    /**
     * The input element that the terminal is attached to.
     * @type {HTMLInputElement}
     */
    input;
    /**
     * The history of commands that have been executed.
     * @type {TermHistory}
     */
    history;
    /**
     * The commands that can be executed by the user.
     * @type {TermCommands}
     */
    commands;
    /**
     * The options for the terminal.
     * @type {TermOptions}
     */
    options;
    /**
     * Whether the terminal has been initialized.
     * @type {boolean}
     */
    get started() { return this._started; }
    /**
     * The last exit code of the terminal.
     * @type {number | undefined}
     */
    get lastExitCode() { return this._lastExitCode; }
    /**
     * @param {HTMLInputElement} input - input element to turn into a terminal
     * @param {object} options - terminal configuration
     * @param {ExitObject[]} commandHistory - history of commands that have been executed
     * @param {Command[]} commandList - list of commands that can be executed by the user
     */
    constructor(input, options = {}, commandHistory = [], commandList = []) {
        this.input = input;
        this.history = new TermHistory(commandHistory);
        this.commands = new TermCommands(commandList);
        this.options = new TermOptions(options);
        this._listeners = new TermListeners(this);
    }
    /**
     * Initializes the terminal. Attaches input listeners and updates the input.
     * @returns {void}
     */
    init() {
        if (!this._started) {
            this._listeners.attach_input_listeners();
            this.update_input();
            this._started = true;
        }
    }
    /**
     * Updates the terminal's user input value.
     * @param {string} [user_input] - the value to update the input with; clears the input if no value is provided
     * @returns {void}
     */
    update_input(user_input) {
        this.input.value = this.options.preprompt + this.options.prompt + (user_input || "");
    }
    /**
     * Gets the terminal's user input.
     * @returns {string} The string in the input, not including the preprompt and prompt
     */
    get_input_value() {
        return this.input.value.slice(`${this.options.preprompt}${this.options.prompt}`.length);
    }
    /**
     * Gets the command predictions based on the user's input.
     * @param {string} [text] - The text to get predictions for; if no text is provided, all commands are returned
     * @returns {string[]} The predictions for the terminal's user input
     */
    get_predictions(text) {
        let predictions = [];
        if (text) {
            const partial_matches = this.commands.get_command_keys().filter(key => key.startsWith(text));
            predictions = partial_matches;
        }
        else {
            predictions = this.commands.get_command_keys();
        }
        return predictions;
    }
    /**
     * Converts the user's input into an array for command execution.
     * @param {string} input - The string to convert into an array
     * @returns {string[]} The array created from the input
     */
    get_input_array(input) {
        function clean_buffer(toClean) {
            toClean = toClean.trim();
            toClean = toClean.replace(/\\/g, "");
            return toClean;
        }
        if (input.trim().length === 0) {
            return [""];
        }
        const quotes = ['"', "'", "`"];
        let currQuote = null;
        let buffer = "";
        let result = [];
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (char) {
                if (quotes.includes(char) && buffer.slice(-1) !== "\\") {
                    if (currQuote == null) {
                        currQuote = char;
                    }
                    else if (currQuote === char) {
                        result.push(clean_buffer(buffer));
                        buffer = "";
                        currQuote = null;
                    }
                    else {
                        buffer += char;
                    }
                }
                else if (char === " " && currQuote == null) {
                    if (buffer.length > 0) {
                        result.push(clean_buffer(buffer));
                        buffer = "";
                    }
                }
                else {
                    buffer += char;
                }
            }
        }
        if (buffer.length > 0) {
            result.push(clean_buffer(buffer));
        }
        return result;
    }
    /**
     * Executes a command based on the user's input.
     * @param {string} input - The command to execute
     * @returns {ExitObject} The ExitObject returned by the execution
     */
    execute_command(input) {
        const user_input = this.get_input_array(input);
        const command = this.commands.find(user_input[0]);
        const output = {};
        let exitObject;
        if (command) {
            exitObject = command.run(user_input, this);
        }
        else if (user_input[0] == "") {
            exitObject = new ExitObject(user_input, undefined, 0, output);
        }
        else {
            const errText = `Command ${user_input[0]} not found`;
            console.error(errText);
            exitObject = new ExitObject(user_input, undefined, 1, { error: errText });
        }
        this._lastExitCode = exitObject.exit_code;
        this.history.push(exitObject);
        this.history.reset_index();
        return exitObject;
    }
}
export { Command, ArgsOptions, ExitObject, TermCommands, TermHistory, TermOptions };
