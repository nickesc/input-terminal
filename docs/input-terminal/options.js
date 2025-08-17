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
     * Whether the terminal should install built-in commands.
     * @type {boolean}
     */
    installBuiltins = true;
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
     * Whether the terminal should add a command with empty input to history.
     * @type {boolean}
     */
    addEmptyCommandToHistory = false;
    /**
     * Whether the terminal should add a command with duplicate input (same as the last command's input) to history.
     * @type {boolean}
     */
    showDuplicateCommands = false;
    /**
     * @param {object} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options) {
        Object.assign(this, options);
    }
}
