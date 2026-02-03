import {Command} from "../commands.ts";

/**
 * The `echo` command. Outputs the provided arguments to stdout.
 *
 * If no arguments are provided, it will output an empty string.
 * @type {Command}
 */
const echo: Command = new Command("echo", (args, options, terminal) => {
    const output: string = args.join(" ");
    terminal.stdout(output);
    return output;
});

echo.manual = `echo [arguments]

Outputs the provided arguments to stdout.

If no arguments are provided, it will output an empty string.`;

export {echo};
