import { Command } from "../commands.ts";

/**
 * The `result` command. Returns the last command's exit code.
 * @type {Command}
 */
export const result: Command = new Command("result", (args, options, terminal) => {
    return {exit: terminal.get_last_exit_object()};
});

