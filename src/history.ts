import { Command } from './command';

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

    public history: HistoryCommand[];
    public _index: number | undefined;

    constructor(history: HistoryCommand[] = []) {
        this.history = history;
    }

    public reset_index(): void {
        this._index = undefined;
    }

    public current_history(): HistoryCommand | undefined {
        if (this._index != undefined){
            return this.history[this._index];
        }
        return undefined;

    }


    public pop_history(): HistoryCommand | undefined {
        if (this._index == 0){this._index = undefined;}
        else if (this._index != undefined){this._index--;}

        return this.history.shift();
    }

    public push_history(command: HistoryCommand): number {
        if (this._index != undefined){this._index++;}

        return this.history.unshift(command);
    }

    public previous_history(): HistoryCommand | undefined {
        if (this.history.length > 0){
            if (this._index == undefined) {
                this._index = 0
            } else if (this._index < this.history.length-1){
                this._index++;
            }
            return this.history[this._index];
        }
        return undefined;
    }

    public next_history(): HistoryCommand | undefined {

        if (this.history.length <= 0 || this._index == undefined){
            this._index = undefined;
            return undefined;
        }

        if (this._index >= this.history.length){
            this._index = this.history.length - 1;
        } else {
            this._index--;
        }

        return this.history[this._index];

    }

}

