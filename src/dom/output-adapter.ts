import type {OutputAdapter, OutputMetadata} from "../output-adapter.ts";

/**
 * Renders terminal output to a DOM element.
 * @category Terminal Output
 */
export class DOMOutputAdapter implements OutputAdapter {
    private static readonly COMMAND_CLASS = "input-terminal-command";
    private static readonly STDOUT_CLASS = "input-terminal-stdout";
    private static readonly STDERR_CLASS = "input-terminal-stderr";
    private readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    public command(data: string, metadata: OutputMetadata): void {
        this.append(data, DOMOutputAdapter.COMMAND_CLASS, metadata);
    }

    public stdout(data: unknown, metadata: OutputMetadata): void {
        this.append(data, DOMOutputAdapter.STDOUT_CLASS, metadata);
    }

    public stderr(data: unknown, metadata: OutputMetadata): void {
        this.append(data, DOMOutputAdapter.STDERR_CLASS, metadata);
    }

    public clear(metadata: OutputMetadata): void {
        this.element.replaceChildren();
    }

    private append(data: unknown, className: string, metadata: OutputMetadata): void {
        const span = document.createElement("span");
        span.className = className;
        span.dataset.sequence = String(metadata.sequence);
        span.dataset.timestamp = String(metadata.timestamp);
        span.textContent = this.format(data);

        this.element.append(span, "\n");
    }

    private format(data: unknown): string {
        if (
            typeof data === "string" ||
            typeof data === "number" ||
            typeof data === "boolean" ||
            typeof data === "bigint"
        ) {
            return String(data);
        }

        if (data === null || data === undefined) {
            return String(data);
        }

        try {
            return JSON.stringify(data) ?? String(data);
        } catch {
            return String(data);
        }
    }
}
