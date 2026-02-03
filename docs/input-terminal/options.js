/**
 * Manages the terminal's configuration.
 * @category Terminal Components
 */
export class TermOptions {
    previousKey = "ArrowUp";
    nextKey = "ArrowDown";
    returnKey = "Enter";
    autocompleteKey = "Tab";
    installBuiltins = true;
    prompt = "> ";
    preprompt = "";
    addEmptyCommandToHistory = false;
    showDuplicateCommands = false;
    /**
     * @param {TermOptionsConfig} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
