import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { Terminal, ExitObject } from '../src/input-terminal';

describe('TermListeners', () => {
    let terminal: Terminal;
    let input: HTMLInputElement;
    let dom: JSDOM;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><input type="text" id="terminal-input"></body></html>');
        global.document = dom.window.document;
        input = document.getElementById('terminal-input') as HTMLInputElement;
        terminal = new Terminal(input);
        terminal.init();
    });

    it('should handle previous key', () => {
        terminal.history.push(new ExitObject(['test'], undefined, 0, 'test'));
        const event = new dom.window.KeyboardEvent('keydown', { key: 'ArrowUp' });
        input.dispatchEvent(event);
        expect(input.value).toBe(`${terminal.options.preprompt}${terminal.options.prompt}test`);
    });

    it('should handle next key', () => {
        terminal.history.push(new ExitObject(['test'], undefined, 0, 'test'));
        terminal.history.previous();
        const event = new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' });
        input.dispatchEvent(event);
        expect(input.value).toBe(`${terminal.options.preprompt}${terminal.options.prompt}`);
    });

    it('should handle return key', () => {
        terminal.update_input('test');
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
        input.dispatchEvent(event);
        expect(input.value).toBe(`${terminal.options.preprompt}${terminal.options.prompt}`);
    });

    it('should prevent backspace on prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Backspace' });
        input.dispatchEvent(event);
        expect(input.value).toBe(`${terminal.options.preprompt}${terminal.options.prompt}test`);
    });

    it('should prevent delete on prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Delete' });
        input.dispatchEvent(event);
        expect(input.value).toBe(`${terminal.options.preprompt}${terminal.options.prompt}test`);
    });

    it('should prevent arrow left on prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        const event = new dom.window.KeyboardEvent('keydown', { key: 'ArrowLeft' });
        input.dispatchEvent(event);
        expect(input.value).toBe(`${terminal.options.preprompt}${terminal.options.prompt}test`);
    });

    it('should handle selection change', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        input.selectionEnd = 0;
        const event = new dom.window.Event('selectionchange');
        input.dispatchEvent(event);
        expect(input.selectionStart).toBe((`${terminal.options.preprompt}${terminal.options.prompt}`).length);
        expect(input.selectionEnd).toBe((`${terminal.options.preprompt}${terminal.options.prompt}`).length);
    });

    it('should handle selection change with end in prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        input.selectionEnd = 1;
        const event = new dom.window.Event('selectionchange');
        input.dispatchEvent(event);
        expect(input.selectionStart).toBe((`${terminal.options.preprompt}${terminal.options.prompt}`).length);
        expect(input.selectionEnd).toBe((`${terminal.options.preprompt}${terminal.options.prompt}`).length);
    });

    it('should handle selection change with start in prompt and end after prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        input.selectionEnd = 5;
        const event = new dom.window.Event('selectionchange');
        input.dispatchEvent(event);
        expect(input.selectionStart).toBe((`${terminal.options.preprompt}${terminal.options.prompt}`).length);
        expect(input.selectionEnd).toBe(5);
    });
});
