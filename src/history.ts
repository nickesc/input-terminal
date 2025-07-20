import { Command } from './commands.ts';

export class ExitObject{
    private _command: Command | undefined;
    private _timestamp: Date;
    private _exit_code: number;
    private _user_input: string[];
    private _output: object;
    private _callbackResponse: any;

    constructor(user_input: string[], command: Command | undefined, exit_code: number, output: object, callbackResponse?: any) {
        this._command = command;
        this._timestamp = new Date();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._output = output;
        this._callbackResponse = callbackResponse;
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

    public get callbackResponse(): any {
        return this._callbackResponse;
    }
}

export class TermHistory {

    private _commands: ExitObject[];
    private _index: number | undefined;

    public get commands(): ExitObject[] {
        return this._commands;
    }

    public set commands(command_list: ExitObject[]) {
        this._commands = command_list;
    }



    constructor(history: ExitObject[] = []) {
        this._commands = history;
    }

    public reset_index(): void {
        this._index = undefined;
    }

    public current(): ExitObject | undefined {
        if (this._index != undefined){
            return this._commands[this._index];
        }
        return undefined;
    }

    public pop(): ExitObject | undefined {
        if (this._index == 0){this._index = undefined;}
        else if (this._index != undefined){this._index--;}

        return this._commands.shift();
    }

    public push(command: ExitObject): number {
        if (this._index != undefined){this._index++;}

        return this._commands.unshift(command);
    }

    public previous(): ExitObject | undefined {
        if (this._commands.length > 0){
            if (this._index == undefined) {
                this._index = 0
            } else if (this._index < this._commands.length-1){
                this._index++;
            }
            return this._commands[this._index];
        }
        return undefined;
    }

    public next(): ExitObject | undefined {

        if (this._commands.length <= 0 || this._index == undefined || this._index <= 0){
            this._index = undefined;
            return undefined;
        }

        this._index--;

        return this._commands[this._index];

    }

}

