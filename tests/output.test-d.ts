import {expectTypeOf, test} from "vitest";
import {ExitObject, Terminal} from "../src/input-terminal.ts";

declare const terminal: Terminal;
declare const exitObject: ExitObject;

test("types output values and logs as unknown", () => {
    expectTypeOf<Parameters<Terminal["stdout"]>[0]>().toEqualTypeOf<unknown>();
    expectTypeOf<Parameters<Terminal["stderr"]>[0]>().toEqualTypeOf<unknown>();
    expectTypeOf(terminal.getStdoutLog()).toEqualTypeOf<unknown[]>();
    expectTypeOf(terminal.getStderrLog()).toEqualTypeOf<unknown[]>();
    expectTypeOf(exitObject.stdoutLog).toEqualTypeOf<unknown[]>();
    expectTypeOf(exitObject.stderrLog).toEqualTypeOf<unknown[]>();
});
