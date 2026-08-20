import {useSyncExternalStore} from "react";
import type {ReactOutputAdapter, ReactOutputEntry} from "./output-adapter.ts";

/**
 * Subscribes a React component to the visible entries in an output adapter.
 * @category Terminal Output
 */
export function useTerminalOutput(
    output: ReactOutputAdapter,
): readonly ReactOutputEntry[] {
    return useSyncExternalStore(
        output.subscribe,
        output.getSnapshot,
        output.getSnapshot,
    );
}
