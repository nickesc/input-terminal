import { Command } from "../commands.ts";

/**
 * The `return` command. Returns an empty object.
 * @type {Command}
 */
const return_: Command = new Command("return", (args, options, terminal) => {
    return {};
});

return_.manual = `return

Returns an empty object.`;

export { return_ };
