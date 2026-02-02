import type {ExitObject, Terminal} from "./input-terminal";

/**
 * Handles keyboard and selection events for the terminal.
 * @category Terminal Components
 */
export class TermListeners {
    private _terminal: Terminal;
    private _predictionIndex: number = 0;
    private _autocompletePredictions: string[] | undefined = undefined;

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
    public previousListenerAction(event: Event): void {
        event.preventDefault();

        const previous: ExitObject | null | undefined = this._terminal.history.previous();
        const newInput: string | undefined = previous?.rawInput;

        if (!this._terminal.options.showDuplicateCommands && newInput !== undefined) {
            if (newInput === this._terminal.getInputValue()) {
                this.previousListenerAction(new Event(""));
                return;
            }
        }

        if (previous !== null) {
            this._terminal.updateInput(newInput);
        }
    }

    /**
     * Update input and move history to the next command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    public nextListenerAction(event: Event): void {
        event.preventDefault();
        const next: ExitObject | undefined = this._terminal.history.next();
        const newInput: string | undefined = next?.rawInput;

        if (!this._terminal.options.showDuplicateCommands) {
            if (newInput === this._terminal.getInputValue()) {
                this.nextListenerAction(new Event(""));
                return;
            }
        }

        if (next !== undefined) {
            this._terminal.updateInput(next.rawInput);
        } else {
            this._terminal.updateInput();
        }
    }

    /**
     * Attempt to autocomplete the current input in the terminal.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    public autocompleteListenerAction(event: Event): void {
        let autocompleteTriggered: boolean = false;
        if (this._autocompletePredictions === undefined) {
            this._autocompletePredictions = this._terminal.getPredictions(this._terminal.getInputValue());
        }

        event.preventDefault();
        if (this._autocompletePredictions && this._autocompletePredictions.length > 0) {
            this._terminal.updateInput(this._autocompletePredictions[this._predictionIndex]);
            autocompleteTriggered = true;
        }

        if (autocompleteTriggered) {
            if (this._predictionIndex < this._autocompletePredictions.length - 1) {
                this._predictionIndex++;
            } else {
                this._predictionIndex = 0;
            }
        } else {
            this._predictionIndex = 0;
            this._autocompletePredictions = undefined;
        }
    }

    /**
     * Execute with the current terminal input.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    public returnListenerAction(event: Event): void {
        event.preventDefault();
        const promptLen: number = this._terminal.getFullPrompt().length;
        this._terminal.executeCommand(this._terminal.input.value.slice(promptLen));
        this._terminal.updateInput();
    }

    private _handleKeyboardEvent(event: KeyboardEvent): void {
        let deleteChunk: boolean = false;

        switch (event.key) {
            case this._terminal.options.previousKey:
                this.previousListenerAction(event);
                break;
            case this._terminal.options.nextKey:
                this.nextListenerAction(event);
                break;
            case this._terminal.options.autocompleteKey:
                this.autocompleteListenerAction(event);
                break;
            case this._terminal.options.returnKey:
                this.returnListenerAction(event);
                break;
            case "Backspace":
            case "Delete":
                if (this._terminal.input.selectionStart !== this._terminal.input.selectionEnd) {
                    deleteChunk = true;
                }
            case "ArrowLeft":
                if (
                    this._terminal.input.selectionStart !== null &&
                    this._terminal.input.selectionStart <= this._terminal.getFullPrompt().length &&
                    !deleteChunk
                ) {
                    event.preventDefault();
                }
            default:
                this._predictionIndex = 0;
                this._autocompletePredictions = undefined;
                break;
        }
    }

    private _handleSelectionEvent(event: Event): void {
        const promptLength: number = this._terminal.getFullPrompt().length;
        const start: number | null = this._terminal.input.selectionStart;
        let end: number | null = this._terminal.input.selectionEnd;
        const direction = this._terminal.input.selectionDirection;

        if (start === end) {
            end = null;
        }

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
     * @returns {void}
     */
    public attachInputListeners(): void {
        this._terminal.input.addEventListener("keydown", (event: KeyboardEvent) => {
            this._handleKeyboardEvent(event);
        });
        this._terminal.input.addEventListener("selectionchange", (event: Event) => {
            this._handleSelectionEvent(event);
        });
    }
}
