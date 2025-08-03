/**
 * Handles keyboard and selection events for the terminal.
 * @category Terminal Components
 */
export class TermListeners {
    _terminal;
    _prediction_index = 0;
    _autocomplete_predictions = undefined;
    /**
     * @param {Terminal} terminal - the terminal to attach listeners to
     */
    constructor(terminal) {
        this._terminal = terminal;
    }
    _handle_keyboard_event(event) {
        let autocomplete_triggered = false;
        if (this._autocomplete_predictions === undefined) {
            this._autocomplete_predictions = this._terminal.get_predictions(this._terminal.get_input_value());
        }
        switch (event.key) {
            case this._terminal.options.previousKey:
                event.preventDefault();
                this._terminal.update_input(this._terminal.history.previous()?.user_input.join(" "));
                break;
            case this._terminal.options.nextKey:
                event.preventDefault();
                const next = this._terminal.history.next();
                if (next !== undefined) {
                    this._terminal.update_input(next.user_input.join(" "));
                }
                else {
                    this._terminal.update_input();
                }
                break;
            case this._terminal.options.autocompleteKey:
                event.preventDefault();
                if (this._autocomplete_predictions && this._autocomplete_predictions.length > 0) {
                    this._terminal.update_input(this._autocomplete_predictions[this._prediction_index]);
                    autocomplete_triggered = true;
                }
                break;
            case this._terminal.options.returnKey:
                event.preventDefault();
                const promptLen = this._terminal.options.preprompt.length + this._terminal.options.prompt.length;
                this._terminal.execute_command(this._terminal.input.value.slice(promptLen));
                this._terminal.update_input();
                break;
            case "Backspace":
            case "Delete":
            case "ArrowLeft":
                if (this._terminal.input.selectionStart !== null && this._terminal.input.selectionStart <= (this._terminal.options.preprompt + this._terminal.options.prompt).length) {
                    event.preventDefault();
                }
                break;
        }
        if (autocomplete_triggered) {
            if (this._prediction_index < this._autocomplete_predictions.length - 1) {
                this._prediction_index++;
            }
            else {
                this._prediction_index = 0;
            }
        }
        else {
            this._prediction_index = 0;
            this._autocomplete_predictions = undefined;
        }
    }
    _handle_selection_event(event) {
        const promptLength = (this._terminal.options.preprompt + this._terminal.options.prompt).length;
        const start = this._terminal.input.selectionStart;
        let end = this._terminal.input.selectionEnd;
        const direction = this._terminal.input.selectionDirection;
        if (start === end) {
            end = null;
        }
        ;
        if (start !== null && start < promptLength) {
            if (end !== null && end <= promptLength) {
                this._terminal.input.setSelectionRange(promptLength, promptLength);
            }
            else if (end !== null) {
                this._terminal.input.setSelectionRange(promptLength, end, direction);
            }
            else {
                this._terminal.input.selectionStart = promptLength;
            }
        }
    }
    /**
     * Attaches listeners to the terminal's input element.
     * @param {string} [previousKey="ArrowUp"] - the key used to select the previous command; defaults to `ArrowUp`
     * @param {string} [nextKey="ArrowDown"] - the key used to select the next command; defaults to `ArrowDown`
     * @returns {void}
     */
    attach_input_listeners(previousKey = "ArrowUp", nextKey = "ArrowDown") {
        this._terminal.input.addEventListener("keydown", (event) => {
            this._handle_keyboard_event(event);
        });
        this._terminal.input.addEventListener("selectionchange", (event) => {
            this._handle_selection_event(event);
        });
    }
}
