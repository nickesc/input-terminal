import {Command, ExitObject, ArgsOptions} from "./commands.ts";
import {TermHistory} from "./history.ts";
import {TermListeners} from "./listeners.ts";
import {defaultTermOptions} from "./options.ts";
import {TermBin, built_ins} from "./bin.ts";
import type {Options} from "./commands.ts";
import type {TermOptions} from "./options.ts";
import type {
    OutputAdapter,
    OutputMetadata,
    CommandEventDetail,
    OutputEventDetail,
    ClearEventDetail,
    OutputErrorDetail,
} from "./output-adapter.ts";

const eventType = {
    command: "command",
    stdout: "stdout",
    stderr: "stderr",
    clear: "clear",
    outputError: "outputerror",
    executed: "executed",
} as const;

interface TerminalEventMap {
    [eventType.command]: CustomEvent<CommandEventDetail>;
    [eventType.stdout]: CustomEvent<OutputEventDetail>;
    [eventType.stderr]: CustomEvent<OutputEventDetail>;
    [eventType.clear]: CustomEvent<ClearEventDetail>;
    [eventType.outputError]: CustomEvent<OutputErrorDetail>;
    [eventType.executed]: CustomEvent<ExitObject>;
}

type TerminalEventListener<K extends keyof TerminalEventMap> = (
    this: Terminal,
    event: TerminalEventMap[K],
) => void;

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
 * import { DOMOutputAdapter } from "input-terminal/dom";
 * const input = document.getElementById("terminal") as HTMLInputElement;
 * const output = document.getElementById("output") as HTMLElement;
 * const terminal = new Terminal({
 *     input,
 *     output: new DOMOutputAdapter(output),
 *     options: { prompt: ">> " },
 * });
 * terminal.bin.add(new Command("echo", (args, options, terminal) => {
 *     terminal.stdout(args.join(" "));
 *     return {};
 * }));
 * terminal.init();
 * ```
 */
export interface TerminalConfig {
    input: HTMLInputElement;
    output?: OutputAdapter;
    options?: Partial<TermOptions>;
    history?: ExitObject[];
    commands?: Command[];
    completionProvider?: CompletionProvider;
}

/**
 * Supplies autocomplete predictions for the terminal's full user input.
 * Return complete input replacements, `undefined` to use command-name completion,
 * or an empty array when there are no matches.
 */
export type CompletionProvider = (context: {
    input: string;
    cursor: number;
    terminal: Terminal;
}) => string[] | undefined;

export class Terminal extends EventTarget {
    private _listeners: TermListeners;
    private _started: boolean = false;
    private _builtInsInstalled: boolean = false;
    private _outputSequence: number = 0;
    private _currentStdoutLog: unknown[] = [];
    private _currentStderrLog: unknown[] = [];
    private _completionProvider: CompletionProvider | undefined;

    private createOutputMetadata(): OutputMetadata {
        return Object.freeze({
            sequence: ++this._outputSequence,
            timestamp: Date.now(),
        });
    }

    private emitExecutedEvent(exitObject: ExitObject): void {
        this.dispatchEvent(new CustomEvent(eventType.executed, {detail: exitObject}));
    }

    private clearOutputLogs(): void {
        this._currentStdoutLog = [];
        this._currentStderrLog = [];
    }

    private emitCommandOutput(data: string): void {
        const metadata = this.createOutputMetadata();
        const detail: CommandEventDetail = {metadata, data};
        let adapterFailure: {error: unknown} | undefined;

        if (this.output) {
            try {
                this.output.command(data, metadata);
            } catch (error) {
                adapterFailure = {error};
            }
        }

        this.dispatchEvent(new CustomEvent(eventType.command, {detail}));

        if (adapterFailure) {
            const errorDetail: OutputErrorDetail = {
                metadata,
                operation: eventType.command,
                data,
                error: adapterFailure.error,
            };
            this.dispatchEvent(new CustomEvent(eventType.outputError, {detail: errorDetail}));
        }
    }

    /**
     * The input element that the terminal is attached to.
     * @type {HTMLInputElement}
     */
    public input: HTMLInputElement;

    /**
     * The adapter responsible for rendering or recording output.
     * @type {OutputAdapter | undefined}
     */
    public readonly output: OutputAdapter | undefined;

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
    private _options: TermOptions;

    /**
     * Get the terminal's current options.
     * @type {TermOptions}
     */
    public get options(): TermOptions {
        return this._options;
    }

    /**
     * Get the listeners for the terminal.
     * @type {TermListeners}
     */
    public get listeners(): TermListeners {
        return this._listeners;
    }

    /**
     * Get whether the terminal has been initialized.
     * @type {boolean}
     */
    public get started(): boolean {
        return this._started;
    }

    /**
     * Emit data to stdout. Dispatches a "stdout" event and logs the data.
     * @param {unknown} data - the data to emit
     * @returns {void}
     */
    public stdout(data: unknown): void {
        const metadata = this.createOutputMetadata();
        const detail: OutputEventDetail = {metadata, data};
        let adapterFailure: {error: unknown} | undefined;

        this._currentStdoutLog.push(data);

        if (this.output) {
            try {
                this.output.stdout(data, metadata);
            } catch (error) {
                adapterFailure = {error};
            }
        }

        this.dispatchEvent(new CustomEvent(eventType.stdout, {detail}));

        if (adapterFailure) {
            const errorDetail: OutputErrorDetail = {
                metadata,
                operation: eventType.stdout,
                data,
                error: adapterFailure.error,
            };
            this.dispatchEvent(new CustomEvent(eventType.outputError, {detail: errorDetail}));
        }
    }

    /**
     * Emit data to stderr. Dispatches a "stderr" event and logs the data.
     * @param {unknown} data - the data to emit
     * @returns {void}
     */
    public stderr(data: unknown): void {
        const metadata = this.createOutputMetadata();
        const detail: OutputEventDetail = {metadata, data};
        let adapterFailure: {error: unknown} | undefined;

        this._currentStderrLog.push(data);

        if (this.output) {
            try {
                this.output.stderr(data, metadata);
            } catch (error) {
                adapterFailure = {error};
            }
        }

        this.dispatchEvent(new CustomEvent(eventType.stderr, {detail}));

        if (adapterFailure) {
            const errorDetail: OutputErrorDetail = {
                metadata,
                operation: eventType.stderr,
                data,
                error: adapterFailure.error,
            };
            this.dispatchEvent(new CustomEvent(eventType.outputError, {detail: errorDetail}));
        }
    }

    /**
     * Clear rendered output. Dispatches a "clear" event without changing logs or history.
     * @returns {void}
     */
    public clearOutput(): void {
        const metadata = this.createOutputMetadata();
        const detail: ClearEventDetail = {metadata};
        let adapterFailure: {error: unknown} | undefined;

        if (this.output) {
            try {
                this.output.clear(metadata);
            } catch (error) {
                adapterFailure = {error};
            }
        }

        this.dispatchEvent(new CustomEvent(eventType.clear, {detail}));

        if (adapterFailure) {
            const errorDetail: OutputErrorDetail = {
                metadata,
                operation: eventType.clear,
                error: adapterFailure.error,
            };
            this.dispatchEvent(new CustomEvent(eventType.outputError, {detail: errorDetail}));
        }
    }

    /**
     * Get a copy of the current stdout log.
     * @returns {unknown[]} the stdout log
     */
    public getStdoutLog(): unknown[] {
        return [...this._currentStdoutLog];
    }

    /**
     * Get a copy of the current stderr log.
     * @returns {unknown[]} the stderr log
     */
    public getStderrLog(): unknown[] {
        return [...this._currentStderrLog];
    }

    /**
     * @param {TerminalConfig} config - terminal configuration
     */
    constructor({input, output, options = {}, history = [], commands = [], completionProvider}: TerminalConfig) {
        super();
        this.input = input;
        this.output = output;
        this.history = new TermHistory(history);
        this.bin = new TermBin(commands);
        this._options = Object.freeze({...defaultTermOptions, ...options});
        this._completionProvider = completionProvider;
        this._listeners = new TermListeners(this);
    }

    public override addEventListener<K extends keyof TerminalEventMap>(
        type: K,
        listener: TerminalEventListener<K>,
        options?: boolean | AddEventListenerOptions,
    ): void;

    public override addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): void;

    public override addEventListener(
        type: string,
        listener: unknown,
        options?: boolean | AddEventListenerOptions,
    ): void {
        super.addEventListener(type, listener as EventListenerOrEventListenerObject | null, options);
    }

    public override removeEventListener<K extends keyof TerminalEventMap>(
        type: K,
        listener: TerminalEventListener<K>,
        options?: boolean | EventListenerOptions,
    ): void;

    public override removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | EventListenerOptions,
    ): void;

    public override removeEventListener(
        type: string,
        listener: unknown,
        options?: boolean | EventListenerOptions,
    ): void {
        super.removeEventListener(type, listener as EventListenerOrEventListenerObject | null, options);
    }

    /**
     * Get the full terminal prompt.
     * @returns {string} the full terminal prompt (preprompt + prompt)
     */
    public getFullPrompt(): string {
        return this.options.preprompt + this.options.prompt;
    }

    /**
     * Initializes the terminal. Attaches input listeners and updates the input.
     * @returns {void}
     */
    public init(): void {
        if (!this._started) {
            if (this.options.installBuiltins && !this._builtInsInstalled) {
                this.bin.list = [...this.bin.list, ...built_ins];
                this._builtInsInstalled = true;
            }

            this._listeners.attachInputListeners();
            this.updateInput();
            this._started = true;
        }
    }

    /**
     * Destroys the terminal instance. Detaches input listeners and marks the terminal as not started.
     * This does not clear command history, registered commands, input text, or output contents.
     * @returns {void}
     */
    public destroy(): void {
        if (this._started) {
            this._listeners.detachInputListeners();
            this._started = false;
        }
    }

    /**
     * Updates the terminal's user input value.
     * @param {string} [userInput] - the value to update the input with; clears the input if no value is provided
     * @returns {void}
     */
    public updateInput(userInput?: string): void {
        this.input.value = this.getFullPrompt() + (userInput || "");
    }

    /**
     * Gets the terminal's user input.
     * @returns {string} The string in the input, not including the preprompt and prompt
     */
    public getInputValue(): string {
        return this.input.value.slice(this.getFullPrompt().length);
    }

    /**
     * Applies partial option updates. Prompt changes preserve unfinished input and redraw initialized terminals.
     * @param {Partial<TermOptions>} options - the options to update
     * @returns {void}
     */
    public updateOptions(options: Partial<TermOptions>): void {
        const promptChanged = Object.hasOwn(options, "prompt") || Object.hasOwn(options, "preprompt");
        const userInput = this._started && promptChanged ? this.getInputValue() : undefined;

        this._options = Object.freeze({...this._options, ...options});

        if (userInput !== undefined) {
            this.updateInput(userInput);
        }
    }

    /**
     * Gets the command predictions based on the user's input.
     * @param {string} [text] - The text to get predictions for; if no text is provided, all commands are returned
     * @returns {string[]} The predictions for the terminal's user input
     */
    public getPredictions(text?: string): string[] {
        let predictions: string[] = [];
        if (text) {
            const partialMatches: string[] = this.bin.getCommandKeys().filter((key) => key.startsWith(text));
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
        function cleanBuffer(toClean: string) {
            toClean = toClean.trim();
            toClean = toClean.replace(/\\/g, "");
            return toClean;
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
                    if (buffer.length > 0) {
                        result.push(cleanBuffer(buffer));
                        buffer = "";
                    }
                } else {
                    buffer += char;
                }
            }
        }
        if (buffer.length > 0) {
            result.push(cleanBuffer(buffer));
        }
        return result;
    }

    /**
     * Get the last exit object of the terminal.
     * @returns {ExitObject | undefined} The last exit object of the terminal; if no exit objects are found, returns undefined
     */
    public getLastExitObject(): ExitObject | undefined {
        return this.history.items[0];
    }

    /**
     * Executes a command based on the user's input.
     * @param {string} input - The command to execute
     * @returns {ExitObject} The ExitObject returned by the execution
     */
    public executeCommand(input: string): ExitObject {
        this.clearOutputLogs();

        if (this.options.printCommand) {
            this.emitCommandOutput(this.getFullPrompt() + input);
        }

        const userInput: string[] = this.getInputArray(input.trim());
        const command: Command | undefined = this.bin.find(userInput[0]);
        let addToHistory: boolean = true;

        let exitObject: ExitObject;
        if (command) {
            exitObject = command.run(userInput, input, this);
        } else if (userInput[0] === "") {
            exitObject = this.bin.emptyCommand.run(userInput, input, this);
            if (!this.options.addEmptyCommandToHistory) {
                addToHistory = false;
            }
        } else {
            const errText: string = `Command ${userInput[0]} not found`;
            this.stderr(errText);
            exitObject = new ExitObject(
                userInput,
                input,
                undefined,
                1,
                {error: errText},
                this.getStdoutLog(),
                this.getStderrLog(),
            );
        }

        if (addToHistory) {
            this.history.push(exitObject);
        }
        this.history.resetIndex();

        this.emitExecutedEvent(exitObject);

        return exitObject;
    }
}

export {Command, ArgsOptions, ExitObject, TermBin, TermHistory, TermListeners, built_ins};
export type {
    Options,
    TermOptions,
    OutputAdapter,
    OutputMetadata,
    CommandEventDetail,
    OutputEventDetail,
    ClearEventDetail,
    OutputErrorDetail,
};
