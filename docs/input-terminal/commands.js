import { Terminal } from "./input-terminal.js";
/**
 * Manages and stores the arguments and options for a command.
 * @category Command Components
 */
export class ArgsOptions {
    _userInput;
    _args = [];
    _options = {};
    /**
     * Get the arguments for the command.
     * @type {(string|number|boolean)[]}
     */
    get args() { return this._args; }
    /**
     * Get the options for the command.
     * @type {Options}
     */
    get options() { return this._options; }
    /**
     * @param {string[]} userInput - the input array to parse
     */
    constructor(userInput) {
        this._userInput = userInput;
        this.init();
    }
    castStringToValue(string) {
        if (typeof Number(string) === "number" && !isNaN(Number(string))) {
            return Number(string);
        }
        else if (string === "true") {
            return true;
        }
        else if (string === "false") {
            return false;
        }
        else {
            return string;
        }
    }
    string2opt(string) {
        const key = string.split("=")[0] || "";
        const value = string.split("=").slice(1).join("=");
        if (key && value) {
            Object.assign(this._options, { [key]: { value: this.castStringToValue(value) } });
        }
        else if (key) {
            Object.assign(this._options, { [key]: { value: undefined } });
        }
        else {
            console.error(`Unable to parse option: ${string}`);
        }
    }
    init() {
        for (let i = 1; i < this._userInput.length; i++) {
            const item = this._userInput[i];
            if (item.startsWith("--")) {
                this.string2opt(item.slice(2));
            }
            else if (item.startsWith("-")) {
                this.string2opt(item.slice(1));
            }
            else {
                this._args.push(this.castStringToValue(item));
            }
        }
    }
}
/**
 * An executable command that can be added to a terminal's command list.
 */
export class Command {
    _key;
    _action;
    _manual = undefined;
    /**
     * Get the key used to identify the command.
     * @type {string}
     */
    get key() { return this._key; }
    /**
     * Get the function to execute when the command is run.
     * @type {function}
     */
    get action() { return this._action; }
    /**
     * Get the manual for the command.
     * @type {string}
     */
    get manual() { return this._manual; }
    /**
     * Set the manual for the command.
     * @param {string} manual - the manual for the command
     */
    set manual(manual) {
        if (this._manual === undefined) {
            this._manual = manual;
        }
        else {
            throw new Error("Manual cannot be reassigned after it has been set");
        }
    }
    /**
     * @param {string} key - the key used to identify the command
     * @param {function} action - the function to execute when the command is run
     */
    constructor(key, action) {
        this._key = key;
        this._action = action;
    }
    /**
     * Parses an input array into an `ArgsOptions` object.
     * @param {string[]} userInput - the input array to parse
     * @returns {ArgsOptions} the parsed input
     */
    parseInput(userInput) {
        return new ArgsOptions(userInput);
    }
    /**
     * Runs the command with the given input.
     * @param {string[]} userInput - the input array to parse
     * @param {string} rawInput - the raw input that was used to execute the command
     * @param {Terminal} term - the terminal to run the command in
     * @returns {ExitObject} the `ExitObject` the command returns
     */
    run(userInput, rawInput, term) {
        let returnValue;
        let exitCode;
        const parsedInput = this.parseInput(userInput);
        try {
            returnValue = this._action(parsedInput.args, parsedInput.options, term);
            exitCode = 0;
        }
        catch (error) {
            returnValue = { error: error };
            console.error(error);
            exitCode = 1;
        }
        const exitReply = new ExitObject(userInput, rawInput, this, exitCode, returnValue);
        return exitReply;
    }
}
/**
 * An object that is returned when a command is executed.
 */
export class ExitObject {
    _command;
    _timestamp;
    _exitCode;
    _userInput;
    _rawInput;
    _output;
    /**
     * Get the command that was executed.
     * @type {Command | undefined}
     */
    get command() { return this._command; }
    /**
     * Get the timestamp of the execution.
     * @type {number}
     */
    get timestamp() { return this._timestamp; }
    /**
     * Get the exit code of the execution.
     * @type {number}
     */
    get exitCode() { return this._exitCode; }
    /**
     * Get the input that was used to execute the command.
     * @type {string[]}
     */
    get userInput() { return this._userInput; }
    /**
     * Get the raw input that was entered to execute the command.
     * @type {string}
     */
    get rawInput() { return this._rawInput; }
    /**
     * Get the output of the execution.
     * @type {any}
     */
    get output() { return this._output; }
    /**
     * @param {string[]} userInput - the input array that was used to execute the command
     * @param {string} rawInput - the raw input that was used to execute the command
     * @param {Command | undefined} command - the command that was executed; `undefined` if the command is not found
     * @param {number} exitCode - the exit code of the command
     * @param {object} output - the output of the command
     */
    constructor(userInput, rawInput, command, exitCode, output) {
        this._command = command;
        this._timestamp = Date.now();
        this._exitCode = exitCode;
        this._userInput = userInput;
        this._rawInput = rawInput;
        this._output = output;
    }
}
