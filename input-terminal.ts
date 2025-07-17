/**
 * @fileoverview description
 *
 * @module input-terminal
 */

interface TermCallback { (object: object): any }

export class Command {
    public user_input: string[];

    constructor(user_input: string[]) {
        this.user_input = user_input;
    }
}



/**
 * @class
 */
export class Terminal {

    public input: HTMLInputElement;
    private _preprompt: string;
    private _prompt: string;
    private _commandHistory: Command[];
    private _historyIndex?: number;

    /**
     * @constructor
     */
    constructor(input: HTMLInputElement, commandHistory: Command[] = [], preprompt: string = "", prompt: string = "> ",) {
        this.input = input;
        this._preprompt = preprompt;
        this._prompt = prompt;
        this._commandHistory = commandHistory;
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

    public get_history(): Command[] {
        return this._commandHistory;
    }

    public current_history(): Command | undefined {
        if (this._historyIndex != undefined){
            return this._commandHistory[this._historyIndex];
        }
        return undefined;

    }


    public pop_history(): Command | undefined {
        if (this._historyIndex == 0){this._historyIndex = undefined;}
        else if (this._historyIndex != undefined){this._historyIndex--;}

        return this._commandHistory.shift();
    }

    public push_history(command: Command): number {
        return this._commandHistory.push(command);
    }

    private _main(): void{
        return;
    }
}
