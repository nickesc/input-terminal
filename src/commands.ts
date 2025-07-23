import { Terminal } from './input-terminal.ts';

type Opt = {
    key: string;
    value?: string;
}

class ArgsOptions {
    public user_input: string[];
    public options: Opt[] = [];
    public args: string[] = [];

    constructor(user_input: string[]) {
        this.user_input = user_input;
        this.parse_input();
    }

    private string2opt(string: string): Opt {
        const split: string[] = string.split("=");

        if (split[0] && split[1]){
            return {key: split[0], value: split[1]};
        } else if (split[0]){
            return {key: split[0]};
        } else {
            throw new Error("Unable to split string to option and key")
        }
    }


    private parse_input(): void {
        for (let i = 1; i < this.user_input.length; i++) {
            const item: string = this.user_input[i] || "";
            if (item.startsWith("--")){
                this.options.push(this.string2opt(item.slice(2)));
            } else if (item.startsWith("-")){
                this.options.push(this.string2opt(item.slice(1)));
            } else {
                this.args.push(item);
            }
        }
    }


}



export class Command {
    public key: string;
    public action: (args: string[], options: Opt[], terminal: Terminal) => {};
    public options: string[] = [];
    public args: string[] = [];

    constructor(key: string, action: (args: string[], options: Opt[], terminal: Terminal) => {}) {
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

    public parse_input(user_input: string[]): ArgsOptions {
        return new ArgsOptions(user_input);
    }

    public run(user_input: string[], term: Terminal): ExitObject {
        let return_value: object;
        let exit_code: number;

        const parsed_input: ArgsOptions = this.parse_input(user_input);

        try {
            return_value = this.action(parsed_input.args, parsed_input.options, term);
            exit_code = 0;

        } catch (error) {
            return_value = {};
            exit_code = 1;
        }
        //const return_value: object = this.action(user_input)
        const exit_reply: ExitObject = new ExitObject(user_input, this, exit_code, return_value);
        return exit_reply;
    }
}

export class ExitObject{
    private _command: Command | undefined;
    private _timestamp: number;
    private _exit_code: number;
    private _user_input: string[];
    private _output: any;

    constructor(user_input: string[], command: Command | undefined, exit_code: number, output: any) {
        this._command = command;
        this._timestamp = Date.now();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._output = output;
    }

    public get command(): Command | undefined {
        return this._command;
    }

    public get timestamp(): number {
        return this._timestamp;
    }

    public get exit_code(): number {
        return this._exit_code;
    }

    public get user_input(): string[] {
        return this._user_input;
    }

    public get output(): object {
        return this._output;
    }
}

export class TermCommands{
    private _list: Command[] = [];

    constructor(commands?: Command[]) {
        if (commands){
            this.list = commands;
        }
    }

    public get list(): Command[] {
        return this._list;
    }

    public set list(commands: Command[]) {
        for (let command of commands){
            this.add(command);
        }
    }

    public find(commandKey?: string): Command | undefined {
        if (!commandKey){return undefined;}
        //const commandKey = user_input[0];
        //return new Command("key");
        return this.list.find(command => command.key === commandKey);
    }

    public add(command: Command): number {
        if (!this._list.includes(command)){
            this._list.push(command);
        }
        return this._list.length
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
