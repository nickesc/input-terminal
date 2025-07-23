export class TermOptions {
    public previousKey: string = "ArrowUp";
    public nextKey: string = "ArrowDown";
    public returnKey: string = "Enter";
    public tabKey: string = "Tab";
    public modKey: string = "Ctrl";
    public startFocused: boolean = false;
    public prompt: string = "> ";
    public preprompt: string = "";

    constructor(options?: object) {
        Object.assign(this, options);
    }
}
