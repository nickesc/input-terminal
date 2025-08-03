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
     * The arguments for the command.
     * @type {string[]}
     */
    get args() { return this._args; }
    /**
     * The options for the command.
     * @type {object}
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
 * @category none
 */
export class Command {
    _key;
    _action;
    /**
     * The key used to identify the command.
     * @type {string}
     */
    get key() { return this._key; }
    /**
     * The function to execute when the command is run.
     * @type {function}
     */
    get action() { return this._action; }
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
    run(user_input, term) {
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
        const exit_reply = new ExitObject(user_input, this, exit_code, return_value);
        return exit_reply;
    }
}
/**
 * An object that is returned when a command is executed.
 * @category none
 */
export class ExitObject {
    _command;
    _timestamp;
    _exit_code;
    _user_input;
    _output;
    /**
     * The command that was executed.
     * @type {Command | undefined}
     */
    get command() { return this._command; }
    /**
     * The timestamp of the execution.
     * @type {number}
     */
    get timestamp() { return this._timestamp; }
    /**
     * The exit code of the execution.
     * @type {number}
     */
    get exit_code() { return this._exit_code; }
    /**
     * The input that was used to execute the command.
     * @type {string[]}
     */
    get user_input() { return this._user_input; }
    /**
     * The output of the execution.
     * @type {object}
     */
    get output() { return this._output; }
    /**
     * @param {string[]} user_input - the input array that was used to execute the command
     * @param {Command | undefined} command - the command that was executed; `undefined` if the command is not found
     * @param {number} exit_code - the exit code of the command
     * @param {object} output - the output of the command
     */
    constructor(user_input, command, exit_code, output) {
        this._command = command;
        this._timestamp = Date.now();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._output = output;
    }
}
/**
 * Manages a list of commands that can be executed by a terminal.
 * @category Terminal Components
 */
export class TermCommands {
    _list = [];
    /**
     * The list of commands in the terminal.
     * @type {Command[]}
     */
    get list() { return this._list; }
    /**
     * The list of commands in the terminal.
     * @type {Command[]}
     */
    set list(commands) { for (let command of commands) {
        this.add(command);
    } }
    /**
     * @param {Command[]} [commands] - an optional list of commands to initialize the terminal with
     */
    constructor(commands) {
        if (commands) {
            this.list = commands;
        }
    }
    /**
     * Retrieves a list of keys for all commands in the terminal.
     * @returns {string[]} a list of the keys of all commands in the terminal
     */
    get_command_keys() {
        return this._list.map(command => command.key);
    }
    /**
     * Finds a command by its key.
     * @param {string} [command_key] - the key of the command to find
     * @returns {Command | undefined} the command with the given key; `undefined` if the command is not found or if no key is provided
     */
    find(command_key) {
        if (!command_key) {
            return undefined;
        }
        ;
        return this.list.find(command => command.key === command_key);
    }
    /**
     * Adds a command to the terminal's command list.
     * @param {Command} command - the command to add
     * @returns {number} the new length of the command list
     */
    add(command) {
        if (!this._list.includes(command)) {
            this._list.push(command);
        }
        return this._list.length;
    }
    /**
     * Removes a command from the terminal's command list.
     * @param {Command} command - the command to remove
     * @returns {Command | undefined} the removed command; `undefined` if the command is not found
     */
    remove(command) {
        if (this._list.includes(command)) {
            this._list.splice(this._list.indexOf(command), 1);
            return command;
        }
        else {
            return undefined;
        }
    }
}
