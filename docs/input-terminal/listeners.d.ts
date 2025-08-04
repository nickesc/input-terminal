import type { Terminal } from './input-terminal';
/**
 * Handles keyboard and selection events for the terminal.
 * @category Terminal Components
 */
export declare class TermListeners {
    private _terminal;
    private _prediction_index;
    private _autocomplete_predictions;
    /**
     * @param {Terminal} terminal - the terminal to attach listeners to
     */
    constructor(terminal: Terminal);
    /**
     * Update input and move history to the previous command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    previous_listener_action(event: Event): void;
    /**
     * Update input and move history to the next command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    next_listener_action(event: Event): void;
    /**
     * Attempt to autocomplete the current input in the terminal.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    autocomplete_listener_action(event: Event): void;
    /**
     * Execute with the current terminal input.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    return_listener_action(event: Event): void;
    private _handle_keyboard_event;
    private _handle_selection_event;
    /**
     * Attaches listeners to the terminal's input element.
     * @param {string} [previousKey="ArrowUp"] - the key used to select the previous command; defaults to `ArrowUp`
     * @param {string} [nextKey="ArrowDown"] - the key used to select the next command; defaults to `ArrowDown`
     * @returns {void}
     */
    attach_input_listeners(previousKey?: string, nextKey?: string): void;
}
