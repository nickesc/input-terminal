import type { Terminal } from "./input-terminal";
/**
 * Handles keyboard and selection events for the terminal.
 * @category Terminal Components
 */
export declare class TermListeners {
    private _terminal;
    private _predictionIndex;
    private _autocompletePredictions;
    /**
     * @param {Terminal} terminal - the terminal to attach listeners to
     */
    constructor(terminal: Terminal);
    /**
     * Update input and move history to the previous command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    previousListenerAction(event: Event): void;
    /**
     * Update input and move history to the next command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    nextListenerAction(event: Event): void;
    /**
     * Attempt to autocomplete the current input in the terminal.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    autocompleteListenerAction(event: Event): void;
    /**
     * Execute with the current terminal input.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    returnListenerAction(event: Event): void;
    private _handleKeyboardEvent;
    private _handleSelectionEvent;
    /**
     * Attaches listeners to the terminal's input element.
     * @returns {void}
     */
    attachInputListeners(): void;
}
