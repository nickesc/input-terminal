import {Terminal} from "./input-terminal.ts";

/**
 * Manages the terminal's output rendering.
 * Automatically subscribes to stdout/stderr events and renders them to a DOM element.
 * @category Terminal Components
 */
export class TermOutput {
    private _element: HTMLElement;
    private _terminal: Terminal;
    private _attached: boolean = false;

    // Fixed class names - not configurable
    private static readonly STDOUT_CLASS = "input-terminal-stdout";
    private static readonly STDERR_CLASS = "input-terminal-stderr";

    // Bound handlers for event listener removal
    private _boundHandleStdout: (e: Event) => void;
    private _boundHandleStderr: (e: Event) => void;

    /**
     * Get the element that output is rendered to.
     * @type {HTMLElement}
     */
    public get element(): HTMLElement {
        return this._element;
    }

    /**
     * Get whether the output is attached to the terminal.
     * @type {boolean}
     */
    public get attached(): boolean {
        return this._attached;
    }

    /**
     * @param {HTMLElement} element - the element to render output to
     * @param {Terminal} terminal - the terminal to subscribe to
     */
    constructor(element: HTMLElement, terminal: Terminal) {
        this._element = element;
        this._terminal = terminal;

        // Bind handlers so we can remove them later
        this._boundHandleStdout = this.handleStdout.bind(this);
        this._boundHandleStderr = this.handleStderr.bind(this);
    }

    /**
     * Subscribe to stdout/stderr events from the terminal.
     * @returns {void}
     */
    public attach(): void {
        if (!this._attached) {
            this._terminal.addEventListener("stdout", this._boundHandleStdout);
            this._terminal.addEventListener("stderr", this._boundHandleStderr);
            this._attached = true;
        }
    }

    /**
     * Unsubscribe from stdout/stderr events.
     * @returns {void}
     */
    public detach(): void {
        if (this._attached) {
            this._terminal.removeEventListener("stdout", this._boundHandleStdout);
            this._terminal.removeEventListener("stderr", this._boundHandleStderr);
            this._attached = false;
        }
    }

    /**
     * Clear the output element's contents.
     * @returns {void}
     */
    public clear(): void {
        this._element.innerHTML = "";
    }

    /**
     * Handle stdout events.
     * @param {Event} e - the stdout event
     */
    private handleStdout(e: Event): void {
        const customEvent = e as CustomEvent;
        this.appendOutput(customEvent.detail.data, TermOutput.STDOUT_CLASS);
    }

    /**
     * Handle stderr events.
     * @param {Event} e - the stderr event
     */
    private handleStderr(e: Event): void {
        const customEvent = e as CustomEvent;
        this.appendOutput(customEvent.detail.data, TermOutput.STDERR_CLASS);
    }

    /**
     * Append output to the element.
     * @param {any} data - the data to render
     * @param {string} className - the CSS class to apply
     */
    private appendOutput(data: any, className: string): void {
        const span = document.createElement("span");
        span.className = className;

        // Convert data to string
        if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
            span.textContent = String(data);
        } else {
            span.textContent = JSON.stringify(data);
        }

        this._element.appendChild(span);

        // Append a newline
        this._element.appendChild(document.createTextNode("\n"));
    }
}
