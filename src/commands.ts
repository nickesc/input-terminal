export class Command {
    public key: string;

    constructor(key: string) {
        this.key = key;
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
