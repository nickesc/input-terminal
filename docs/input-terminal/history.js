import { ExitObject } from "./commands.js";
/**
 * Manages the terminal's history of commands.
 * @category Terminal Components
 */
export class TermHistory {
    _index;
    _items;
    /**
     * Get the items in the history.
     * @type {ExitObject[]}
     */
    get items() { return this._items; }
    /**
     * Set the items in the history.
     * @type {ExitObject[]}
     */
    set items(commandList) { this._items = commandList; }
    /**
     * @param {ExitObject[]} [history] - an optional history of commands to initialize the terminal with
     */
    constructor(history = []) {
        this._items = history;
    }
    /**
     * Resets the index to the beginning of the history.
     * @returns {void}
     */
    resetIndex() {
        this._index = undefined;
    }
    /**
     * Retrieves the active item at the current index in the terminal's history.
     * @returns {ExitObject | undefined} the item at the current index in the terminal's history; if no item is active, returns `undefined`
     */
    current() {
        if (this._index != undefined) {
            return this._items[this._index];
        }
        return undefined;
    }
    /**
     * Removes the first item from the terminal's history.
     * @returns {ExitObject | undefined} the popped item; if the history is empty, returns `undefined`
     */
    pop() {
        if (this._index == 0) {
            this._index = undefined;
        }
        else if (this._index != undefined) {
            this._index--;
        }
        return this._items.shift();
    }
    /**
     * Adds an item (or list of items) to the beginning of the terminal's history.
     * @param {ExitObject | ExitObject[]} exitObjects - the item (or list of items) to add to the history
     * @returns {number} the new length of the history
     */
    push(exitObjects) {
        if (exitObjects instanceof ExitObject) {
            exitObjects = [exitObjects];
        }
        if (this._index != undefined) {
            this._index++;
        }
        return this._items.unshift(...exitObjects);
    }
    /**
     * Shifts the history index to the previous item in the terminal's history.
     * @returns {ExitObject | null | undefined} the previous item in the terminal's history; if no items are in the history returns `undefined`, and if it is on the last item in the history returns `null`
     */
    previous() {
        if (this._items.length > 0) {
            if (this._index == undefined) {
                this._index = 0;
            }
            else if (this._index < this._items.length - 1) {
                this._index++;
            }
            else {
                return null;
            }
            return this._items[this._index];
        }
        return undefined;
    }
    /**
     * Shifts the history index to the next item in the terminal's history.
     * @returns {ExitObject | undefined} the next item in the terminal's history; if no item is available or you are on the first item in the history returns `undefined`
     */
    next() {
        if (this._items.length <= 0 || this._index == undefined || this._index <= 0) {
            this._index = undefined;
            return undefined;
        }
        this._index--;
        return this._items[this._index];
    }
}
