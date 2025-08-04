import { Terminal, ExitObject, Command, built_ins } from './input-terminal/input-terminal.js';

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

const manObject = new ExitObject(["man", "echo"], "man echo", built_ins.man, 0, {})

const resultObject = new ExitObject(["result"], "result", built_ins.result, 0, {exit: terminal.get_last_exit_object()})

const returnObject = new ExitObject(["return"], "return", built_ins.return, 0, {args: ["test"], options: {}})

const echoObject = new ExitObject(["echo this is a test"], "echo this is a test", built_ins.echo, 0, {output: "this is a test"})

terminal.history.push(manObject)
terminal.history.push(resultObject)
terminal.history.push(returnObject)
terminal.history.push(echoObject)

terminal.addEventListener("inputTerminalExecuted", (e) => {
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




