import { Terminal, ExitObject, Command } from './input-terminal.js';

let terminal = new Terminal(document.getElementById("terminal"));
terminal.init();

terminal.history.push(new ExitObject(["test1"], undefined, 0))
terminal.history.push(new ExitObject(["test2"], undefined, 0))
terminal.history.push(new ExitObject(["test3"], undefined, 0))

terminal.commands.add(new Command("help", (args, options, terminal) => {console.log("help")}))
terminal.commands.add(new Command("echo", (args, options, terminal) => {console.log(args.join(" "), options.join(" "))}))
terminal.commands.add(new Command("git", (args, options, terminal) => {console.log(terminal)}))
