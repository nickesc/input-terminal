import { Command } from "../commands.ts";

/**
 * The `result` command. Returns the last command's exit code.
 * @type {Command}
 */
const result: Command = new Command("result", (args, options, terminal) => {


    if (options.first || options.f){
        return {exit: terminal.history.items[terminal.history.items.length-1]};
    } else if (options.last || options.l){
        return {exit: terminal.get_last_exit_object()};
    } else if (options.index || options.i){
        console.log(options, args);
        const index: number = Number(options.index?.value || options.i?.value || -1);
        if (index < 0 || index >= terminal.history.items.length){
            return {exit: {error: "Index out of bounds"}};
        }
        return {exit: terminal.history.items[index]};
    }
    return {exit: terminal.get_last_exit_object()};
});

result.manual = `result [--first|-f] [--last|-l] [--index|-i]

Returns the last command's exit code.

If no command has been run, it will return an empty object.`;

export { result };
