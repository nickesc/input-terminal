import { Command } from "../commands.js";
/**
 * The `man` command. Returns the command's manual/help text.
 *
 * If the command does not have a defined manual, it will return the command's key.
 * @type {Command}
 */
const man = new Command("man", (args, options, terminal) => {
    if (args.length === 0) {
        const output = `man: Error: No command provided.\n\n${man.manual}`;
        terminal.stderr(output);
        return output;
    }
    const targetCommand = terminal.bin.find(args[0]);
    if (targetCommand) {
        const output = targetCommand.manual || targetCommand.key;
        terminal.stdout(output);
        return output;
    }
    else {
        const output = `Command "${args[0]}" not found`;
        terminal.stderr(output);
        return output;
    }
});
man.manual = `man [command]

Returns the manual for the specified command.

If the command does not have a defined manual, it will return the command's key.`;
export { man };
