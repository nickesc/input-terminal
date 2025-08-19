import { Command } from "../commands.ts";

/**
 * The `alert` command. Creates a browser alert with the provided arguments.
 *
 * If no arguments are provided, it will create an alert with an empty string.
 * @type {Command}
 */
const alert: Command = new Command("alert", (args, options, terminal) => {
    window.alert(`${args.join(" ")}`);
});

alert.manual = `alert [arguments]

Creates a browser alert with the provided arguments.

If no arguments are provided, it will create an alert with an empty string.`;

export { alert };
