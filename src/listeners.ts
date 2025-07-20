import type { Terminal } from './input-terminal';

export class TermListeners {
    private _terminal: Terminal

    constructor(terminal: Terminal) {
        this._terminal = terminal;
    }

    private _handle_keyboard_event(event: KeyboardEvent): void {
        switch (event.key) {
            case this._terminal.options.previousKey:
                event.preventDefault();
                this._terminal.update_input(this._terminal.history.previous()?.user_input.join(" "))
                break;
            case this._terminal.options.nextKey:
                event.preventDefault();
                this._terminal.update_input(this._terminal.history.next()?.user_input.join(" "))
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

    private _handle_selection_event(event: Event): void {
        const promptLength: number = (this._terminal.options.preprompt + this._terminal.options.prompt).length;
        const start: number | null = this._terminal.input.selectionStart;
        const end: number | null = this._terminal.input.selectionEnd;
        const direction = this._terminal.input.selectionDirection;

        if (start !== null && start < promptLength) {
            if (end !== null && end <= promptLength) {
                this._terminal.input.setSelectionRange(promptLength, promptLength);
            } else if (end !== null) {
                this._terminal.input.setSelectionRange(promptLength, end, direction || undefined);
            } else {
                this._terminal.input.selectionStart = promptLength;
            }
        }
    }

    public attach_input_listeners(previousKey: string = "ArrowUp", nextKey: string = "ArrowDown"): void {
        this._terminal.input.addEventListener("keydown", (event: KeyboardEvent) => {
            this._handle_keyboard_event(event)
        });
        this._terminal.input.addEventListener("selectionchange", (event: Event) => {
            this,this._handle_selection_event(event)
        })
    }
}
