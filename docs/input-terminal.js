import { TermCommands, Command, ExitObject, ArgsOptions } from "./commands.js";
import { TermHistory } from "./history.js";
import { TermListeners } from "./listeners.js";
import { TermOptions } from "./options.js";
/**
 * @fileoverview description
 *
 * @module input-terminal
 */
/**
 * @class
 */
export class Terminal {
    input;
    history;
    commands;
    options;
    _listeners;
    _started = false;
    _lastExitCode = undefined;
    get lastExitCode() {
        return this._lastExitCode;
    }
    /**
     * @constructor
     */
    constructor(input, options = {}, commandHistory = [], commandList = []) {
        this.input = input;
        this.history = new TermHistory(commandHistory);
        this.commands = new TermCommands(commandList);
        this.options = new TermOptions(options);
        this._listeners = new TermListeners(this);
    }
    init() {
        if (!this._started) {
            this._listeners.attach_input_listeners();
            this.update_input();
            this._started = true;
        }
    }
    isStarted() {
        return this._started;
    }
    update_input(user_input) {
        this.input.value = this.options.preprompt + this.options.prompt + (user_input || "");
    }
    get_prediction(text) {
        let prediction = "";
        return prediction;
    }
    getInputArray(input) {
        if (input.trim().length === 0) {
            return [""];
        }
        function clean_buffer(toClean) {
            toClean = toClean.trim();
            toClean = toClean.replace(/\\/g, "");
            return toClean;
        }
        const quotes = ['"', "'", "`"];
        let currQuote = null;
        let buffer = "";
        let result = [];
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (char) {
                if (quotes.includes(char) && buffer.slice(-1) !== "\\") {
                    if (currQuote == null) {
                        currQuote = char;
                    }
                    else if (currQuote === char) {
                        result.push(clean_buffer(buffer));
                        buffer = "";
                        currQuote = null;
                    }
                    else {
                        buffer += char;
                    }
                }
                else if (char === " " && currQuote == null) {
                    if (buffer.length > 0) {
                        result.push(clean_buffer(buffer));
                        buffer = "";
                    }
                }
                else {
                    buffer += char;
                }
            }
        }
        if (buffer.length > 0) {
            result.push(clean_buffer(buffer));
        }
        return result;
    }
    execute_command(input) {
        const user_input = this.getInputArray(input);
        const command = this.commands.find(user_input[0]);
        const output = {};
        //const exitCode: number = 0;
        let exitObject;
        if (command) {
            //exitObject = new ExitObject(user_input, command, exitCode, output);
            exitObject = command.run(user_input, this);
        }
        else if (user_input[0] == "") {
            exitObject = new ExitObject(user_input, undefined, 0, output);
        }
        else {
            const errText = `Command ${user_input[0]} not found`;
            console.error(errText);
            exitObject = new ExitObject(user_input, undefined, 1, { error: errText });
        }
        //console.log(exitObject);
        //const exitObject = new ExitObject(user_input, command, exitCode, output);
        this._lastExitCode = exitObject.exit_code;
        this.history.push(exitObject);
        this.history.reset_index();
        return exitObject;
    }
}
export { Command, ArgsOptions, ExitObject, TermCommands, TermHistory, TermOptions };
