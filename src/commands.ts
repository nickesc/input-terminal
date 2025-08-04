import { Terminal } from './input-terminal.ts';

/**
 * Manages and stores the arguments and options for a command.
 * @category Command Components
 */
export class ArgsOptions {
    private _user_input: string[];
    private _args: string[] = [];
    private _options = {};

    /**
     * Get the arguments for the command.
     * @type {string[]}
     */
    public get args(): string[] { return this._args; }

    /**
     * Get the options for the command.
     * @type {object}
     */
    public get options(): object { return this._options; }

    /**
     * @param {string[]} user_input - the input array to parse
     */
    constructor(user_input: string[]) {
        this._user_input = user_input;
        this.init();
    }

    private string2opt(string: string): void {
        const key: string = string.split("=")[0] || "";
        const value: string = string.split("=").slice(1).join("=");

        if (key && value){
            Object.assign(this._options, {[key]: {value:value}});
        } else if (key){
            Object.assign(this._options, {[key]: {value:undefined}});
        } else {
            console.error(`Unable to parse option: ${string}`);
        }
    }

    private init(): void {
        for (let i = 1; i < this._user_input.length; i++) {
            const item: string = this._user_input[i]!;
            if (item.startsWith("--")){
                this.string2opt(item.slice(2));
            } else if (item.startsWith("-")){
                this.string2opt(item.slice(1));
            } else {
                this._args.push(item);
            }
        }
    }
}

/**
 * An executable command that can be added to a terminal's command list.
 */
export class Command {
    private _key: string;
    private _action: (args: string[], options: {}, terminal: Terminal) => {};

    /**
     * Get the key used to identify the command.
     * @type {string}
     */
    public get key(): string { return this._key; }

    /**
     * Get the function to execute when the command is run.
     * @type {function}
     */
    public get action(): (args: string[], options: {}, terminal: Terminal) => {} { return this._action; }

    /**
     * @param {string} key - the key used to identify the command
     * @param {function} action - the function to execute when the command is run
     */
    constructor(key: string, action: (args: string[], options: {}, terminal: Terminal) => {}) {
        this._key = key;
        this._action = action;
    }

    /**
     * Parses an input array into an `ArgsOptions` object.
     * @param {string[]} user_input - the input array to parse
     * @returns {ArgsOptions} the parsed input
     */
    public parse_input(user_input: string[]): ArgsOptions {
        return new ArgsOptions(user_input);
    }

    /**
     * Runs the command with the given input.
     * @param {string[]} user_input - the input array to parse
     * @param {Terminal} term - the terminal to run the command in
     * @returns {ExitObject} the `ExitObject` the command returns
     */
    public run(user_input: string[], term: Terminal): ExitObject {
        let return_value: object;
        let exit_code: number;

        const parsed_input: ArgsOptions = this.parse_input(user_input);

        try {
            return_value = this._action(parsed_input.args, parsed_input.options, term);
            exit_code = 0;

        } catch (error) {
            return_value = {error: error};
            console.error(error);
            exit_code = 1;
        }
        const exit_reply: ExitObject = new ExitObject(user_input, this, exit_code, return_value);
        return exit_reply;
    }
}

/**
 * An object that is returned when a command is executed.
 */
export class ExitObject{
    private _command: Command | undefined;
    private _timestamp: number;
    private _exit_code: number;
    private _user_input: string[];
    private _output: any;

    /**
     * Get the command that was executed.
     * @type {Command | undefined}
     */
    public get command(): Command | undefined { return this._command; }

    /**
     * Get the timestamp of the execution.
     * @type {number}
     */
    public get timestamp(): number { return this._timestamp; }

    /**
     * Get the exit code of the execution.
     * @type {number}
     */
    public get exit_code(): number { return this._exit_code; }

    /**
     * Get the input that was used to execute the command.
     * @type {string[]}
     */
    public get user_input(): string[] { return this._user_input; }

    /**
     * Get the output of the execution.
     * @type {object}
     */
    public get output(): object { return this._output; }

    /**
     * @param {string[]} user_input - the input array that was used to execute the command
     * @param {Command | undefined} command - the command that was executed; `undefined` if the command is not found
     * @param {number} exit_code - the exit code of the command
     * @param {object} output - the output of the command
     */
    constructor(user_input: string[], command: Command | undefined, exit_code: number, output: any) {
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
export class TermCommands{
    private _list: Command[] = [];
    private _empty_command: Command = new Command("", (args, options, terminal) => { return {}; });

    /**
     * Get the list of commands in the terminal.
     * @type {Command[]}
     */
    public get list(): Command[] { return this._list; }

    /**
     * Set the list of commands in the terminal.
     * @type {Command[]}
     */
    public set list(commands: Command[]) { for (let command of commands){ this.add(command); } }

    /**
     * Get the command that is executed when empty input is provided.
     * @type {Command}
     */
    public get empty_command(): Command { return this._empty_command; }

    /**
     * Set the command that is executed when empty input is provided.
     * @type {Command}
     */
    public set empty_command(command: Command) { this._empty_command = command; }

    /**
     * @param {Command[]} [commands] - an optional list of commands to initialize the terminal with
     */
    constructor(commands?: Command[]) {
        if (commands){
            this.list = commands;
        }
    }
    /**
     * Retrieves a list of keys for all commands in the terminal.
     * @returns {string[]} a list of the keys of all commands in the terminal
     */
    public get_command_keys(): string[] {
        return this._list.map(command => command.key);
    }

    /**
     * Finds a command by its key.
     * @param {string} [command_key] - the key of the command to find
     * @returns {Command | undefined} the command with the given key; `undefined` if the command is not found or if no key is provided
     */
    public find(command_key?: string): Command | undefined {
        if (!command_key){return undefined;};
        return this.list.find(command => command.key === command_key);
    }

    /**
     * Adds a command to the terminal's command list.
     * @param {Command} command - the command to add
     * @returns {number} the new length of the command list
     */
    public add(command: Command): number {
        if (!this._list.includes(command)){
            this._list.push(command);
        }
        return this._list.length;
    }

    /**
     * Removes a command from the terminal's command list.
     * @param {Command} command - the command to remove
     * @returns {Command | undefined} the removed command; `undefined` if the command is not found
     */
    public remove(command: Command): Command | undefined {
        if (this._list.includes(command)){
            this._list.splice(this._list.indexOf(command), 1);
            return command;
        } else {
            return undefined;
        }
    }
}
