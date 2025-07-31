import { Terminal } from "./input-terminal.js";
export class ArgsOptions {
    _user_input;
    _options = {};
    _args = [];
    get options() {
        return this._options;
    }
    get args() {
        return this._args;
    }
    constructor(user_input) {
        this._user_input = user_input;
        this.init();
    }
    string2opt(string) {
        const key = string.split("=")[0] || "";
        const value = string.split("=").slice(1).join("=");
        if (key && value) {
            Object.assign(this._options, { [key]: { value: value } });
        }
        else if (key) {
            Object.assign(this._options, { [key]: { value: undefined } });
        }
        else {
            console.error(`Unable to parse option: ${string}`);
        }
    }
    init() {
        for (let i = 1; i < this._user_input.length; i++) {
            const item = this._user_input[i];
            if (item.startsWith("--")) {
                this.string2opt(item.slice(2));
            }
            else if (item.startsWith("-")) {
                this.string2opt(item.slice(1));
            }
            else {
                this._args.push(item);
            }
        }
    }
}
export class Command {
    _key;
    _action;
    get key() {
        return this._key;
    }
    get action() {
        return this._action;
    }
    constructor(key, action) {
        this._key = key;
        this._action = action;
    }
    parse_input(user_input) {
        return new ArgsOptions(user_input);
    }
    run(user_input, term) {
        let return_value;
        let exit_code;
        const parsed_input = this.parse_input(user_input);
        try {
            return_value = this._action(parsed_input.args, parsed_input.options, term);
            exit_code = 0;
        }
        catch (error) {
            return_value = { error: error };
            console.error(error);
            exit_code = 1;
        }
        const exit_reply = new ExitObject(user_input, this, exit_code, return_value);
        return exit_reply;
    }
}
export class ExitObject {
    _command;
    _timestamp;
    _exit_code;
    _user_input;
    _output;
    constructor(user_input, command, exit_code, output) {
        this._command = command;
        this._timestamp = Date.now();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._output = output;
    }
    get command() {
        return this._command;
    }
    get timestamp() {
        return this._timestamp;
    }
    get exit_code() {
        return this._exit_code;
    }
    get user_input() {
        return this._user_input;
    }
    get output() {
        return this._output;
    }
}
export class TermCommands {
    _list = [];
    constructor(commands) {
        if (commands) {
            this.list = commands;
        }
    }
    get list() {
        return this._list;
    }
    set list(commands) {
        for (let command of commands) {
            this.add(command);
        }
    }
    find(commandKey) {
        if (!commandKey) {
            return undefined;
        }
        ;
        return this.list.find(command => command.key === commandKey);
    }
    add(command) {
        if (!this._list.includes(command)) {
            this._list.push(command);
        }
        return this._list.length;
    }
    remove(command) {
        if (this._list.includes(command)) {
            this._list.splice(this._list.indexOf(command), 1);
            return command;
        }
        else {
            return undefined;
        }
    }
}
