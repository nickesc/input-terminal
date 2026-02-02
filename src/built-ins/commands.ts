import {Command} from "../commands.ts";

/**
 * The `commands` command. Returns a list of all commands.
 * @type {Command}
 */
const commands: Command = new Command("commands", (args, options, terminal) => {
    terminal.stdout(terminal.bin.getCommandKeys().join("\n"));
    return {commands: terminal.bin.getCommandKeys()};
});

export {commands};
