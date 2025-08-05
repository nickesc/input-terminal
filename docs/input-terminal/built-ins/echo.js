import { Command } from "../commands.js";
/**
 * The `echo` command. Returns the provided arguments as a string.
 *
 * If no arguments are provided, it will return an empty string.
 * @type {Command}
 */
const echo = new Command("echo", (args, options, terminal) => {
    return `${args.join(" ")}`;
});
echo.manual = `echo [arguments]

Returns the provided arguments as a string.

If no arguments are provided, it will return an empty string.`;
export { echo };
