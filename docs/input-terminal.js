import { TermCommands, Command, ExitObject } from "./commands.js";
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
    get lastExitCode() {
        return this._lastExitCode;
    }
    /**
     * @constructor
     */
    constructor(input, options = {}, commandHistory = [], commandList = []) {
        this._started = false;
        this._lastExitCode = undefined;
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
    execute_command(input) {
        const user_input = input.split(" ");
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
            exitObject = new ExitObject(user_input, undefined, 1, output);
        }
        console.log(exitObject);
        //const exitObject = new ExitObject(user_input, command, exitCode, output);
        this._lastExitCode = exitObject.exit_code;
        this.history.push(exitObject);
        this.history.reset_index();
        return exitObject;
    }
}
export { Command, ExitObject, TermCommands, TermHistory, TermOptions };
