/**
 * Manages the terminal's configuration.
 * @category Terminal Components
 */
export declare class TermOptions {
    /**
     * The key used to select the previous command.
     * @type {string}
     */
    previousKey: string;
    /**
     * The key used to select the next command.
     * @type {string}
     */
    nextKey: string;
    /**
     * The key used to enter a command.
     * @type {string}
     */
    returnKey: string;
    /**
     * The key used to autocomplete a command.
     * @type {string}
     */
    autocompleteKey: string;
    /**
     * The modifier key.
     * @type {string}
     */
    modKey: string;
    /**
     * Whether the terminal should install built-in commands.
     * @type {boolean}
     */
    installBuiltins: boolean;
    /**
     * A line of text that is displayed at the beginning of the command line.
     * @type {string}
     */
    prompt: string;
    /**
     * A line of text that is displayed before the prompt.
     * @type {string}
     */
    preprompt: string;
    /**
     * Whether the terminal should add a command with empty input to history.
     * @type {boolean}
     */
    addEmptyCommandToHistory: boolean;
    /**
     * Whether the terminal should add a command with duplicate input (same as the last command's input) to history.
     * @type {boolean}
     */
    showDuplicateCommands: boolean;
    /**
     * @param {object} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options?: object);
}
