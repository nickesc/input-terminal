import {expectTypeOf, test} from "vitest";
import {ExitObject, Terminal} from "../src/input-terminal.ts";
import type {OutputAdapter, OutputMetadata} from "../src/input-terminal.ts";

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

test("requires custom adapters to implement string command output", () => {
    expectTypeOf<Parameters<OutputAdapter["command"]>[0]>().toEqualTypeOf<string>();

    // @ts-expect-error Output adapters must implement command output.
    const adapter: OutputAdapter = {
        stdout(data: unknown, metadata: OutputMetadata) {},
        stderr(data: unknown, metadata: OutputMetadata) {},
        clear(metadata: OutputMetadata) {},
    };
    void adapter;
});
