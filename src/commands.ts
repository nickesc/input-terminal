import { Terminal } from './input-terminal.ts';

export class ArgsOptions {
    private _user_input: string[];

    private _args: string[] = [];
    public get args(): string[] { return this._args; }

    private _options = {};
    public get options(): object { return this._options; }

    constructor(user_input: string[]) {
        this._user_input = user_input;
        this.init();
    }

    private string2opt(string: string): void {
        const key: string = string.split("=")[0] || "";
        const value: string = string.split("=").slice(1).join("=");

        if (key && value){
            Object.assign(this._options, {[key]: {value:value}});
        } else if (key){
            Object.assign(this._options, {[key]: {value:undefined}});
        } else {
            console.error(`Unable to parse option: ${string}`);
        }
    }

    private init(): void {
        for (let i = 1; i < this._user_input.length; i++) {
            const item: string = this._user_input[i]!;
            if (item.startsWith("--")){
                this.string2opt(item.slice(2));
            } else if (item.startsWith("-")){
                this.string2opt(item.slice(1));
            } else {
                this._args.push(item);
            }
        }
    }
}

export class Command {
    private _key: string;
    public get key(): string { return this._key; }

    private _action: (args: string[], options: {}, terminal: Terminal) => {};
    public get action(): (args: string[], options: {}, terminal: Terminal) => {} { return this._action; }

    constructor(key: string, action: (args: string[], options: {}, terminal: Terminal) => {}) {
        this._key = key;
        this._action = action;
    }

    public parse_input(user_input: string[]): ArgsOptions {
        return new ArgsOptions(user_input);
    }

    public run(user_input: string[], term: Terminal): ExitObject {
        let return_value: object;
        let exit_code: number;

        const parsed_input: ArgsOptions = this.parse_input(user_input);

        try {
            return_value = this._action(parsed_input.args, parsed_input.options, term);
            exit_code = 0;

        } catch (error) {
            return_value = {error: error};
            console.error(error);
            exit_code = 1;
        }
        const exit_reply: ExitObject = new ExitObject(user_input, this, exit_code, return_value);
        return exit_reply;
    }
}

export class ExitObject{
    private _command: Command | undefined;
    public get command(): Command | undefined { return this._command; }

    private _timestamp: number;
    public get timestamp(): number { return this._timestamp; }

    private _exit_code: number;
    public get exit_code(): number { return this._exit_code; }

    private _user_input: string[];
    public get user_input(): string[] { return this._user_input; }

    private _output: any;
    public get output(): object { return this._output; }

    constructor(user_input: string[], command: Command | undefined, exit_code: number, output: any) {
        this._command = command;
        this._timestamp = Date.now();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._output = output;
    }
}

export class TermCommands{
    private _list: Command[] = [];
    public get list(): Command[] { return this._list; }
    public set list(commands: Command[]) { for (let command of commands){ this.add(command); } }

    constructor(commands?: Command[]) {
        if (commands){
            this.list = commands;
        }
    }

    public get_command_keys(): string[] {
        return this._list.map(command => command.key);
    }


    public find(command_key: string): Command | undefined {
        return this.list.find(command => command.key === command_key);
    }

    public add(command: Command): number {
        if (!this._list.includes(command)){
            this._list.push(command);
        }
        return this._list.length;
    }

    public remove(command: Command): Command | undefined {
        if (this._list.includes(command)){
            this._list.splice(this._list.indexOf(command), 1);
            return command;
        } else {
            return undefined;
        }
    }
}
