import { Command } from "../commands.ts";

/**
 * The `return` command. Returns an empty object.
 * @type {Command}
 */
export const return_: Command = new Command("return", (args, options, terminal) => {
    return {};
});

