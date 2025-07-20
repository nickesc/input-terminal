import { TermOptions } from '../src/options';
import { describe, it, expect } from 'vitest';

function isOptions(target: any): boolean {
  return target instanceof TermOptions;
}

describe('input-terminal-options', () => {

    // CONSTRUCTION TEST
    it('should construct a TermOptions object',  () => {
        const options: TermOptions = new TermOptions();
        expect(isOptions(options)).toBe(true);
    });

    it('should construct with default options', () => {
        const options: TermOptions = new TermOptions();
        expect(options.previousKey).toEqual("ArrowUp");
        expect(options.nextKey).toEqual("ArrowDown");
        expect(options.enterKey).toEqual("Enter");
        expect(options.tabKey).toEqual("Tab");
        expect(options.modKey).toEqual("Ctrl");
    });

    it('should construct with custom options', () => {
        const customOptions = {
            previousKey: "Up",
            nextKey: "Down",
            enterKey: "Return",
            tabKey: "Tabulator",
            modKey: "Ctrl"
        };
        const options: TermOptions = new TermOptions(customOptions);
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.enterKey).toEqual(customOptions.enterKey);
        expect(options.tabKey).toEqual(customOptions.tabKey);
        expect(options.modKey).toEqual(customOptions.modKey);
    });

    it('should construct with partial custom options', () => {
        const customOptions = {
            previousKey: "PageUp",
            nextKey: "PageDown"
        };
        const options: TermOptions = new TermOptions(customOptions);
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.enterKey).toEqual("Enter"); // Default
        expect(options.tabKey).toEqual("Tab"); // Default
    });

});
