/**
 * Manages the terminal's configuration.
 */
export class TermOptions {
    previousKey = "ArrowUp";
    nextKey = "ArrowDown";
    returnKey = "Enter";
    autocompleteKey = "Tab";
    modKey = "Ctrl";
    startFocused = false;
    prompt = "> ";
    preprompt = "";
    /**
     * @param {object} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options) {
        Object.assign(this, options);
    }
}
