import {Terminal} from "./input-terminal.ts";

/**
 * The structure for the object used to store the options for a command. Each key is an option name, and the value is an object with a `value` property.
 * @category Command Components
 */
export type Options = Record<
    string,
    {
        value: string | number | boolean;
    }
>;

/**
 * Manages and stores the arguments and options for a command.
 * @category Command Components
 */
export class ArgsOptions {
    private _userInput: string[];
    private _args: (string | number | boolean)[] = [];
    private _options: Options = {};

    /**
     * Get the arguments for the command.
     * @type {(string|number|boolean)[]}
     */
    public get args(): (string | number | boolean)[] {
        return this._args;
    }

    /**
     * Get the options for the command.
     * @type {Options}
     */
    public get options(): Options {
        return this._options;
    }

    /**
     * @param {string[]} userInput - the input array to parse
     */
    constructor(userInput: string[]) {
        this._userInput = userInput;
        this.init();
    }

    private castStringToValue(string: string): string | number | boolean {
        if (string.trim() === "") {
            return string;
        }

        const num = Number(string);
        if (!isNaN(num)) {
            return num;
        }

        if (string === "true") {
            return true;
        } else if (string === "false") {
            return false;
        } else {
            return string;
        }
    }

    private isValidOptionKey(input: string): boolean {
        return /^[A-Za-z0-9_-]+$/.test(input);
    }

    private string2opt(string: string): void {
        const key: string = string.split("=")[0] || "";
        const value: string = string.split("=").slice(1).join("=");

        if (!this.isValidOptionKey(key)) {
            throw new Error(`Invalid option: ${string}`);
        }

        if (key && value) {
            Object.assign(this._options, {[key]: {value: this.castStringToValue(value)}});
        } else if (key) {
            Object.assign(this._options, {[key]: {value: undefined}});
        }
    }

    private init(): void {
        for (let i = 1; i < this._userInput.length; i++) {
            const item: string = this._userInput[i]!;
            try {
                if (item.startsWith("--")) {
                    this.string2opt(item.slice(2));
                } else if (item.startsWith("-")) {
                    if (item[2] === "=") {
                        this.string2opt(item.slice(1));
                    } else if (!item.includes("=")) {
                        for (const char of item.slice(1)) {
                            this.string2opt(char);
                        }
                    } else {
                        throw new Error(`Invalid option: ${item}.`);
                    }
                } else {
                    this._args.push(this.castStringToValue(item));
                }
            } catch (error) {
                // Silently fail and continue
            }
        }
    }
}

/**
 * An executable command that can be added to a terminal's command list.
 */
export class Command {
    private _key: string;
    private _action: (args: (string | number | boolean)[], options: Options, terminal: Terminal) => any;
    private _manual: string | undefined = undefined;

    /**
     * Get the key used to identify the command.
     * @type {string}
     */
    public get key(): string {
        return this._key;
    }

    /**
     * Get the function to execute when the command is run.
     * @type {function}
     */
    public get action(): (args: (string | number | boolean)[], options: Options, terminal: Terminal) => {} {
        return this._action;
    }

    /**
     * Get the manual for the command.
     * @type {string}
     */
    public get manual(): string | undefined {
        return this._manual;
    }

    /**
     * Set the manual for the command.
     * @param {string} manual - the manual for the command
     */
    public set manual(manual: string) {
        this._manual = manual;
    }

    /**
     * @param {string} key - the key used to identify the command
     * @param {function} action - the function to execute when the command is run
     */
    constructor(
        key: string,
        action: (args: (string | number | boolean)[], options: Options, terminal: Terminal) => any,
    ) {
        this._key = key;
        this._action = action;
    }

    /**
     * Parses an input array into an `ArgsOptions` object.
     * @param {string[]} userInput - the input array to parse
     * @returns {ArgsOptions} the parsed input
     */
    public parseInput(userInput: string[]): ArgsOptions {
        return new ArgsOptions(userInput);
    }

    /**
     * Runs the command with the given input.
     * @param {string[]} userInput - the input array to parse
     * @param {string} rawInput - the raw input that was used to execute the command
     * @param {Terminal} term - the terminal to run the command in
     * @returns {ExitObject} the `ExitObject` the command returns
     */
    public run(userInput: string[], rawInput: string, term: Terminal): ExitObject {
        let returnValue: object;
        let exitCode: number;
        let parsedInput: ArgsOptions;

        try {
            parsedInput = this.parseInput(userInput);
            returnValue = this._action(parsedInput.args, parsedInput.options, term);
            exitCode = 0;
        } catch (error) {
            term.stderr(error);
            returnValue = {error: error};
            exitCode = 1;
        }
        const exitReply: ExitObject = new ExitObject(
            userInput,
            rawInput,
            this,
            exitCode,
            returnValue,
            term.getStdoutLog(),
            term.getStderrLog(),
        );
        return exitReply;
    }
}

/**
 * An object that is returned when a command is executed.
 */
export class ExitObject {
    private _command: Command | undefined;
    private _timestamp: number;
    private _exitCode: number;
    private _userInput: string[];
    private _rawInput: string;
    private _output: any;
    private _stdoutLog: any[];
    private _stderrLog: any[];

    /**
     * Get the command that was executed.
     * @type {Command | undefined}
     */
    public get command(): Command | undefined {
        return this._command;
    }

    /**
     * Get the timestamp of the execution.
     * @type {number}
     */
    public get timestamp(): number {
        return this._timestamp;
    }

    /**
     * Get the exit code of the execution.
     * @type {number}
     */
    public get exitCode(): number {
        return this._exitCode;
    }

    /**
     * Get the input that was used to execute the command.
     * @type {string[]}
     */
    public get userInput(): string[] {
        return this._userInput;
    }

    /**
     * Get the raw input that was entered to execute the command.
     * @type {string}
     */
    public get rawInput(): string {
        return this._rawInput;
    }

    /**
     * Get the output of the execution.
     * @type {any}
     */
    public get output(): any {
        return this._output;
    }

    /**
     * Get the stdout log of the execution.
     * @type {any[]}
     */
    public get stdoutLog(): any[] {
        return this._stdoutLog;
    }

    /**
     * Get the stderr log of the execution.
     * @type {any[]}
     */
    public get stderrLog(): any[] {
        return this._stderrLog;
    }

    /**
     * @param {string[]} userInput - the input array that was used to execute the command
     * @param {string} rawInput - the raw input that was used to execute the command
     * @param {Command | undefined} command - the command that was executed; `undefined` if the command is not found
     * @param {number} exitCode - the exit code of the command
     * @param {object} output - the output of the command
     * @param {any[]} stdoutLog - the stdout log of the command
     * @param {any[]} stderrLog - the stderr log of the command
     */
    constructor(
        userInput: string[],
        rawInput: string,
        command: Command | undefined,
        exitCode: number,
        output: any,
        stdoutLog: any[] = [],
        stderrLog: any[] = [],
    ) {
        this._command = command;
        this._timestamp = Date.now();
        this._exitCode = exitCode;
        this._userInput = userInput;
        this._rawInput = rawInput;
        this._output = output;
        this._stdoutLog = stdoutLog;
        this._stderrLog = stderrLog;
    }
}
