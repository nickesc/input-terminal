import {Command} from "./commands.ts";
import * as builtIns from "./built-ins/index.ts";

/**
 * A list of built-in commands that can be executed by a terminal.
 *
 * ## Commands
 * - `echo`
 * - `alert`
 * - `result`
 * - `man`
 * - `return`
 *
 * @type {Command[]}
 * @category Terminal Components
 */
export const built_ins: Command[] = Object.values(builtIns);

/**
 * Manages the list of commands that can be executed by a terminal.
 * @category Terminal Components
 */
export class TermBin {
    private _commands: Map<string, Command> = new Map();
    private _emptyCommand: Command = new Command("", (args, options, terminal) => {
        return {};
    });

    /**
     * Get the list of commands in the terminal's bin.
     * @type {Command[]}
     */
    public get list(): Command[] {
        return Array.from(this._commands.values());
    }

    /**
     * Set the list of commands in the terminal's bin.
     * @type {Command[]}
     * @throws {Error} if any command in the list has a key that already exists
     */
    public set list(commands: Command[]) {
        this._commands.clear();
        this.add(commands);
    }

    /**
     * Get the command that is executed when empty input is provided.
     * @type {Command}
     */
    public get emptyCommand(): Command {
        return this._emptyCommand;
    }

    /**
     * Set the command that is executed when empty input is provided.
     * @type {Command}
     */
    public set emptyCommand(command: Command) {
        this._emptyCommand = command;
    }

    /**
     * @param {Command[]} [commands] - an optional list of commands to initialize the terminal with
     */
    constructor(commands?: Command[]) {
        if (commands) {
            this.add(commands);
        }
    }

    /**
     * Retrieves a list of keys for all commands in the terminal's bin.
     * @returns {string[]} a list of the keys of all commands in the terminal's bin
     */
    public getCommandKeys(): string[] {
        return Array.from(this._commands.keys());
    }

    /**
     * Finds a command by its key in the terminal's bin.
     * @param {string} [commandKey] - the key of the command to find
     * @returns {Command | undefined} the command with the given key; `undefined` if the command is not found or if no key is provided
     */
    public find(commandKey?: string): Command | undefined {
        if (!commandKey) {
            return undefined;
        }
        return this._commands.get(commandKey);
    }

    /**
     * Adds a command (or list of commands) to the terminal's bin.
     * @param {Command | Command[]} commands - the command (or list of commands) to add to the terminal's bin
     * @returns {number} the new length of the command list
     * @throws an error if a command with the same key already exists
     */
    public add(commands: Command | Command[]): number {
        const toAdd = Array.isArray(commands) ? commands : [commands];

        for (const command of toAdd) {
            if (this._commands.has(command.key)) {
                throw new Error(`Command with key "${command.key}" already exists`);
            }
            this._commands.set(command.key, command);
        }

        return this._commands.size;
    }

    /**
     * Removes a command from the terminal's command list.
     * @param {Command} command - the command to remove
     * @returns {Command | undefined} the removed command; `undefined` if the command is not found
     */
    public remove(command: Command): Command | undefined {
        if (this._commands.has(command.key) && this._commands.get(command.key) === command) {
            this._commands.delete(command.key);
            return command;
        }
        return undefined;
    }
}
