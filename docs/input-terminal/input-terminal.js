import { Command, ExitObject, ArgsOptions } from "./commands.js";
import { TermHistory } from "./history.js";
import { TermListeners } from "./listeners.js";
import { TermOptions } from "./options.js";
import { TermBin, built_ins } from "./bin.js";
import { TermOutput } from "./output.js";
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
export class Terminal extends EventTarget {
    _listeners;
    _started = false;
    _outputElement;
    _currentStdoutLog = [];
    _currentStderrLog = [];
    emitExecutedEvent(exitObject) {
        this.dispatchEvent(new CustomEvent("inputTerminalExecuted", { detail: exitObject }));
    }
    clearOutputLogs() {
        this._currentStdoutLog = [];
        this._currentStderrLog = [];
    }
    /**
     * The input element that the terminal is attached to.
     * @type {HTMLInputElement}
     */
    input;
    /**
     * The output manager for the terminal.
     * @type {TermOutput}
     */
    output = undefined;
    /**
     * The history of commands that have been executed.
     * @type {TermHistory}
     */
    history;
    /**
     * The commands that can be executed by the user.
     * @type {TermBin}
     */
    bin;
    /**
     * The options for the terminal.
     * @type {TermOptions}
     */
    options;
    /**
     * Get the listeners for the terminal.
     * @type {TermListeners}
     */
    get listeners() {
        return this._listeners;
    }
    /**
     * Get whether the terminal has been initialized.
     * @type {boolean}
     */
    get started() {
        return this._started;
    }
    /**
     * Emit data to stdout. Dispatches a "stdout" event and logs the data.
     * @param {any} data - the data to emit
     * @returns {void}
     */
    stdout(data) {
        this._currentStdoutLog.push(data);
        this.dispatchEvent(new CustomEvent("stdout", {
            detail: { data, timestamp: Date.now() },
        }));
    }
    /**
     * Emit data to stderr. Dispatches a "stderr" event and logs the data.
     * @param {any} data - the data to emit
     * @returns {void}
     */
    stderr(data) {
        this._currentStderrLog.push(data);
        this.dispatchEvent(new CustomEvent("stderr", {
            detail: { data, timestamp: Date.now() },
        }));
    }
    /**
     * Get a copy of the current stdout log.
     * @returns {any[]} the stdout log
     */
    getStdoutLog() {
        return [...this._currentStdoutLog];
    }
    /**
     * Get a copy of the current stderr log.
     * @returns {any[]} the stderr log
     */
    getStderrLog() {
        return [...this._currentStderrLog];
    }
    /**
     * @param {HTMLInputElement} input - input element to turn into a terminal
     * @param {HTMLElement} [output] - optional output element to render stdout/stderr to
     * @param {object} options - terminal configuration
     * @param {ExitObject[]} commandHistory - history of commands that have been executed
     * @param {Command[]} commandList - list of commands that can be executed by the user
     */
    constructor(input, output, options = {}, commandHistory = [], commandList = []) {
        super();
        this.input = input;
        this._outputElement = output;
        this.history = new TermHistory(commandHistory);
        this.bin = new TermBin(commandList);
        this.options = new TermOptions(options);
        this._listeners = new TermListeners(this);
    }
    /**
     * Initializes the terminal. Attaches input listeners and updates the input.
     * @returns {void}
     */
    init() {
        if (!this._started) {
            if (this.options.installBuiltins) {
                this.bin.list = [...this.bin.list, ...built_ins];
            }
            // Create TermOutput if output element was provided
            if (this._outputElement) {
                this.output = new TermOutput(this._outputElement, this);
                this.output.attach();
            }
            this._listeners.attachInputListeners();
            this.updateInput();
            this._started = true;
        }
    }
    /**
     * Updates the terminal's user input value.
     * @param {string} [userInput] - the value to update the input with; clears the input if no value is provided
     * @returns {void}
     */
    updateInput(userInput) {
        this.input.value = this.options.preprompt + this.options.prompt + (userInput || "");
    }
    /**
     * Gets the terminal's user input.
     * @returns {string} The string in the input, not including the preprompt and prompt
     */
    getInputValue() {
        return this.input.value.slice(`${this.options.preprompt}${this.options.prompt}`.length);
    }
    /**
     * Gets the command predictions based on the user's input.
     * @param {string} [text] - The text to get predictions for; if no text is provided, all commands are returned
     * @returns {string[]} The predictions for the terminal's user input
     */
    getPredictions(text) {
        let predictions = [];
        if (text) {
            const partialMatches = this.bin.getCommandKeys().filter((key) => key.startsWith(text));
            predictions = partialMatches;
        }
        else {
            predictions = this.bin.getCommandKeys();
        }
        return predictions;
    }
    /**
     * Converts the user's input into an array for command execution.
     * @param {string} input - The string to convert into an array
     * @returns {string[]} The array created from the input
     */
    getInputArray(input) {
        function cleanBuffer(toClean) {
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
                        result.push(cleanBuffer(buffer));
                        buffer = "";
                        currQuote = null;
                    }
                    else {
                        buffer += char;
                    }
                }
                else if (char === " " && currQuote == null) {
                    if (buffer.length > 0) {
                        result.push(cleanBuffer(buffer));
                        buffer = "";
                    }
                }
                else {
                    buffer += char;
                }
            }
        }
        if (buffer.length > 0) {
            result.push(cleanBuffer(buffer));
        }
        return result;
    }
    /**
     * Get the last exit object of the terminal.
     * @returns {ExitObject | undefined} The last exit object of the terminal; if no exit objects are found, returns undefined
     */
    getLastExitObject() {
        return this.history.items[0];
    }
    /**
     * Executes a command based on the user's input.
     * @param {string} input - The command to execute
     * @returns {ExitObject} The ExitObject returned by the execution
     */
    executeCommand(input) {
        this.clearOutputLogs();
        const userInput = this.getInputArray(input.trim());
        const command = this.bin.find(userInput[0]);
        let addToHistory = true;
        let exitObject;
        if (command) {
            exitObject = command.run(userInput, input, this);
        }
        else if (userInput[0] === "") {
            exitObject = this.bin.emptyCommand.run(userInput, input, this);
            if (!this.options.addEmptyCommandToHistory) {
                addToHistory = false;
            }
        }
        else {
            const errText = `Command ${userInput[0]} not found`;
            this.stderr(errText);
            exitObject = new ExitObject(userInput, input, undefined, 1, { error: errText }, this.getStdoutLog(), this.getStderrLog());
        }
        if (addToHistory) {
            this.history.push(exitObject);
        }
        this.history.resetIndex();
        this.emitExecutedEvent(exitObject);
        return exitObject;
    }
}
export { Command, ArgsOptions, ExitObject, TermBin, TermHistory, TermOptions, TermListeners, TermOutput, built_ins };
