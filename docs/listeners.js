export class TermListeners {
    constructor(terminal) {
        this._terminal = terminal;
    }
    _handle_keyboard_event(event) {
        var _a;
        switch (event.key) {
            case this._terminal.options.previousKey:
                event.preventDefault();
                this._terminal.update_input((_a = this._terminal.history.previous()) === null || _a === void 0 ? void 0 : _a.user_input.join(" "));
                break;
            case this._terminal.options.nextKey:
                event.preventDefault();
                const next = this._terminal.history.next();
                if (next) {
                    this._terminal.update_input(next.user_input.join(" "));
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
    attach_input_listeners(previousKey = "ArrowUp", nextKey = "ArrowDown") {
        this._terminal.input.addEventListener("keydown", (event) => {
            this._handle_keyboard_event(event);
        });
        this._terminal.input.addEventListener("selectionchange", (event) => {
            this._handle_selection_event(event);
        });
    }
}
