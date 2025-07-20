import { Command } from './commands.ts';

export class ExitObject{
    private _command: Command | undefined;
    private _timestamp: Date;
    private _exit_code: number;
    private _user_input: string[];
    private _output: object;

    constructor(user_input: string[], command: Command | undefined, exit_code: number, output: object) {
        this._command = command;
        this._timestamp = new Date();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._output = output;
    }

    public get command(): Command | undefined {
        return this._command;
    }

    public get timestamp(): Date {
        return this._timestamp;
    }

    public get exit_code(): number {
        return this._exit_code;
    }

    public get user_input(): string[] {
        return this._user_input;
    }

    public get output(): object {
        return this._output;
    }
}

export class TermHistory {

    private _items: ExitObject[];
    private _index: number | undefined;

    public get items(): ExitObject[] {
        return this._items;
    }

    public set items(command_list: ExitObject[]) {
        this._items = command_list;
    }



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

