import { ExitObject } from './commands.ts';

export class TermHistory {
    private _index: number | undefined;

    private _items: ExitObject[];
    public get items(): ExitObject[] { return this._items; }
    public set items(command_list: ExitObject[]) { this._items = command_list; }

    constructor(history: ExitObject[] = []) {
        this._items = history;
    }

    public reset_index(): void {
        this._index = undefined;
    }

    public current(): ExitObject | undefined {
        if (this._index != undefined){
            return this._items[this._index];
        }
        return undefined;
    }

    public pop(): ExitObject | undefined {
        if (this._index == 0){this._index = undefined;}
        else if (this._index != undefined){this._index--;}

        return this._items.shift();
    }

    public push(command: ExitObject): number {
        if (this._index != undefined){this._index++;}

        return this._items.unshift(command);
    }

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

    public next(): ExitObject | undefined {

        if (this._items.length <= 0 || this._index == undefined || this._index <= 0){
            this._index = undefined;
            return undefined;
        }

        this._index--;

        return this._items[this._index];

    }

}

