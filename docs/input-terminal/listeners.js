/**
 * Handles keyboard and selection events for the terminal.
 * @category Terminal Components
 */
export class TermListeners {
    _terminal;
    _predictionIndex = 0;
    _autocompletePredictions = undefined;
    /**
     * @param {Terminal} terminal - the terminal to attach listeners to
     */
    constructor(terminal) {
        this._terminal = terminal;
    }
    /**
     * Update input and move history to the previous command.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    previousListenerAction(event) {
        event.preventDefault();
        const previous = this._terminal.history.previous();
        const newInput = previous?.rawInput;
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
    nextListenerAction(event) {
        event.preventDefault();
        const next = this._terminal.history.next();
        const newInput = next?.rawInput;
        if (!this._terminal.options.showDuplicateCommands) {
            if (newInput === this._terminal.getInputValue()) {
                this.nextListenerAction(new Event(""));
                return;
            }
        }
        if (next !== undefined) {
            this._terminal.updateInput(next.rawInput);
        }
        else {
            this._terminal.updateInput();
        }
    }
    /**
     * Attempt to autocomplete the current input in the terminal.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    autocompleteListenerAction(event) {
        let autocompleteTriggered = false;
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
            }
            else {
                this._predictionIndex = 0;
            }
        }
        else {
            this._predictionIndex = 0;
            this._autocompletePredictions = undefined;
        }
    }
    /**
     * Execute with the current terminal input.
     * @param {Event} event - the event that triggered the action
     * @returns {void}
     */
    returnListenerAction(event) {
        event.preventDefault();
        const promptLen = this._terminal.options.preprompt.length + this._terminal.options.prompt.length;
        this._terminal.executeCommand(this._terminal.input.value.slice(promptLen));
        this._terminal.updateInput();
    }
    _handleKeyboardEvent(event) {
        let deleteChunk = false;
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
                if (this._terminal.input.selectionStart !== null &&
                    this._terminal.input.selectionStart <=
                        `${this._terminal.options.preprompt}${this._terminal.options.prompt}`.length &&
                    !deleteChunk) {
                    event.preventDefault();
                }
            default:
                this._predictionIndex = 0;
                this._autocompletePredictions = undefined;
                break;
        }
    }
    _handleSelectionEvent(event) {
        const promptLength = (this._terminal.options.preprompt + this._terminal.options.prompt).length;
        const start = this._terminal.input.selectionStart;
        let end = this._terminal.input.selectionEnd;
        const direction = this._terminal.input.selectionDirection;
        if (start === end) {
            end = null;
        }
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
    attachInputListeners(previousKey = "ArrowUp", nextKey = "ArrowDown") {
        this._terminal.input.addEventListener("keydown", (event) => {
            this._handleKeyboardEvent(event);
        });
        this._terminal.input.addEventListener("selectionchange", (event) => {
            this._handleSelectionEvent(event);
        });
    }
}
