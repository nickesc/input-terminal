/**
 * Metadata assigned to a terminal output operation.
 * @category Terminal Output
 */
export interface OutputMetadata {
    readonly sequence: number;
    readonly timestamp: number;
}

/**
 * Renders or records terminal output.
 * @category Terminal Output
 */
export interface OutputAdapter {
    stdout(data: unknown, metadata: OutputMetadata): void;
    stderr(data: unknown, metadata: OutputMetadata): void;
    clear(metadata: OutputMetadata): void;
}

/**
 * The detail emitted with stdout and stderr events.
 * @category Terminal Output
 */
export interface OutputEventDetail {
    readonly metadata: OutputMetadata;
    readonly data: unknown;
}

/**
 * The detail emitted with clear events.
 * @category Terminal Output
 */
export interface ClearEventDetail {
    readonly metadata: OutputMetadata;
}

/**
 * The detail emitted when an output adapter throws.
 * @category Terminal Output
 */
export type OutputErrorDetail =
    | {
          readonly metadata: OutputMetadata;
          readonly operation: "stdout" | "stderr";
          readonly data: unknown;
          readonly error: unknown;
      }
    | {
          readonly metadata: OutputMetadata;
          readonly operation: "clear";
          readonly error: unknown;
      };
