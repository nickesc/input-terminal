import { TermCommands, Command, ExitObject, ArgsOptions } from './commands.ts';
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

    private _listeners: TermListeners;
    private _started: boolean = false;
    private _lastExitCode: number | undefined = undefined;

    public get lastExitCode(): number | undefined {
        return this._lastExitCode;
    }

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

    public is_started(): boolean {
        return this._started;
    }

    public update_input(user_input?: string): void {
        this.input.value = this.options.preprompt + this.options.prompt + (user_input || "");
    }

    public get_input_value(): string {
        return this.input.value.slice(`${this.options.preprompt}${this.options.prompt}`.length);
    }

    public get_predictions(text?: string): string[] {
        let predictions: string[] = []
        if (text) {
            const partial_matches: string[] = this.commands.get_key_list().filter(key => key.startsWith(text));
            predictions = partial_matches;
        } else {
            predictions = this.commands.get_key_list();
        }
        return predictions;
    }

    public getInputArray(input: string): string[] {

        if (input.trim().length === 0) {
            return [""];
        }

        function clean_buffer(toClean: string){
            toClean = toClean.trim()
            toClean = toClean.replace(/\\/g, "")
            return toClean
        }

        const quotes: string[] = ['"', "'", "`"];
        let currQuote: string | null = null;
        let buffer: string = "";
        let result: string[] = [];

        for (let i = 0; i < input.length; i++) {
            const char = input[i];

            if (char) {
                if (quotes.includes(char) && buffer.slice(-1) !== "\\") {
                    if (currQuote == null) {
                        currQuote = char;
                    } else if (currQuote === char) {
                        result.push(clean_buffer(buffer));
                        buffer = "";
                        currQuote = null;
                    } else {
                        buffer += char;
                    }
                } else if (char === " " && currQuote == null) {
                    if (buffer.length > 0){
                        result.push(clean_buffer(buffer));
                        buffer = "";
                    }

                } else {
                    buffer += char;
                }
            }
        }
        if (buffer.length > 0){
            result.push(clean_buffer(buffer));
        }
        return result;
    }

    public execute_command(input: string): ExitObject {
        const user_input: string[] = this.getInputArray(input);
        const command: Command | undefined = this.commands.find(user_input[0]);
        const output: object = {}
        //const exitCode: number = 0;

        let exitObject: ExitObject;
        if (command) {
            //exitObject = new ExitObject(user_input, command, exitCode, output);
            exitObject = command.run(user_input, this);
        } else if (user_input[0] == "") {
            exitObject = new ExitObject(user_input, undefined, 0, output);
        } else {
            const errText: string = `Command ${user_input[0]} not found`;
            console.error(errText);
            exitObject = new ExitObject(user_input, undefined, 1, {error: errText});
        }
        //console.log(exitObject);

        //const exitObject = new ExitObject(user_input, command, exitCode, output);
        this._lastExitCode = exitObject.exit_code;
        this.history.push(exitObject);
        this.history.reset_index();

        return exitObject
    }


}

export {Command, ArgsOptions, ExitObject, TermCommands, TermHistory, TermOptions }
