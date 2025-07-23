import { Terminal, ExitObject, Command } from './input-terminal.js';

let output = document.getElementById("output");
let terminal = new Terminal(document.getElementById("terminal"));
terminal.init();

terminal.history.push(new ExitObject(["help"], undefined, 0))
terminal.history.push(new ExitObject(["result"], undefined, 0))
terminal.history.push(new ExitObject(["echo this is a test"], undefined, 0))

terminal.commands.add(new Command("help", (args, options, terminal) => {output.innerText = "Commands:\necho\nhelp\nresult"}))
terminal.commands.add(new Command("echo", (args, options, terminal) => {
    output.innerText = `${args.join(" ")} ${options.join(" ")}`
}))
terminal.commands.add(new Command("result", (args, options, terminal) => {
    output.innerText = `${terminal.lastExitCode}`
}))
