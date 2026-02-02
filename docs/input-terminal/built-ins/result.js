import { Command } from "../commands.js";
/**
 * The `result` command. Returns the last command's exit code.
 * @type {Command}
 */
const result = new Command("result", (args, options, terminal) => {
    if (options.first || options.f) {
        terminal.stdout(terminal.history.items[terminal.history.items.length - 1]);
        return { exit: terminal.history.items[terminal.history.items.length - 1] };
    }
    else if (options.last || options.l) {
        terminal.stdout(terminal.getLastExitObject());
        return { exit: terminal.getLastExitObject() };
    }
    else if (options.index || options.i) {
        let index;
        const rawIndex = options.index?.value || options.i?.value || -1;
        if (typeof rawIndex === "number") {
            index = rawIndex;
        }
        else {
            index = -1;
        }
        if (index < 0 || index >= terminal.history.items.length) {
            terminal.stderr("Invalid index");
            return { exit: { error: "Invalid index" } };
        }
        terminal.stdout(terminal.history.items[index]);
        return { exit: terminal.history.items[index] };
    }
    terminal.stdout(terminal.getLastExitObject());
    return { exit: terminal.getLastExitObject() };
});
result.manual = `result [--first|-f] [--last|-l] [--index|-i]

Returns the last command's exit code.

If no command has been run, it will return an empty object.`;
export { result };
