export class Command {
    public key: string;

    constructor(key: string) {
        this.key = key;
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
