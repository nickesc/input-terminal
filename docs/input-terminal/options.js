/**
 * Manages the terminal's configuration.
 * @category Terminal Components
 */
export class TermOptions {
    /**
     * The key used to select the previous command.
     * @type {string}
     */
    previousKey = "ArrowUp";
    /**
     * The key used to select the next command.
     * @type {string}
     */
    nextKey = "ArrowDown";
    /**
     * The key used to enter a command.
     * @type {string}
     */
    returnKey = "Enter";
    /**
     * The key used to autocomplete a command.
     * @type {string}
     */
    autocompleteKey = "Tab";
    /**
     * The modifier key.
     * @type {string}
     */
    modKey = "Ctrl";
    /**
     * Whether the terminal should start focused.
     * @type {boolean}
     */
    startFocused = false;
    /**
     * A line of text that is displayed at the beginning of the command line.
     * @type {string}
     */
    prompt = "> ";
    /**
     * A line of text that is displayed before the prompt.
     * @type {string}
     */
    preprompt = "";
    /**
     * @param {object} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options) {
        Object.assign(this, options);
    }
}
