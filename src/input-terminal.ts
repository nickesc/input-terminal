import { TermCommands, Command } from './commands.ts';
import { TermHistory, HistoryCommand } from './history.ts';
import { TermListeners } from './listeners.ts';
import { TermOptions } from './options.ts';


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
    public options: TermOptions;

    private _listeners: TermListeners
    private _started: boolean = false;


    /**
     * @constructor
     */
    constructor(input: HTMLInputElement, options: object = {}, commandHistory: HistoryCommand[] = [], commandList: Command[] = []) {
        this.input = input;
        this.history = new TermHistory(commandHistory);
        this.commands = new TermCommands(commandList);
        this.options = new TermOptions(options);
        this._listeners = new TermListeners(this);

    }

    public init(): void {
        if (!this._started){
            this._listeners.attach_input_listeners();
            this.update_input();
            this._started = true
        }
    }

    public update_input(user_input?: string): void {
        this.input.value = this.options.preprompt + this.options.prompt + (user_input || "");
    }

    public get_prediction(text?: string): string {
        let prediction: string = ""
        return prediction;
    }

    public execute_command(command: Command, callback?: TermCallback): number {
        let output: object = {}
        const callbackResponse = callback?.(output)
        const exitCode: number = 0;

        this.history.reset_index();
        return exitCode;
    }


}

export { Command, HistoryCommand, TermCommands, TermHistory, TermOptions }
