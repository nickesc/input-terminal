import { Command, ExitObject, ArgsOptions } from './commands.ts';
import { TermHistory } from './history.ts';
import { TermListeners } from './listeners.ts';
import { TermOptions } from './options.ts';
import { TermBin, built_ins } from './bin.ts';

/**
 * @license MIT
 * @author nickesc
 * @module input-terminal
 * @showGroups
 */

/**
 * Allows you to turn any `HTMLInputElement` into a terminal interface. Define custom commands that can be executed by users, track command history, autocomplete commands, and more.
 *
 * @example
 * ```typescript
 * import { Terminal, Command } from "input-terminal";
 * const input = document.getElementById("terminal") as HTMLInputElement;
 * const terminal = new Terminal(input, { prompt: ">> " });
 * terminal.bin.add(new Command("echo", (args, options, terminal) => {
 *     console.log(args);
 *     return {};
 * }));
 * terminal.init();
 * ```
 */
export class Terminal extends EventTarget {
    private _listeners: TermListeners;
    private _started: boolean = false;

    private emitExecutedEvent(exitObject: ExitObject): void {
        this.dispatchEvent(new CustomEvent("inputTerminalExecuted", {detail: exitObject}));
    }

    /**
     * The input element that the terminal is attached to.
     * @type {HTMLInputElement}
     */
    public input: HTMLInputElement;

    /**
     * The element that the terminal should output text to.
     * @type {HTMLElement}
     */
    public output: HTMLElement | undefined = undefined;

    /**
     * The history of commands that have been executed.
     * @type {TermHistory}
     */
    public history: TermHistory;

    /**
     * The commands that can be executed by the user.
     * @type {TermBin}
     */
    public bin: TermBin;

    /**
     * The options for the terminal.
     * @type {TermOptions}
     */
    public options: TermOptions;

    /**
     * Get the listeners for the terminal.
     * @type {TermListeners}
     */
    public get listeners(): TermListeners { return this._listeners; }

    /**
     * Get whether the terminal has been initialized.
     * @type {boolean}
     */
    public get started(): boolean { return this._started; }



    /**
     * @param {HTMLInputElement} input - input element to turn into a terminal
     * @param {object} options - terminal configuration
     * @param {ExitObject[]} commandHistory - history of commands that have been executed
     * @param {Command[]} commandList - list of commands that can be executed by the user
     */
    constructor(input: HTMLInputElement, options: object = {}, commandHistory: ExitObject[] = [], commandList: Command[] = []) {
        super();
        this.input = input;
        this.history = new TermHistory(commandHistory);
        this.bin = new TermBin(commandList);
        this.options = new TermOptions(options);
        this._listeners = new TermListeners(this);
    }

    /**
     * Initializes the terminal. Attaches input listeners and updates the input.
     * @returns {void}
     */
    public init(): void {
        if (!this._started){
            if (this.options.installBuiltins){
                this.bin.list = [...this.bin.list, ...built_ins];
            }
            this._listeners.attachInputListeners();
            this.updateInput();
            this._started = true
        }
    }

    /**
     * Updates the terminal's user input value.
     * @param {string} [userInput] - the value to update the input with; clears the input if no value is provided
     * @returns {void}
     */
    public updateInput(userInput?: string): void {
        this.input.value = this.options.preprompt + this.options.prompt + (userInput || "");
    }

    /**
     * Gets the terminal's user input.
     * @returns {string} The string in the input, not including the preprompt and prompt
     */
    public getInputValue(): string {
        return this.input.value.slice(`${this.options.preprompt}${this.options.prompt}`.length);
    }

    /**
     * Gets the command predictions based on the user's input.
     * @param {string} [text] - The text to get predictions for; if no text is provided, all commands are returned
     * @returns {string[]} The predictions for the terminal's user input
     */
    public getPredictions(text?: string): string[] {
        let predictions: string[] = []
        if (text) {
            const partialMatches: string[] = this.bin.getCommandKeys().filter(key => key.startsWith(text));
            predictions = partialMatches;
        } else {
            predictions = this.bin.getCommandKeys();
        }
        return predictions;
    }

    /**
     * Converts the user's input into an array for command execution.
     * @param {string} input - The string to convert into an array
     * @returns {string[]} The array created from the input
     */
    public getInputArray(input: string): string[] {

        function cleanBuffer(toClean: string){
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
                        result.push(cleanBuffer(buffer));
                        buffer = "";
                        currQuote = null;
                    } else {
                        buffer += char;
                    }
                } else if (char === " " && currQuote == null) {
                    if (buffer.length > 0){
                        result.push(cleanBuffer(buffer));
                        buffer = "";
                    }

                } else {
                    buffer += char;
                }
            }
        }
        if (buffer.length > 0){
            result.push(cleanBuffer(buffer));
        }
        return result;
    }

    /**
     * Get the last exit object of the terminal.
     * @returns {ExitObject | undefined} The last exit object of the terminal; if no exit objects are found, returns undefined
     */
    public getLastExitObject(): ExitObject | undefined {
        return this.history.items[0]
    }

    /**
     * Executes a command based on the user's input.
     * @param {string} input - The command to execute
     * @returns {ExitObject} The ExitObject returned by the execution
     */
    public executeCommand(input: string): ExitObject {
        const userInput: string[] = this.getInputArray(input.trim());
        const command: Command | undefined = this.bin.find(userInput[0]);
        let addToHistory: boolean = true;

        let exitObject: ExitObject;
        if (command) {
            exitObject = command.run(userInput, input, this);
        } else if (userInput[0] === "") {
            exitObject = this.bin.emptyCommand.run(userInput, input, this);
            if (!this.options.addEmptyCommandToHistory){
                addToHistory = false;
            }
        } else {
            const errText: string = `Command ${userInput[0]} not found`;
            console.error(errText);
            exitObject = new ExitObject(userInput, input, undefined, 1, {error: errText});
        }

        if (addToHistory){
            this.history.push(exitObject);
        }
        this.history.resetIndex();

        this.emitExecutedEvent(exitObject);

        return exitObject
    }
}

export {Command, ArgsOptions, ExitObject, TermBin, TermHistory, TermOptions, TermListeners, built_ins }
