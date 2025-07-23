import { ExitObject } from "./commands.js";
export class TermHistory {
    get items() {
        return this._items;
    }
    set items(command_list) {
        this._items = command_list;
    }
    constructor(history = []) {
        this._items = history;
    }
    reset_index() {
        this._index = undefined;
    }
    current() {
        if (this._index != undefined) {
            return this._items[this._index];
        }
        return undefined;
    }
    pop() {
        if (this._index == 0) {
            this._index = undefined;
        }
        else if (this._index != undefined) {
            this._index--;
        }
        return this._items.shift();
    }
    push(command) {
        if (this._index != undefined) {
            this._index++;
        }
        return this._items.unshift(command);
    }
    previous() {
        if (this._items.length > 0) {
            if (this._index == undefined) {
                this._index = 0;
            }
            else if (this._index < this._items.length - 1) {
                this._index++;
            }
            return this._items[this._index];
        }
        return undefined;
    }
    next() {
        if (this._items.length <= 0 || this._index == undefined || this._index <= 0) {
            this._index = undefined;
            return undefined;
        }
        this._index--;
        return this._items[this._index];
    }
}
