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

    private _main(): void{
        return;
    }
}
