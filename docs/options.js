export class TermOptions {
    previousKey = "ArrowUp";
    nextKey = "ArrowDown";
    returnKey = "Enter";
    autocompleteKey = "Tab";
    modKey = "Ctrl";
    startFocused = false;
    prompt = "> ";
    preprompt = "";
    constructor(options) {
        Object.assign(this, options);
    }
}
