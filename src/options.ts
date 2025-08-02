/**
 * Manages the terminal's configuration.
 * @param {object} [options] - an optional configuration to initialize the terminal with
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

    constructor(options?: object) {
        Object.assign(this, options);
    }
}
