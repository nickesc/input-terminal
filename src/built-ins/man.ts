import {Command} from "../commands.ts";

/**
 * The `man` command. Returns the command's manual/help text.
 *
 * If the command does not have a defined manual, it will return the command's key.
 * @type {Command}
 */
const man: Command = new Command("man", (args, options, terminal) => {
    if (args.length === 0) {
        terminal.stderr(`man: Error: No command provided.\n\n${man.manual}`);
        return {};
    }

    const targetCommand: Command | undefined = terminal.bin.find(args[0] as string);
    if (targetCommand) {
        terminal.stdout(targetCommand.manual || targetCommand.key);
        return {};
    } else {
        terminal.stderr(`Command "${args[0]}" not found`);
        return {};
    }
});

man.manual = `man [command]

Returns the manual for the specified command.

If the command does not have a defined manual, it will return the command's key.`;

export {man};
