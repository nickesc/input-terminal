import { TermCommands, Command } from './commands.ts';
import { TermHistory, HistoryCommand } from './history.ts';

/**
 * @fileoverview description
 *
 * @module input-terminal
 */

interface TermCallback { (object: object): any }

/**
 * @class
 */
export class Terminal {

    public input: HTMLInputElement;
    public history: TermHistory;
    public commands: TermCommands;
    private _preprompt: string = "";
    private _prompt: string = "> ";
    private _startFocused: boolean = false;

    /**
     * @constructor
     */
    constructor(input: HTMLInputElement, commandHistory: HistoryCommand[] = [], commandList: Command[] = []) {
        this.input = input;
        this.history = new TermHistory(commandHistory);
        this.commands = new TermCommands(commandList);
    }

    public init(focused?: boolean): void {
        this.attach_input_listeners();
        this.update_input();
    }

    public attach_input_listeners(previousKey: string = "ArrowUp", nextKey: string = "ArrowDown"): void {
        this.input.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case previousKey:
                    event.preventDefault();
                    this.update_input(this.history.previous()?.user_input.join(" "))
                    break;
                case nextKey:
                    event.preventDefault();
                    this.update_input(this.history.next()?.user_input.join(" "))
                    break;
                case "Backspace":
                case "Delete":
                case "ArrowLeft":
                    if (this.input.selectionStart !== null && this.input.selectionStart <= (this._preprompt + this._prompt).length) {
                        event.preventDefault();
                    }
                    break;
            }
        });
        this.input.addEventListener("selectionchange", (event: Event) => {
            const promptLength: number = (this._preprompt + this._prompt).length;
            const start: number | null = this.input.selectionStart;
            const end: number | null = this.input.selectionEnd;
            const direction = this.input.selectionDirection;

            if (start !== null && start < promptLength) {
                if (end !== null && end <= promptLength) {
                    this.input.setSelectionRange(promptLength, promptLength);
                } else if (end !== null) {
                    this.input.setSelectionRange(promptLength, end, direction || undefined);
                } else {
                    this.input.selectionStart = promptLength;
                }
            }
        })
    }

    public update_input(user_input?: string): void {
        this.input.value = this._preprompt + this._prompt + (user_input || "");
    }



    public execute_command(command: Command, callback?: TermCallback): number {
        let output: object = {}
        const callbackResponse = callback?.(output)
        const exitCode: number = 0;

        this.history.reset_index();
        return exitCode;
    }

    public get_prediction(text?: string): string {
        let prediction: string = ""
        return prediction;
    }

    public get prompt(): string {
        return this._prompt;
    }

    public set prompt(prompt: string) {
        this._prompt = prompt;
    }

    public get preprompt(): string {
        return this._preprompt;
    }

    public set preprompt(preprompt: string) {
        this._preprompt = preprompt;
    }

    private _main(): void{
        return;
    }
}

export { Command, HistoryCommand, TermCommands, TermHistory }
