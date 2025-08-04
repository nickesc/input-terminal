import { Command } from "../commands.ts";

/**
 * The `alert` command. Creates a browser alert with the provided arguments.
 * @type {Command}
 */
export const alert: Command = new Command("alert", (args, options, terminal) => {
    window.alert(`${args.join(" ")}`);
    return {};
});

