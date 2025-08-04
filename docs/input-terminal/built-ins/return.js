import { Command } from "../commands.js";
/**
 * The `return` command. Returns an empty object.
 * @type {Command}
 */
export const return_ = new Command("return", (args, options, terminal) => {
    return {};
});
