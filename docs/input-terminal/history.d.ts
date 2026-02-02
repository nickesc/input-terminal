import { ExitObject } from "./commands.ts";
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
    set items(commandList: ExitObject[]);
    /**
     * @param {ExitObject[]} [history] - an optional history of commands to initialize the terminal with
     */
    constructor(history?: ExitObject[]);
    /**
     * Resets the index to the beginning of the history.
     * @returns {void}
     */
    resetIndex(): void;
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
     * Adds an item (or list of items) to the beginning of the terminal's history.
     * @param {ExitObject | ExitObject[]} exitObjects - the item (or list of items) to add to the history
     * @returns {number} the new length of the history
     */
    push(exitObjects: ExitObject | ExitObject[]): number;
    /**
     * Shifts the history index to the previous item in the terminal's history.
     * @returns {ExitObject | null | undefined} the previous item in the terminal's history; if no items are in the history returns `undefined`, and if it is on the last item in the history returns `null`
     */
    previous(): ExitObject | null | undefined;
    /**
     * Shifts the history index to the next item in the terminal's history.
     * @returns {ExitObject | undefined} the next item in the terminal's history; if no item is available or you are on the first item in the history returns `undefined`
     */
    next(): ExitObject | undefined;
}
