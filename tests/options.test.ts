import { TermOptions } from '../src/input-terminal';
import { describe, it, expect } from 'vitest';

function isOptions(target: any): boolean {
    return target instanceof TermOptions;
}

describe('TermOptions Tests', () => {

    // CONSTRUCTION TEST
    it('should construct a TermOptions object',  () => {
        const options: TermOptions = new TermOptions();
        expect(isOptions(options)).toBe(true);
    });

    it('should construct with default options', () => {
        const options: TermOptions = new TermOptions();
        expect(options.previousKey).toEqual("ArrowUp");
        expect(options.nextKey).toEqual("ArrowDown");
        expect(options.returnKey).toEqual("Enter");
        expect(options.autocompleteKey).toEqual("Tab");
        expect(options.modKey).toEqual("Ctrl");
        expect(options.preprompt).toEqual("");
        expect(options.prompt).toEqual("> ");

    });

    it('should construct with custom options', () => {
        const customOptions = {
            previousKey: "Up",
            nextKey: "Down",
            returnKey: "Return",
            autocompleteKey: "Tabulator",
            modKey: "Ctrl",
            prompt: "prompt",
            preprompt: "preprompt"
        };
        const options: TermOptions = new TermOptions(customOptions);
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.returnKey).toEqual(customOptions.returnKey);
        expect(options.autocompleteKey).toEqual(customOptions.autocompleteKey);
        expect(options.modKey).toEqual(customOptions.modKey);
        expect(options.preprompt).toEqual("preprompt");
        expect(options.prompt).toEqual("prompt");
    });

    it('should construct with partial custom options', () => {
        const customOptions = {
            previousKey: "PageUp",
            nextKey: "PageDown"
        };
        const options: TermOptions = new TermOptions(customOptions);
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.returnKey).toEqual("Enter"); // Default
        expect(options.autocompleteKey).toEqual("Tab"); // Default
    });

});
