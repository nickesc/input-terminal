import { Terminal } from "./input-terminal.js";
/**
 * Manages and stores the arguments and options for a command.
 * @category Command Components
 */
export class ArgsOptions {
    _user_input;
    _args = [];
    _options = {};
    /**
     * Get the arguments for the command.
     * @type {string[]}
     */
    get args() { return this._args; }
    /**
     * Get the options for the command.
     * @type {Record<string, any>}
     */
    get options() { return this._options; }
    /**
     * @param {string[]} user_input - the input array to parse
     */
    constructor(user_input) {
        this._user_input = user_input;
        this.init();
    }
    string2opt(string) {
        const key = string.split("=")[0] || "";
        const value = string.split("=").slice(1).join("=");
        if (key && value) {
            Object.assign(this._options, { [key]: { value: value } });
        }
        else if (key) {
            Object.assign(this._options, { [key]: { value: undefined } });
        }
        else {
            console.error(`Unable to parse option: ${string}`);
        }
    }
    init() {
        for (let i = 1; i < this._user_input.length; i++) {
            const item = this._user_input[i];
            if (item.startsWith("--")) {
                this.string2opt(item.slice(2));
            }
            else if (item.startsWith("-")) {
                this.string2opt(item.slice(1));
            }
            else {
                this._args.push(item);
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
     * @param {string[]} user_input - the input array to parse
     * @returns {ArgsOptions} the parsed input
     */
    parse_input(user_input) {
        return new ArgsOptions(user_input);
    }
    /**
     * Runs the command with the given input.
     * @param {string[]} user_input - the input array to parse
     * @param {Terminal} term - the terminal to run the command in
     * @returns {ExitObject} the `ExitObject` the command returns
     */
    run(user_input, raw_input, term) {
        let return_value;
        let exit_code;
        const parsed_input = this.parse_input(user_input);
        try {
            return_value = this._action(parsed_input.args, parsed_input.options, term);
            exit_code = 0;
        }
        catch (error) {
            return_value = { error: error };
            console.error(error);
            exit_code = 1;
        }
        const exit_reply = new ExitObject(user_input, raw_input, this, exit_code, return_value);
        return exit_reply;
    }
}
/**
 * An object that is returned when a command is executed.
 */
export class ExitObject {
    _command;
    _timestamp;
    _exit_code;
    _user_input;
    _raw_input;
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
    get exit_code() { return this._exit_code; }
    /**
     * Get the input that was used to execute the command.
     * @type {string[]}
     */
    get user_input() { return this._user_input; }
    /**
     * Get the raw input that was entered to execute the command.
     * @type {string}
     */
    get raw_input() { return this._raw_input; }
    /**
     * Get the output of the execution.
     * @type {object}
     */
    get output() { return this._output; }
    /**
     * @param {string[]} user_input - the input array that was used to execute the command
     * @param {Command | undefined} command - the command that was executed; `undefined` if the command is not found
     * @param {number} exit_code - the exit code of the command
     * @param {object} output - the output of the command
     */
    constructor(user_input, raw_input, command, exit_code, output) {
        this._command = command;
        this._timestamp = Date.now();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._raw_input = raw_input;
        this._output = output;
    }
}
