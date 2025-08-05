import { Command } from "../commands.js";
/**
 * The `man` command. Returns the command's manual/help text.
 *
 * If the command does not have a defined manual, it will return the command's key.
 * @type {Command}
 */
const man = new Command("man", (args, options, terminal) => {
    const target_command = terminal.bin.find(args[0]);
    if (target_command) {
        return target_command.manual || target_command.key;
    }
    else {
        return `Command "${args[0]}" not found`;
    }
});
man.manual = `man [command]

Returns the manual for the specified command.

If the command does not have a defined manual, it will return the command's key.`;
export { man };
