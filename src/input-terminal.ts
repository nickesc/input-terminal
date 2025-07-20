import { TermCommands, Command, ExitObject } from './commands.ts';
import { TermHistory } from './history.ts';
import { TermListeners } from './listeners.ts';
import { TermOptions } from './options.ts';

/**
 * @fileoverview description
 *
 * @module input-terminal
 */

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
    constructor(input: HTMLInputElement, options: object = {}, commandHistory: ExitObject[] = [], commandList: Command[] = []) {
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

    public isStarted(): boolean {
        return this._started;
    }


    public update_input(user_input?: string): void {
        this.input.value = this.options.preprompt + this.options.prompt + (user_input || "");
    }

    public get_prediction(text?: string): string {
        let prediction: string = ""
        return prediction;
    }

    public parse_command(input: string): Command | undefined {
        return new Command("key");
    }

    public execute_command(input: string): ExitObject {
        // EXECUTION CODE TO GO HERE.....
        // remove callback for now

        const user_input: string[] = input.split(" ");
        const command: Command | undefined = this.parse_command(input);
        const output: object = {}
        const exitCode: number = 0;

        this.history.reset_index();

        return new ExitObject(user_input, command, exitCode, output);
    }


}

export {Command, ExitObject, TermCommands, TermHistory, TermOptions }
