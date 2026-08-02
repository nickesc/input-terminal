import {createSubscriber} from "svelte/reactivity";
import type {OutputAdapter, OutputMetadata} from "../output-adapter.ts";

/**
 * A stdout or stderr entry in a Svelte output adapter.
 * @category Terminal Output
 */
export interface SvelteOutputEntry {
    readonly operation: "stdout" | "stderr";
    readonly data: unknown;
    readonly metadata: OutputMetadata;
}

/**
 * Stores visible terminal output in Svelte reactive state.
 * @category Terminal Output
 */
export class SvelteOutputAdapter implements OutputAdapter {
    private readonly _entries: SvelteOutputEntry[] = [];
    private _notify: () => void = () => {};
    private readonly _subscribe = createSubscriber((update) => {
        this._notify = update;

        return () => {
            this._notify = () => {};
        };
    });

    /**
     * The terminal output entries that are currently visible.
     */
    public get entries(): readonly SvelteOutputEntry[] {
        this._subscribe();
        return this._entries;
    }

    public stdout(data: unknown, metadata: OutputMetadata): void {
        this.append("stdout", data, metadata);
    }

    public stderr(data: unknown, metadata: OutputMetadata): void {
        this.append("stderr", data, metadata);
    }

    public clear(metadata: OutputMetadata): void {
        this._entries.length = 0;
        this._notify();
    }

    private append(
        operation: SvelteOutputEntry["operation"],
        data: unknown,
        metadata: OutputMetadata,
    ): void {
        const entry: SvelteOutputEntry = Object.freeze({operation, data, metadata});

        this._entries.push(entry);
        this._notify();
    }
}
