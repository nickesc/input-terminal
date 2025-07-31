import { Terminal, ExitObject, Command } from './input-terminal.js';

let output = document.getElementById("output");
let terminal = new Terminal(document.getElementById("terminal"));
terminal.init();

const help_command = new Command("help", (args, options, terminal) => {
    output.innerText = "Commands:\necho\nhelp\nresult";
    return {};
});

const result_command = new Command("result", (args, options, terminal) => {
    output.innerText = `${terminal.lastExitCode}`;
    return {};
});

const return_command = new Command("return", (args, options, terminal) => {
    return {args: args, options: options};
});

const echo_command = new Command("echo", (args, options, terminal) => {
    output.innerText = `${args.join(" ")}`;
    return {};
});

terminal.commands.add(help_command);
terminal.commands.add(result_command);
terminal.commands.add(return_command);
terminal.commands.add(echo_command);

terminal.history.push(new ExitObject(["help"], help_command, 0, {}))
terminal.history.push(new ExitObject(["result"], result_command, 0, {}))
terminal.history.push(new ExitObject(["return"], return_command, 0, {}))
terminal.history.push(new ExitObject(["echo this is a test"], echo_command, 0, {}))


