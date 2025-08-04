import { Command } from "../commands.js";
/**
 * The `result` command. Returns the last command's exit code.
 * @type {Command}
 */
export const result = new Command("result", (args, options, terminal) => {
    return { exitCode: terminal.lastExitCode };
});
