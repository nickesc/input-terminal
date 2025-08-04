import { ExitObject } from './commands.ts';
/**
 * Manages the terminal's history of commands.
 * @category Terminal Components
 */
export declare class TermHistory {
    private _index;
    private _items;
    /**
     * Get the items in the history.
     * @type {ExitObject[]}
     */
    get items(): ExitObject[];
    /**
     * Set the items in the history.
     * @type {ExitObject[]}
     */
    set items(command_list: ExitObject[]);
    /**
     * @param {ExitObject[]} [history] - an optional history of commands to initialize the terminal with
     */
    constructor(history?: ExitObject[]);
    /**
     * Resets the index to the beginning of the history.
     * @returns {void}
     */
    reset_index(): void;
    /**
     * Retrieves the active item at the current index in the terminal's history.
     * @returns {ExitObject | undefined} the item at the current index in the terminal's history; if no item is active, returns `undefined`
     */
    current(): ExitObject | undefined;
    /**
     * Removes the first item from the terminal's history.
     * @returns {ExitObject | undefined} the popped item; if the history is empty, returns `undefined`
     */
    pop(): ExitObject | undefined;
    /**
     * Adds an item to the beginning of the terminal's history.
     * @param {ExitObject} command - the item to add to the history
     * @returns {number} the new length of the history
     */
    push(command: ExitObject): number;
    /**
     * Shifts the history index to the previous item in the terminal's history.
     * @returns {ExitObject | undefined} the previous item in the terminal's history; if no item is available, returns `undefined`
     */
    previous(): ExitObject | undefined;
    /**
     * Shifts the history index to the next item in the terminal's history.
     * @returns {ExitObject | undefined} the next item in the terminal's history; if no item is available, returns `undefined`
     */
    next(): ExitObject | undefined;
}
