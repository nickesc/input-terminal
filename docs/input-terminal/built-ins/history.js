import { Command } from "../commands.js";
/**
 * The `history` command. Prints the terminal's command/input history.
 * @type {Command}
 */
const history = new Command("history", (args, options, terminal) => {
    const history = terminal.history.items.map((item) => item.rawInput);
    terminal.stdout(history.join("\n"));
    return { history };
});
history.manual = `history

Prints and returns the terminal's command/input history.`;
export { history };
