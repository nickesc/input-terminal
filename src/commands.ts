export class Command {
    public key: string;
    public action: Function;
    public option: string[] = [];
    public args: string[] = [];


    constructor(key: string, action: Function = () => {}) {
        this.key = key;
        this.action = action;
    }

    public addOption(key: string, alt?: string): void {}
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
    }

    public run(user_input: string[]): ExitObject {
        let return_value: object;
        let exit_code: number;
        try {
            return_value = this.action(user_input);
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
    private _timestamp: Date;
    private _exit_code: number;
    private _user_input: string[];
    private _output: object;

    constructor(user_input: string[], command: Command | undefined, exit_code: number, output: object) {
        this._command = command;
        this._timestamp = new Date();
        this._exit_code = exit_code;
        this._user_input = user_input;
        this._output = output;
    }

    public get command(): Command | undefined {
        return this._command;
    }

    public get timestamp(): Date {
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
