import { Command } from "../commands.js";
/**
 * The `echo` command. Returns the provided arguments as a string.
 * @type {Command}
 */
export const echo = new Command("echo", (args, options, terminal) => {
    return `${args.join(" ")}`;
});
