/**
 * Manages the terminal's configuration.
 * @category Terminal Components
 */
export class TermOptions {

    /**
     * The key used to select the previous command.
     * @type {string}
     */
    public previousKey: string = "ArrowUp";

    /**
     * The key used to select the next command.
     * @type {string}
     */
    public nextKey: string = "ArrowDown";

    /**
     * The key used to enter a command.
     * @type {string}
     */
    public returnKey: string = "Enter";

    /**
     * The key used to autocomplete a command.
     * @type {string}
     */
    public autocompleteKey: string = "Tab";

    /**
     * The modifier key.
     * @type {string}
     */
    public modKey: string = "Ctrl";

    /**
     * Whether the terminal should install built-in commands.
     * @type {boolean}
     */
    public installBuiltins: boolean = true;

    /**
     * A line of text that is displayed at the beginning of the command line.
     * @type {string}
     */
    public prompt: string = "> ";

    /**
     * A line of text that is displayed before the prompt.
     * @type {string}
     */
    public preprompt: string = "";

    /**
     * Whether the terminal should add a command with empty input to history.
     * @type {boolean}
     */
    public addEmptyCommandToHistory: boolean = false;

    /**
     * Whether the terminal should add a command with duplicate input (same as the last command's input) to history.
     * @type {boolean}
     */
    public showDuplicateCommands: boolean = false;

    /**
     * @param {object} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options?: object) {
        Object.assign(this, options);
    }
}
