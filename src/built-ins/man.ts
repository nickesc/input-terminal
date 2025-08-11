import { Command } from "../commands.ts";

/**
 * The `man` command. Returns the command's manual/help text.
 *
 * If the command does not have a defined manual, it will return the command's key.
 * @type {Command}
 */
const man: Command = new Command("man", (args, options, terminal) => {
    if (args.length === 0) {
        return `man: Error: No command provided.\n\n${man.manual}`;
    }

    const targetCommand: Command | undefined = terminal.bin.find(args[0]);
    if (targetCommand){
        return targetCommand.manual || targetCommand.key;
    } else {
        return `Command "${args[0]}" not found`;
    }
});

man.manual = `man [command]

Returns the manual for the specified command.

If the command does not have a defined manual, it will return the command's key.`;

export { man };
