import { Terminal } from "./input-terminal.ts";
/**
 * Manages the terminal's output rendering.
 * Automatically subscribes to stdout/stderr events and renders them to a DOM element.
 * @category Terminal Components
 */
export declare class TermOutput {
    private _element;
    private _terminal;
    private _attached;
    private static readonly STDOUT_CLASS;
    private static readonly STDERR_CLASS;
    private _boundHandleStdout;
    private _boundHandleStderr;
    /**
     * Get the element that output is rendered to.
     * @type {HTMLElement}
     */
    get element(): HTMLElement;
    /**
     * Get whether the output is attached to the terminal.
     * @type {boolean}
     */
    get attached(): boolean;
    /**
     * @param {HTMLElement} element - the element to render output to
     * @param {Terminal} terminal - the terminal to subscribe to
     */
    constructor(element: HTMLElement, terminal: Terminal);
    /**
     * Subscribe to stdout/stderr events from the terminal.
     * @returns {void}
     */
    attach(): void;
    /**
     * Unsubscribe from stdout/stderr events.
     * @returns {void}
     */
    detach(): void;
    /**
     * Clear the output element's contents.
     * @returns {void}
     */
    clear(): void;
    /**
     * Handle stdout events.
     * @param {Event} e - the stdout event
     */
    private handleStdout;
    /**
     * Handle stderr events.
     * @param {Event} e - the stderr event
     */
    private handleStderr;
    /**
     * Append output to the element.
     * @param {any} data - the data to render
     * @param {string} className - the CSS class to apply
     */
    private appendOutput;
}
