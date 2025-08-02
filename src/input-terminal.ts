import { TermCommands, Command, ExitObject, ArgsOptions } from './commands.ts';
import { TermHistory } from './history.ts';
import { TermListeners } from './listeners.ts';
import { TermOptions } from './options.ts';

/**
 * @fileoverview Allows you to turn any `HTMLInputElement` into a terminal interface. Define custom commands that can be executed by users, track command history, autocomplete commands, and more.
 *
 * @module input-terminal
 */

/**
 * Allows you to turn any `HTMLInputElement` into a terminal interface. Define custom commands that can be executed by users, track command history, autocomplete commands, and more.
 *
 * @example
 * ```typescript
 * import { Terminal, Command } from "input-terminal";
 * const input = document.getElementById("terminal") as HTMLInputElement;
 * const terminal = new Terminal(input, { prompt: ">> " });
 * terminal.commands.add(new Command("echo", (args, options, terminal) => {
 *     console.log(args);
 *     return {};
 * }));
 * terminal.init();
 * ```
 */
export class Terminal {

    public input: HTMLInputElement;
    public history: TermHistory;
    public commands: TermCommands;
    public options: TermOptions;

    private _listeners: TermListeners;

    private _started: boolean = false;
    public get started(): boolean { return this._started; }

    private _lastExitCode: number | undefined = undefined;
    public get lastExitCode(): number | undefined { return this._lastExitCode; }

    /**
     * @param {HTMLInputElement} input - input element to turn into a terminal
     * @param {object} options - terminal configuration
     * @param {ExitObject[]} commandHistory - history of commands that have been executed
     * @param {Command[]} commandList - list of commands that can be executed by the user
     */
    constructor(input: HTMLInputElement, options: object = {}, commandHistory: ExitObject[] = [], commandList: Command[] = []) {
        this.input = input;
        this.history = new TermHistory(commandHistory);
        this.commands = new TermCommands(commandList);
        this.options = new TermOptions(options);
        this._listeners = new TermListeners(this);
    }

    /**
     * Initializes the terminal. Attaches input listeners and updates the input.
     * @returns {void}
     */
    public init(): void {
        if (!this._started){
            this._listeners.attach_input_listeners();
            this.update_input();
            this._started = true
        }
    }

    /**
     * Updates the terminal's user input value.
     * @param {string} [user_input] - the value to update the input with; clears the input if no value is provided
     * @returns {void}
     */
    public update_input(user_input?: string): void {
        this.input.value = this.options.preprompt + this.options.prompt + (user_input || "");
    }

    /**
     * Gets the terminal's user input.
     * @returns {string} The string in the input, not including the preprompt and prompt
     */
    public get_input_value(): string {
        return this.input.value.slice(`${this.options.preprompt}${this.options.prompt}`.length);
    }

    /**
     * Gets the command predictions based on the user's input.
     * @param {string} [text] - The text to get predictions for; if no text is provided, all commands are returned
     * @returns {string[]} The predictions for the terminal's user input
     */
    public get_predictions(text?: string): string[] {
        let predictions: string[] = []
        if (text) {
            const partial_matches: string[] = this.commands.get_command_keys().filter(key => key.startsWith(text));
            predictions = partial_matches;
        } else {
            predictions = this.commands.get_command_keys();
        }
        return predictions;
    }

    /**
     * Converts the user's input into an array for command execution.
     * @param {string} input - The string to convert into an array
     * @returns {string[]} The array created from the input
     */
    public get_input_array(input: string): string[] {

        function clean_buffer(toClean: string){
            toClean = toClean.trim()
            toClean = toClean.replace(/\\/g, "")
            return toClean
        }

        if (input.trim().length === 0) {
            return [""];
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

    /**
     * Executes a command based on the user's input.
     * @param {string} input - The command to execute
     * @returns {ExitObject} The ExitObject returned by the execution
     */
    public execute_command(input: string): ExitObject {
        const user_input: string[] = this.get_input_array(input);
        const command: Command | undefined = this.commands.find(user_input[0]);
        const output: object = {}

        let exitObject: ExitObject;
        if (command) {
            exitObject = command.run(user_input, this);
        } else if (user_input[0] == "") {
            exitObject = new ExitObject(user_input, undefined, 0, output);
        } else {
            const errText: string = `Command ${user_input[0]} not found`;
            console.error(errText);
            exitObject = new ExitObject(user_input, undefined, 1, {error: errText});
        }

        this._lastExitCode = exitObject.exit_code;
        this.history.push(exitObject);
        this.history.reset_index();

        return exitObject
    }
}

export {Command, ArgsOptions, ExitObject, TermCommands, TermHistory, TermOptions }
