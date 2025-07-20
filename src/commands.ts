export class Command {
    public key: string;

    constructor(key: string) {
        this.key = key;
    }
}

export class TermCommands{
    public list: Command[];

    constructor(commands: Command[] = []) {
        this.list = commands;
    }

    public add_command(command: Command): void {
        this.list.push(command);
    }

    public remove_command(command: Command): void {
        this.list.splice(this.list.indexOf(command), 1);
    }

    public execute_command(command: Command): number {
        let exit_code: number = 0;
        return exit_code;
    }
}
