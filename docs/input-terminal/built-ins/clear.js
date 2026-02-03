import { Command } from "../commands.js";
/**
 * The `clear` command. Clears the terminal output.
 * @type {Command}
 */
const clear = new Command("clear", (args, options, terminal) => {
    terminal.output?.clear();
    return {};
});
clear.manual = `clear

Clears the terminal output.`;
export { clear };
