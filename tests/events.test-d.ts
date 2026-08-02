import {expectTypeOf, test} from "vitest";
import {ExitObject, Terminal} from "../src/input-terminal.ts";
import type {ClearEventDetail, OutputErrorDetail, OutputEventDetail} from "../src/input-terminal.ts";

declare const terminal: Terminal;

test("infers stdout event details", () => {
    terminal.addEventListener("stdout", (event) => {
        expectTypeOf(event).toEqualTypeOf<CustomEvent<OutputEventDetail>>();
        expectTypeOf(event.detail).toEqualTypeOf<OutputEventDetail>();
    });
});

test("infers stderr event details", () => {
    terminal.addEventListener("stderr", (event) => {
        expectTypeOf(event).toEqualTypeOf<CustomEvent<OutputEventDetail>>();
        expectTypeOf(event.detail).toEqualTypeOf<OutputEventDetail>();
    });
});

test("infers clear event details", () => {
    terminal.addEventListener("clear", (event) => {
        expectTypeOf(event).toEqualTypeOf<CustomEvent<ClearEventDetail>>();
        expectTypeOf(event.detail).toEqualTypeOf<ClearEventDetail>();
    });
});

test("infers executed event details", () => {
    terminal.addEventListener("executed", (event) => {
        expectTypeOf(event).toEqualTypeOf<CustomEvent<ExitObject>>();
        expectTypeOf(event.detail).toEqualTypeOf<ExitObject>();
    });
});

test("infers and narrows outputerror event details", () => {
    terminal.addEventListener("outputerror", (event) => {
        expectTypeOf(event).toEqualTypeOf<CustomEvent<OutputErrorDetail>>();
        expectTypeOf(event.detail).toEqualTypeOf<OutputErrorDetail>();

        if (event.detail.operation === "clear") {
            expectTypeOf(event.detail.operation).toEqualTypeOf<"clear">();
            // @ts-expect-error Clear adapter failures do not include output data.
            event.detail.data;
        } else {
            expectTypeOf(event.detail.operation).toEqualTypeOf<"stdout" | "stderr">();
            expectTypeOf(event.detail.data).toEqualTypeOf<unknown>();
        }
    });
});

test("keeps broad listener signatures for unknown events", () => {
    terminal.addEventListener("custom", (event) => {
        expectTypeOf(event).toEqualTypeOf<Event>();
    });
});

test("accepts matching typed listeners when removing events", () => {
    const outputListener = (event: CustomEvent<OutputEventDetail>) => void event;
    const clearListener = (event: CustomEvent<ClearEventDetail>) => void event;
    const outputErrorListener = (event: CustomEvent<OutputErrorDetail>) => void event;
    const executedListener = (event: CustomEvent<ExitObject>) => void event;
    const customListener: EventListener = (event) => void event;

    terminal.removeEventListener("stdout", outputListener);
    terminal.removeEventListener("stderr", outputListener);
    terminal.removeEventListener("clear", clearListener);
    terminal.removeEventListener("outputerror", outputErrorListener);
    terminal.removeEventListener("executed", executedListener);
    terminal.removeEventListener("custom", customListener);
});
