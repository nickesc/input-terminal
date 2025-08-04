import { Command } from "../commands.ts";

/**
 * The `echo` command. Returns the provided arguments as a string.
 * @type {Command}
 */
export const echo: Command = new Command("echo", (args, options, terminal) => {
    return `${args.join(" ")}`;
});

