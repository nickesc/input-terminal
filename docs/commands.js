import { Terminal } from "./input-terminal.js";
class ArgsOptions {
    constructor(user_input) {
        this.options = [];
        this.args = [];
        this.user_input = user_input;
        this.parse_input();
    }
    parse_input() {
        for (let i = 1; i < this.user_input.length; i++) {
            const item = this.user_input[i] || "";
            if (item.startsWith("--")) {
                this.options.push(item.substring(2));
            }
            else if (item.startsWith("-")) {
                this.options.push(item.substring(1));
            }
            else {
                this.args.push(item);
            }
        }
    }
}
export class Command {
    constructor(key, action) {
        this.options = [];
        this.args = [];
        this.key = key;
        this.action = action;
    }
    /*     public addOption(key: string, alt?: string): void {}
        public removeOption(key: string): void {}
    
        public addArgument(argument: string): void {
            if (!this.args.includes(argument)){
                this.args.push(argument);
            }
        }
        public removeArgument(argument: string): void {
            if (this.args.includes(argument)){
                this.args.splice(this.args.indexOf(argument), 1);
            }
        } */
    parse_input(user_input) {
        return new ArgsOptions(user_input);
    }
    run(user_input, term) {
        let return_value;
        let exit_code;
        const parsed_input = this.parse_input(user_input);
        try {
            return_value = this.action(parsed_input.args, parsed_input.options, term);
            exit_code = 0;
        }
        catch (error) {
            return_value = {};
            exit_code = 1;
        }
        //const return_value: object = this.action(user_input)
        const exit_reply = new ExitObject(user_input, this, exit_code, return_value);
        return exit_reply;
    }
}
export class ExitObject {
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
    constructor(commands) {
        this._list = [];
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
        //const commandKey = user_input[0];
        //return new Command("key");
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
