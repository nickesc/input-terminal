/**
 * Manages the terminal's configuration.
 */
export class TermOptions {
    public previousKey: string = "ArrowUp";
    public nextKey: string = "ArrowDown";
    public returnKey: string = "Enter";
    public autocompleteKey: string = "Tab";
    public modKey: string = "Ctrl";
    public startFocused: boolean = false;
    public prompt: string = "> ";
    public preprompt: string = "";

    /**
     * @param {object} [options] - an optional configuration to initialize the terminal with
     */
    constructor(options?: object) {
        Object.assign(this, options);
    }
}
