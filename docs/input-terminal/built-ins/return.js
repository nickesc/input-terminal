import { Command } from "../commands.js";
/**
 * The `return` command. Returns an empty object.
 * @type {Command}
 */
const return_ = new Command("return", (args, options, terminal) => {
    return {};
});
return_.manual = `return

Returns an empty object.`;
export { return_ };
