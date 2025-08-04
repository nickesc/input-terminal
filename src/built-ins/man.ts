import { Command } from "../commands.ts";

/**
 * The `man` command. Returns the command's manual/help text.
 * @type {Command}
 */
export const man: Command = new Command("man", (args, options, terminal) => {
    const target_command: Command | undefined = terminal.bin.find(args[0]);
    if (target_command){
        return target_command.key;
    } else {
        return `Command "${args[0]}" not found`;
    }
});

