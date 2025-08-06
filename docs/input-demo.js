import { Terminal, ExitObject, Command, built_ins } from './input-terminal/input-terminal.js';

let output = document.getElementById("output");
let terminal = new Terminal(document.getElementById("termd"));
let slugTimeout = null;
let slugTransitionTimeout = null;

const autocompleteButton = document.getElementById("autocomplete");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const returnButton = document.getElementById("return");
const actionSlug = document.getElementById("action-slug");
const outputCommand = document.getElementById("output-command");
const outputCode = document.getElementById("output-code");

const empty = new Command("", (args, options, terminal) => {
    output.innerText = "";
    return {};
});

const changeThemeCommand = new Command("theme", (args, options, terminal) => {


    if (["light", "dark", "os"].includes(args[0])){
        changeTheme(args[0]);
        return `Theme changed to ${args[0]}`;
    } else if (options.list || options.l){
        return {themes: ["light", "dark", "os"]};
    } else if (args.length === 0){
        return `${document.getElementById("tsd-theme").value}`;
    } else {
        return `Invalid theme. Please use 'light', 'dark', or 'os'.`;
    }
});

changeThemeCommand.manual = `theme ["light" | "dark" | "os"] [--list | -l]

Gets or changes the theme of the website.

If --list or -l is provided, it will list the available themes.`;

const history_list = [
    new ExitObject(["man", "echo"], "man echo", built_ins.man, 0, {}),
    new ExitObject(["result"], "result", built_ins.result, 0, {exit: terminal.get_last_exit_object()}),
    new ExitObject(["return"], "return", built_ins.return, 0, {args: ["test"], options: {}}),
    new ExitObject(["echo this is a test"], "echo this is a test", built_ins.echo, 0, {output: "this is a test"})
]

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

function changeTheme(themeString) {
    let themeDropdown = document.getElementById("tsd-theme");
    themeDropdown.value = themeString;
    themeDropdown.dispatchEvent(new Event("change"));
}

terminal.addEventListener("inputTerminalExecuted", (e) => {
    if (e.detail.exit_code === 0){
        if (["string", "number", "boolean"].includes(typeof e.detail.output)){
            output.innerText = e.detail.output;
        } else {
            output.innerText = JSON.stringify(e.detail.output);
        }
        outputCommand.innerText = e.detail.command.key;
        outputCode.innerText = e.detail.exit_code;
    } else {
        output.innerText = e.detail.error;
        outputCommand.innerText = "error";
        outputCode.innerText = e.detail.exit_code;
    }
});

autocompleteButton.addEventListener("click", () => {
    terminal.listeners.autocomplete_listener_action(new Event("keydown"));
    updateActionSlug("autocomplete");
});

nextButton.addEventListener("click", () => {
    terminal.listeners.next_listener_action(new Event("keydown"));
    updateActionSlug("next command");
});

previousButton.addEventListener("click", () => {
    terminal.listeners.previous_listener_action(new Event("keydown"));
    updateActionSlug("previous command");
});

returnButton.addEventListener("click", () => {
    terminal.listeners.return_listener_action(new Event("keydown"));
    updateActionSlug("execute command");
});

terminal.bin.empty_command = empty;

terminal.history.push(history_list)

terminal.bin.add(changeThemeCommand);


terminal.init();


