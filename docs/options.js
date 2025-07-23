export class TermOptions {
    constructor(options) {
        this.previousKey = "ArrowUp";
        this.nextKey = "ArrowDown";
        this.returnKey = "Enter";
        this.tabKey = "Tab";
        this.modKey = "Ctrl";
        this.startFocused = false;
        this.prompt = "> ";
        this.preprompt = "";
        Object.assign(this, options);
    }
}
