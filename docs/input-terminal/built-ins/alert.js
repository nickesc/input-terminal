import { Command } from "../commands.js";
/**
 * The `alert` command. Creates a browser alert with the provided arguments.
 * @type {Command}
 */
export const alert = new Command("alert", (args, options, terminal) => {
    window.alert(`${args.join(" ")}`);
    return {};
});
