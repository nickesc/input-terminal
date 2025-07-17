import { Terminal, Command } from '../input-terminal';
import { describe, it, expect, beforeEach } from 'vitest';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('input-terminal', () => {
    it('should construct', () => {
        const app = new input-terminal();
        expect(app).toBe(app);
    });
});
