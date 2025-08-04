import { Terminal, ExitObject, Command, built_ins } from './input-terminal/input-terminal.js';

let output = document.getElementById("output");
let terminal = new Terminal(document.getElementById("termd"));

const autocompleteButton = document.getElementById("autocomplete");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const returnButton = document.getElementById("return");
const actionSlug = document.getElementById("action-slug");

const empty = new Command("", (args, options, terminal) => {
    output.innerText = ""
    return {};
});

const manObject = new ExitObject(["man", "echo"], "man echo", built_ins.man, 0, {})

const resultObject = new ExitObject(["result"], "result", built_ins.result, 0, {exit: terminal.get_last_exit_object()})

const returnObject = new ExitObject(["return"], "return", built_ins.return, 0, {args: ["test"], options: {}})

const echoObject = new ExitObject(["echo this is a test"], "echo this is a test", built_ins.echo, 0, {output: "this is a test"})

let slugTimeout = null;
let slugTransitionTimeout = null;

function updateActionSlug(action){
    if (slugTimeout){
        clearTimeout(slugTimeout);
    }
    if (slugTransitionTimeout){
        clearTimeout(slugTransitionTimeout);
    }

    if (actionSlug.innerText && actionSlug.innerText !== action) {
        actionSlug.classList.remove("action-slug-active");

        slugTransitionTimeout = setTimeout(() => {
            actionSlug.innerText = action;
            actionSlug.classList.add("action-slug-active");

            slugTimeout = setTimeout(() => {
                actionSlug.classList.remove("action-slug-active");
            }, 1500);
        }, 300);
    } else {
        actionSlug.innerText = action;
        actionSlug.classList.add("action-slug-active");

        slugTimeout = setTimeout(() => {
            actionSlug.classList.remove("action-slug-active");
        }, 1500);
    }
}

terminal.bin.empty_command = empty;

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

autocompleteButton.addEventListener("click", () => {
    terminal.listeners.autocomplete_listener_action(new Event("keydown"));
    updateActionSlug("autocomplete");
});

nextButton.addEventListener("click", () => {
    terminal.listeners.next_listener_action(new Event("keydown"));
    updateActionSlug("next");
});

previousButton.addEventListener("click", () => {
    terminal.listeners.previous_listener_action(new Event("keydown"));
    updateActionSlug("previous");
});

returnButton.addEventListener("click", () => {
    terminal.listeners.return_listener_action(new Event("keydown"));
    updateActionSlug("return");
});

terminal.init();



