/**
 * @fileoverview description
 *
 * @module input-terminal
 */

interface TermCallback { (object: object): any }

export class Command {
    public command: string;

    constructor(command: string) {
        this.command = command;
    }
}

export class HistoryCommand{
    command: Command | undefined;
    timestamp: Date;
    exit_code: number;

    constructor(user_input: string[], command: Command | undefined, exit_code: number) {
        this.command = command;
        this.timestamp = new Date();
        this.exit_code = exit_code;
    }
}



/**
 * @class
 */
export class Terminal {

    public input: HTMLInputElement;
    private _preprompt: string = "";
    private _prompt: string = "> ";
    private _commandHistory: HistoryCommand[];
    private _historyIndex?: number;
    private _commandList: Command[];


    /**
     * @constructor
     */
    constructor(input: HTMLInputElement, commandHistory: HistoryCommand[] = [], commandList: Command[] = []) {
        this.input = input;
        this._commandHistory = commandHistory;
        this._commandList = commandList;
        this._main();

    }

    public execute_command(command: Command, callback?: TermCallback): number {
        let output: object = {}
        const callbackResponse = callback?.(output)
        const exitCode: number = 0;

        this._historyIndex = undefined;
        return exitCode;
    }

    public get_prediction(text?: string): string {
        let prediction: string = ""
        return prediction;
    }

    public get_prompt(): string {
        return this._prompt;
    }

    public set_prompt(prompt: string): void {
        this._prompt = prompt;
    }

    public get_preprompt(): string {
        return this._preprompt;
    }

    public set_preprompt(preprompt: string): void {
        this._preprompt = preprompt;
    }

    public get_history(): HistoryCommand[] {
        return this._commandHistory;
    }

    public current_history(): HistoryCommand | undefined {
        if (this._historyIndex != undefined){
            return this._commandHistory[this._historyIndex];
        }
        return undefined;

    }


    public pop_history(): HistoryCommand | undefined {
        if (this._historyIndex == 0){this._historyIndex = undefined;}
        else if (this._historyIndex != undefined){this._historyIndex--;}

        return this._commandHistory.shift();
    }

    public push_history(command: HistoryCommand): number {
        if (this._historyIndex != undefined){this._historyIndex++;}

        return this._commandHistory.unshift(command);
    }

    public previous_history(): HistoryCommand | undefined {
        if (this._commandHistory.length > 0){
            if (this._historyIndex == undefined) {
                this._historyIndex = 0
            } else if (this._historyIndex < this._commandHistory.length-1){
                this._historyIndex++;
            }
            return this._commandHistory[this._historyIndex];
        }
        return undefined;
    }

    public next_history(): HistoryCommand | undefined {

        if (this._commandHistory.length <= 0 || this._historyIndex == undefined){
            this._historyIndex = undefined;
            return undefined;
        }

        if (this._historyIndex >= this._commandHistory.length){
            this._historyIndex = this._commandHistory.length - 1;
        } else {
            this._historyIndex--;
        }

        return this._commandHistory[this._historyIndex];

    }

    private _main(): void{
        return;
    }
}
