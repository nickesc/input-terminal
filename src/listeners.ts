import type { Terminal } from './input-terminal';

/**
 * Handles keyboard and selection events for the terminal.
 * @category Terminal Components
 */
export class TermListeners {
    private _terminal: Terminal
    private _prediction_index: number = 0;
    private _autocomplete_predictions: string[] | undefined = undefined;

    /**
     * @param {Terminal} terminal - the terminal to attach listeners to
     */
    constructor(terminal: Terminal) {
        this._terminal = terminal;
    }

    /**
     * Update input and move history to the previous command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    public previous_listener_action(event: Event): void {
        event.preventDefault();
        this._terminal.update_input(this._terminal.history.previous()?.raw_input)
    }

    /**
     * Update input and move history to the next command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    public next_listener_action(event: Event): void {
        event.preventDefault();
        const next = this._terminal.history.next()
        if (next !== undefined) {
            this._terminal.update_input(next.raw_input)
        } else {
            this._terminal.update_input();
        }
    }

    /**
     * Attempt to autocomplete the current input in the terminal.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    public autocomplete_listener_action(event: Event): void {
        let autocomplete_triggered: boolean = false;
        if (this._autocomplete_predictions === undefined) {
            this._autocomplete_predictions = this._terminal.get_predictions(this._terminal.get_input_value());
        }

        event.preventDefault();
        if (this._autocomplete_predictions && this._autocomplete_predictions.length > 0) {
            this._terminal.update_input(this._autocomplete_predictions[this._prediction_index]);
            autocomplete_triggered = true;
        }

        if (autocomplete_triggered) {
            if (this._prediction_index < this._autocomplete_predictions.length - 1) {
                this._prediction_index++;
            } else {
                this._prediction_index = 0;
            }
        } else {
            this._prediction_index = 0;
            this._autocomplete_predictions = undefined;
        }
    }

    /**
     * Execute with the current terminal input.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    public return_listener_action(event: Event): void {
        event.preventDefault();
        const promptLen: number = this._terminal.options.preprompt.length + this._terminal.options.prompt.length;
        this._terminal.execute_command(this._terminal.input.value.slice(promptLen));
        this._terminal.update_input();
    }

    private _handle_keyboard_event(event: KeyboardEvent): void {

        switch (event.key) {
            case this._terminal.options.previousKey:
                this.previous_listener_action(event);
                break;
            case this._terminal.options.nextKey:
                this.next_listener_action(event);
                break;
            case this._terminal.options.autocompleteKey:
                this.autocomplete_listener_action(event);
                break;
            case this._terminal.options.returnKey:
                this.return_listener_action(event);
                break;
            case "Backspace":
            case "Delete":
            case "ArrowLeft":
                if (this._terminal.input.selectionStart !== null && this._terminal.input.selectionStart <= (this._terminal.options.preprompt + this._terminal.options.prompt).length) {
                    event.preventDefault();
                }
            default:
                this._prediction_index = 0;
                this._autocomplete_predictions = undefined;
                break;
        }

    }


    private _handle_selection_event(event: Event): void {
        const promptLength: number = (this._terminal.options.preprompt + this._terminal.options.prompt).length;
        const start: number | null = this._terminal.input.selectionStart;
        let end: number | null = this._terminal.input.selectionEnd;
        const direction = this._terminal.input.selectionDirection;

        if (start === end) { end = null };

        if (start !== null && start < promptLength) {

            if (end !== null && end <= promptLength) {
                this._terminal.input.setSelectionRange(promptLength, promptLength);
            } else if (end !== null) {
                this._terminal.input.setSelectionRange(promptLength, end, direction!);
            } else {
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
    public attach_input_listeners(previousKey: string = "ArrowUp", nextKey: string = "ArrowDown"): void {
        this._terminal.input.addEventListener("keydown", (event: KeyboardEvent) => {
            this._handle_keyboard_event(event)
        });
        this._terminal.input.addEventListener("selectionchange", (event: Event) => {
            this._handle_selection_event(event)
        })
    }
}
