import { Command } from "./commands.ts";
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
export declare const built_ins: Command[];
/**
 * Manages the list of commands that can be executed by a terminal.
 * @category Terminal Components
 */
export declare class TermBin {
    private _commands;
    private _emptyCommand;
    /**
     * Get the list of commands in the terminal's bin.
     * @type {Command[]}
     */
    get list(): Command[];
    /**
     * Set the list of commands in the terminal's bin.
     * @type {Command[]}
     * @throws {Error} if any command in the list has a key that already exists
     */
    set list(commands: Command[]);
    /**
     * Get the command that is executed when empty input is provided.
     * @type {Command}
     */
    get emptyCommand(): Command;
    /**
     * Set the command that is executed when empty input is provided.
     * @type {Command}
     */
    set emptyCommand(command: Command);
    /**
     * @param {Command[]} [commands] - an optional list of commands to initialize the terminal with
     */
    constructor(commands?: Command[]);
    /**
     * Retrieves a list of keys for all commands in the terminal's bin.
     * @returns {string[]} a list of the keys of all commands in the terminal's bin
     */
    getCommandKeys(): string[];
    /**
     * Finds a command by its key in the terminal's bin.
     * @param {string} [commandKey] - the key of the command to find
     * @returns {Command | undefined} the command with the given key; `undefined` if the command is not found or if no key is provided
     */
    find(commandKey?: string): Command | undefined;
    /**
     * Adds a command (or list of commands) to the terminal's bin.
     * @param {Command | Command[]} commands - the command (or list of commands) to add to the terminal's bin
     * @returns {number} the new length of the command list
     * @throws an error if a command with the same key already exists
     */
    add(commands: Command | Command[]): number;
    /**
     * Removes a command from the terminal's command list.
     * @param {Command} command - the command to remove
     * @returns {Command | undefined} the removed command; `undefined` if the command is not found
     */
    remove(command: Command): Command | undefined;
}
