import {Command} from "../commands.ts";

/**
 * The `clear` command. Clears the terminal output.
 * @type {Command}
 */
const clear: Command = new Command("clear", (args, options, terminal) => {
    terminal.output?.clear();
    return {};
});

clear.manual = `clear

Clears the terminal output.`;

export {clear};
