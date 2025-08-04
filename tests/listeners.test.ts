import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { Terminal, ExitObject } from '../src/input-terminal';
import { Command } from '../src/commands';

describe('TermListeners Tests', () => {
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
        expect(terminal.get_input_value()).toBe("test");
    });

    it('should handle next key', () => {
        terminal.history.push(new ExitObject(['test2'], undefined, 0, 'test'));
        terminal.history.push(new ExitObject(['test1'], undefined, 0, 'test'));
        terminal.history.previous();
        let event = new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' });
        input.dispatchEvent(event);
        expect(input.value).toBe(`${terminal.options.preprompt}${terminal.options.prompt}`);
        terminal.history.previous();
        terminal.history.previous();
        event = new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe("test1");
    });

    it('should handle return key', () => {
        terminal.update_input('test');
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe("");
    });

    it('should prevent backspace on prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Backspace' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe("test");
    });

    it('should prevent delete on prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Delete' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe("test");
    });

    it('should prevent arrow left on prompt', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        const event = new dom.window.KeyboardEvent('keydown', { key: 'ArrowLeft' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe("test");
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

    it('should handle selection change with start in prompt and null end', () => {
        terminal.update_input('test');
        input.selectionStart = 0;
        input.selectionEnd = null;
        const event = new dom.window.Event('selectionchange');
        input.dispatchEvent(event);
        expect(input.selectionStart).toBe((`${terminal.options.preprompt}${terminal.options.prompt}`).length);
    });

    it('should handle autocomplete key with single prediction', () => {
        terminal.bin.add(new Command('testcmd', (args, options, terminal) => {return true;}));
        terminal.update_input('test');
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('testcmd');
    });
    it('should handle autocomplete key with multiple predictions', () => {
        terminal.bin.add(new Command('test1', (args, options, terminal) => {return true;}));
        terminal.bin.add(new Command('test2', (args, options, terminal) => {return true;}));
        terminal.bin.add(new Command('test3', (args, options, terminal) => {return true;}));
        terminal.update_input('test');

        let event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('test1');

        event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('test2');

        event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('test3');

        event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('test1');
    });
    it('should handle autocomplete key with no predictions', () => {
        terminal.update_input('xyz');
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('xyz');
    });
    it('should handle autocomplete key with empty input', () => {
        terminal.update_input('');
        const event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe(terminal.bin.list[0]?.key || "");
    });
    it('should reset autocomplete predictions when typing other keys', () => {
        terminal.bin.add(new Command('test1', (args, options, terminal) => {return true;}));
        terminal.bin.add(new Command('test2', (args, options, terminal) => {return true;}));
        terminal.update_input('test');

        let event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('test1');

        terminal.update_input('test1a');
        event = new dom.window.KeyboardEvent('keydown', { key: 'a' });
        input.dispatchEvent(event);

        event = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
        input.dispatchEvent(event);
        expect(terminal.get_input_value()).toBe('test1a');
    });
});
