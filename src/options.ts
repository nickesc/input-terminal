export class TermOptions {
    public previousKey: string = "ArrowUp";
    public nextKey: string = "ArrowDown";
    public enterKey: string = "Enter";
    public tabKey: string = "Tab";

    constructor(options?: object) {
        Object.assign(this, options);
    }

}
