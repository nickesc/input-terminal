/**
 * The configuration for the terminal.
 * @category Terminal Components
 */
export interface TermOptions {
    /**
     * The key used to select the previous command.
     * @default "ArrowUp"
     */
    readonly previousKey: string;

    /**
     * The key used to select the next command.
     * @default "ArrowDown"
     */
    readonly nextKey: string;

    /**
     * The key used to enter a command.
     * @default "Enter"
     */
    readonly returnKey: string;

    /**
     * The key used to autocomplete a command.
     * @default "Tab"
     */
    readonly autocompleteKey: string;

    /**
     * Whether the terminal should install built-in commands.
     * @default true
     */
    readonly installBuiltins: boolean;

    /**
     * A line of text that is displayed at the beginning of the command line.
     * @default "> "
     */
    readonly prompt: string;

    /**
     * A line of text that is displayed before the prompt.
     * @default ""
     */
    readonly preprompt: string;

    /**
     * Whether the terminal should add a command with empty input to history.
     * @default false
     */
    readonly addEmptyCommandToHistory: boolean;

    /**
     * Whether the terminal should add a command with duplicate input (same as the last command's input) to history.
     * @default false
     */
    readonly showDuplicateCommands: boolean;

    /**
     * Any other custom options.
     */
    readonly [key: string]: unknown;
}

export const defaultTermOptions: TermOptions = Object.freeze({
    previousKey: "ArrowUp",
    nextKey: "ArrowDown",
    returnKey: "Enter",
    autocompleteKey: "Tab",
    installBuiltins: true,
    prompt: "> ",
    preprompt: "",
    addEmptyCommandToHistory: false,
    showDuplicateCommands: false,
});
