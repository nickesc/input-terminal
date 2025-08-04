import { Command } from "../commands.js";
/**
 * The `man` command. Returns the command's manual/help text.
 * @type {Command}
 */
export const man = new Command("man", (args, options, terminal) => {
    const target_command = terminal.bin.find(args[0]);
    if (target_command) {
        return target_command.key;
    }
    else {
        return `Command "${args[0]}" not found`;
    }
});
