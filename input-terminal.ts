/**
 * @fileoverview description
 *
 * @module input-terminal
 */

interface TermCallback { (object: object): any }

export class Command {
    public user_input: string[];

    constructor(user_input: string[]) {
        this.user_input = user_input;
    }
}

/**
 * @class
 */
export class Terminal {

    /**
     * @constructor
     */
    constructor() {

    }

    private _main(): void{
        return;
    }
}
