export class TermOptions {
    public previousKey: string = "ArrowUp";
    public nextKey: string = "ArrowDown";
    public enterKey: string = "Enter";
    public tabKey: string = "Tab";
    public modKey: string = "Ctrl";
    public startFocused: boolean = false;

    constructor(options?: object) {
        Object.assign(this, options);
    }
}
