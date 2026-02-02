import {TermOptions} from "../src/input-terminal";
import {describe, it, expect} from "vitest";

describe("TermOptions Construction Tests", () => {
    const customOptions = {
        previousKey: "Up",
        nextKey: "Down",
        returnKey: "Return",
        autocompleteKey: "Tabulator",
        prompt: "prompt",
        preprompt: "preprompt",
        installBuiltins: false,
        addEmptyCommandToHistory: true,
        showDuplicateCommands: true,
    };

    it("should construct a TermOptions object", () => {
        const options: TermOptions = new TermOptions();
        expect(options).toBeInstanceOf(TermOptions);
    });

    it("should construct with default options", () => {
        const options: TermOptions = new TermOptions();
        expect(options.previousKey).toEqual("ArrowUp");
        expect(options.nextKey).toEqual("ArrowDown");
        expect(options.returnKey).toEqual("Enter");
        expect(options.autocompleteKey).toEqual("Tab");
        expect(options.preprompt).toEqual("");
        expect(options.prompt).toEqual("> ");
        expect(options.installBuiltins).toEqual(true);
        expect(options.addEmptyCommandToHistory).toEqual(false);
        expect(options.showDuplicateCommands).toEqual(false);
    });

    it("should construct with custom options", () => {
        const options: TermOptions = new TermOptions(customOptions);
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.returnKey).toEqual(customOptions.returnKey);
        expect(options.autocompleteKey).toEqual(customOptions.autocompleteKey);
        expect(options.preprompt).toEqual(customOptions.preprompt);
        expect(options.prompt).toEqual(customOptions.prompt);
        expect(options.installBuiltins).toEqual(customOptions.installBuiltins);
        expect(options.addEmptyCommandToHistory).toEqual(customOptions.addEmptyCommandToHistory);
        expect(options.showDuplicateCommands).toEqual(customOptions.showDuplicateCommands);
    });

    it("should construct with partial custom options", () => {
        const customOptions = {
            previousKey: "PageUp",
            nextKey: "PageDown",
        };
        const options: TermOptions = new TermOptions(customOptions);
        expect(options.previousKey).toEqual(customOptions.previousKey);
        expect(options.nextKey).toEqual(customOptions.nextKey);
        expect(options.returnKey).toEqual("Enter");
    });
});

describe("Setting custom options", () => {
    it("should set custom options", () => {
        const options: TermOptions = new TermOptions();
        options.previousKey = "Up";
        options.nextKey = "Down";
        options.returnKey = "Return";
        options.autocompleteKey = "Tabulator";
        options.preprompt = "preprompt";
        options.prompt = "prompt";
        options.installBuiltins = false;
        options.addEmptyCommandToHistory = true;
        options.showDuplicateCommands = true;
        expect(options.previousKey).toEqual("Up");
        expect(options.nextKey).toEqual("Down");
        expect(options.returnKey).toEqual("Return");
        expect(options.autocompleteKey).toEqual("Tabulator");
        expect(options.preprompt).toEqual("preprompt");
        expect(options.prompt).toEqual("prompt");
        expect(options.installBuiltins).toEqual(false);
        expect(options.addEmptyCommandToHistory).toEqual(true);
        expect(options.showDuplicateCommands).toEqual(true);
    });
});
