import { ExitObject } from './commands.ts';

/**
 * Manages the terminal's history of commands.
 * @param {ExitObject[]} [history] - an optional history of commands to initialize the history with
 */
export class TermHistory {
    private _index: number | undefined;

    private _items: ExitObject[];
    public get items(): ExitObject[] { return this._items; }
    public set items(command_list: ExitObject[]) { this._items = command_list; }

    constructor(history: ExitObject[] = []) {
        this._items = history;
    }

    /**
     * Resets the index to the beginning of the history.
     * @returns {void}
     */
    public reset_index(): void {
        this._index = undefined;
    }

    /**
     * Retrieves the active item at the current index in the terminal's history.
     * @returns {ExitObject | undefined} the item at the current index in the terminal's history; if no item is active, returns `undefined`
     */
    public current(): ExitObject | undefined {
        if (this._index != undefined){
            return this._items[this._index];
        }
        return undefined;
    }

    /**
     * Removes the first item from the terminal's history.
     * @returns {ExitObject | undefined} the popped item; if the history is empty, returns `undefined`
     */
    public pop(): ExitObject | undefined {
        if (this._index == 0){this._index = undefined;}
        else if (this._index != undefined){this._index--;}

        return this._items.shift();
    }

    /**
     * Adds an item to the beginning of the terminal's history.
     * @param {ExitObject} command - the item to add to the history
     * @returns {number} the new length of the history
     */
    public push(command: ExitObject): number {
        if (this._index != undefined){this._index++;}

        return this._items.unshift(command);
    }

    /**
     * Shifts the history index to the previous item in the terminal's history.
     * @returns {ExitObject | undefined} the previous item in the terminal's history; if no item is available, returns `undefined`
     */
    public previous(): ExitObject | undefined {
        if (this._items.length > 0){
            if (this._index == undefined) {
                this._index = 0
            } else if (this._index < this._items.length-1){
                this._index++;
            }
            return this._items[this._index];
        }
        return undefined;
    }

    /**
     * Shifts the history index to the next item in the terminal's history.
     * @returns {ExitObject | undefined} the next item in the terminal's history; if no item is available, returns `undefined`
     */
    public next(): ExitObject | undefined {

        if (this._items.length <= 0 || this._index == undefined || this._index <= 0){
            this._index = undefined;
            return undefined;
        }

        this._index--;

        return this._items[this._index];

    }

}

