import { Terminal, ExitObject, Command } from './input-terminal/input-terminal.js';

let output = document.getElementById("output");
let terminal = new Terminal(document.getElementById("termd"));
terminal.init();

/* const help_command = new Command("help", (args, options, terminal) => {
    output.innerText = "Commands:\necho\nhelp\nresult";
    return {};
});

const result_command = new Command("result", (args, options, terminal) => {
    output.innerText = `${terminal.lastExitCode}`;
    return {};
});

const return_command = new Command("return", (args, options, terminal) => {
    output.innerText = ""
    return {args: args, options: options};
});


const echo_command = new Command("echo", (args, options, terminal) => {
    output.innerText = `${args.join(" ")}`;
    return {};
});

terminal.bin.add(help_command);
terminal.bin.add(result_command);
terminal.bin.add(return_command);
terminal.bin.add(echo_command); */

const empty = new Command("", (args, options, terminal) => {
    output.innerText = ""
    return {};
});

terminal.bin.empty_command = empty;

terminal.addEventListener("executed", (e) => {
    if (e.detail.exit_code === 0){
        if (["string", "number", "boolean"].includes(typeof e.detail.output)){
            output.innerText = e.detail.output;
        } else {
            output.innerText = JSON.stringify(e.detail.output);
        }
    } else {
        output.innerText = e.detail.error;
    }
});

/* terminal.history.push(new ExitObject(["help"], help_command, 0, {}))
terminal.history.push(new ExitObject(["result"], result_command, 0, {}))
terminal.history.push(new ExitObject(["return"], return_command, 0, {}))
terminal.history.push(new ExitObject(["echo this is a test"], echo_command, 0, {}))
 */

