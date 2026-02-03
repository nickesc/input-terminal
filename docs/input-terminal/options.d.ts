/**
 * The configuration for the terminal.
 * @category Terminal Components
 */
export interface TermOptionsConfig {
    /**
     * The key used to select the previous command.
     * @default "ArrowUp"
     */
    previousKey?: string;
    /**
     * The key used to select the next command.
     * @default "ArrowDown"
     */
    nextKey?: string;
    /**
     * The key used to enter a command.
     * @default "Enter"
     */
    returnKey?: string;
    /**
     * The key used to autocomplete a command.
     * @default "Tab"
     */
    autocompleteKey?: string;
    /**
     * Whether the terminal should install built-in commands.
     * @default true
     */
    installBuiltins?: boolean;
    /**
     * A line of text that is displayed at the beginning of the command line.
     * @default "> "
     */
    prompt?: string;
    /**
     * A line of text that is displayed before the prompt.
     * @default ""
     */
    preprompt?: string;
    /**
     * Whether the terminal should add a command with empty input to history.
     * @default false
     */
    addEmptyCommandToHistory?: boolean;
    /**
     * Whether the terminal should add a command with duplicate input (same as the last command's input) to history.
     * @default false
     */
    showDuplicateCommands?: boolean;
    /**
     * Any other custom options.
     */
    [key: string]: any;
}
/**
 * Manages the terminal's configuration.
 * @category Terminal Components
 */
export declare class TermOptions implements TermOptionsConfig {
    previousKey: string;
    nextKey: string;
    returnKey: string;
    autocompleteKey: string;
    installBuiltins: boolean;
    prompt: string;
    preprompt: string;
    addEmptyCommandToHistory: boolean;
    showDuplicateCommands: boolean;
    /**
     * @param {TermOptionsConfig} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options?: TermOptionsConfig);
}
