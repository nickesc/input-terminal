import { Command } from "./commands.ts";

/**
 * Manages a list of commands that can be executed by a terminal.
 * @category Terminal Components
 */
export class TermBin{
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
     * @throws {Error} if any command in the list has a key that already exists
     */
    public set list(commands: Command[]) {
        this._list = [];
        for (let command of commands){ this.add(command); }
    }

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
     * @throws an error if a command with the same key already exists
     */
    public add(command: Command): number {
        if (this.find(command.key)) {
            throw new Error(`Command with key "${command.key}" already exists`);
        }
        this._list.push(command);
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
