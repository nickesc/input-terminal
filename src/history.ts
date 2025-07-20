import { Command } from './commands.ts';

export class HistoryCommand{
    command: Command | undefined;
    timestamp: Date;
    exit_code: number;
    user_input: string[];


    constructor(user_input: string[], command: Command | undefined, exit_code: number) {
        this.command = command;
        this.timestamp = new Date();
        this.exit_code = exit_code;
        this.user_input = user_input;
    }
}

export class TermHistory {

    public list: HistoryCommand[];
    private _index: number | undefined;

    constructor(history: HistoryCommand[] = []) {
        this.list = history;
    }

    public reset_index(): void {
        this._index = undefined;
    }

    public current(): HistoryCommand | undefined {
        if (this._index != undefined){
            return this.list[this._index];
        }
        return undefined;

    }


    public pop(): HistoryCommand | undefined {
        if (this._index == 0){this._index = undefined;}
        else if (this._index != undefined){this._index--;}

        return this.list.shift();
    }

    public push(command: HistoryCommand): number {
        if (this._index != undefined){this._index++;}

        return this.list.unshift(command);
    }

    public previous(): HistoryCommand | undefined {
        if (this.list.length > 0){
            if (this._index == undefined) {
                this._index = 0
            } else if (this._index < this.list.length-1){
                this._index++;
            }
            return this.list[this._index];
        }
        return undefined;
    }

    public next_history(): HistoryCommand | undefined {

        if (this.list.length <= 0 || this._index == undefined){
            this._index = undefined;
            return undefined;
        }

        if (this._index >= this.list.length){
            this._index = this.list.length - 1;
        } else {
            this._index--;
        }

        return this.list[this._index];

    }

}

