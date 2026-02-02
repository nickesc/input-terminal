import {Command} from "./commands.ts";
import {echo} from "./built-ins/echo.ts";
import {alert} from "./built-ins/alert.ts";
import {result} from "./built-ins/result.ts";
import {man} from "./built-ins/man.ts";
import {return_} from "./built-ins/return.ts";
import {commands} from "./built-ins/commands.ts";

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
export const built_ins: Command[] = [echo, alert, result, man, commands, return_];

/**
 * Manages the list of commands that can be executed by a terminal.
 * @category Terminal Components
 */
export class TermBin {
    private _list: Command[] = [];
    private _emptyCommand: Command = new Command("", (args, options, terminal) => {
        return {};
    });

    /**
     * Get the list of commands in the terminal's bin.
     * @type {Command[]}
     */
    public get list(): Command[] {
        return this._list;
    }

    /**
     * Set the list of commands in the terminal's bin.
     * @type {Command[]}
     * @throws {Error} if any command in the list has a key that already exists
     */
    public set list(commands: Command[]) {
        this._list = [];
        for (let command of commands) {
            this.add(command);
        }
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
            this.list = commands;
        }
    }

    /**
     * Retrieves a list of keys for all commands in the terminal's bin.
     * @returns {string[]} a list of the keys of all commands in the terminal's bin
     */
    public getCommandKeys(): string[] {
        return this._list.map((command) => command.key);
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
        return this.list.find((command) => command.key === commandKey);
    }

    /**
     * Adds a command (or list of commands) to the terminal's bin.
     * @param {Command | Command[]} commands - the command (or list of commands) to add to the terminal's bin
     * @returns {number} the new length of the command list
     * @throws an error if a command with the same key already exists
     */
    public add(commands: Command | Command[]): number {
        if (commands instanceof Command) {
            commands = [commands];
        }

        commands.map((command) => {
            if (this.find(command.key)) {
                throw new Error(`Command with key "${command.key}" already exists`);
            }
            this._list.push(command);
        });

        return this._list.length;
    }

    /**
     * Removes a command from the terminal's command list.
     * @param {Command} command - the command to remove
     * @returns {Command | undefined} the removed command; `undefined` if the command is not found
     */
    public remove(command: Command): Command | undefined {
        if (this._list.includes(command)) {
            this._list.splice(this._list.indexOf(command), 1);
            return command;
        } else {
            return undefined;
        }
    }
}
