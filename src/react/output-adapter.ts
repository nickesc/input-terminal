import type {OutputAdapter, OutputMetadata} from "../output-adapter.ts";

/**
 * A command, stdout, or stderr entry in a React output adapter.
 * @category Terminal Output
 */
export interface ReactOutputEntry {
    readonly operation: "command" | "stdout" | "stderr";
    readonly data: unknown;
    readonly metadata: OutputMetadata;
}

type Listener = () => void;

/**
 * Stores visible terminal output in a React-compatible external store.
 * @category Terminal Output
 */
export class ReactOutputAdapter implements OutputAdapter {
    private _entries: readonly ReactOutputEntry[] = Object.freeze([]);
    private readonly listeners = new Set<Listener>();

    /**
     * Returns the current immutable output snapshot.
     */
    public readonly getSnapshot = (): readonly ReactOutputEntry[] => this._entries;

    /**
     * Subscribes to output snapshot changes.
     */
    public readonly subscribe = (listener: Listener): (() => void) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    public command(data: string, metadata: OutputMetadata): void {
        this.append("command", data, metadata);
    }

    public stdout(data: unknown, metadata: OutputMetadata): void {
        this.append("stdout", data, metadata);
    }

    public stderr(data: unknown, metadata: OutputMetadata): void {
        this.append("stderr", data, metadata);
    }

    public clear(metadata: OutputMetadata): void {
        this._entries = Object.freeze([]);
        this.notify();
    }

    private append(
        operation: ReactOutputEntry["operation"],
        data: unknown,
        metadata: OutputMetadata,
    ): void {
        const entry: ReactOutputEntry = Object.freeze({operation, data, metadata});

        this._entries = Object.freeze([...this._entries, entry]);
        this.notify();
    }

    private notify(): void {
        this.listeners.forEach((listener) => listener());
    }
}
