<a name="module_input-terminal"></a>

## input-terminal
Allows you to turn any `HTMLInputElement` into a terminal interface. Define custom commands that can be executed by users, track command history, autocomplete commands, and more.


* [input-terminal](#module_input-terminal)
    * [.Terminal](#module_input-terminal.Terminal)
        * [new exports.Terminal(input, options, commandHistory, commandList)](#new_module_input-terminal.Terminal_new)
        * [.init()](#module_input-terminal.Terminal+init) ⇒ <code>void</code>
        * [.update_input([user_input])](#module_input-terminal.Terminal+update_input) ⇒ <code>void</code>
        * [.get_input_value()](#module_input-terminal.Terminal+get_input_value) ⇒ <code>string</code>
        * [.get_predictions([text])](#module_input-terminal.Terminal+get_predictions) ⇒ <code>Array.&lt;string&gt;</code>
        * [.get_input_array(input)](#module_input-terminal.Terminal+get_input_array) ⇒ <code>Array.&lt;string&gt;</code>
        * [.execute_command(input)](#module_input-terminal.Terminal+execute_command) ⇒ <code>ExitObject</code>

<a name="module_input-terminal.Terminal"></a>

### input-terminal.Terminal
Allows you to turn any `HTMLInputElement` into a terminal interface. Define custom commands that can be executed by users, track command history, autocomplete commands, and more.

**Kind**: static class of [<code>input-terminal</code>](#module_input-terminal)  

* [.Terminal](#module_input-terminal.Terminal)
    * [new exports.Terminal(input, options, commandHistory, commandList)](#new_module_input-terminal.Terminal_new)
    * [.init()](#module_input-terminal.Terminal+init) ⇒ <code>void</code>
    * [.update_input([user_input])](#module_input-terminal.Terminal+update_input) ⇒ <code>void</code>
    * [.get_input_value()](#module_input-terminal.Terminal+get_input_value) ⇒ <code>string</code>
    * [.get_predictions([text])](#module_input-terminal.Terminal+get_predictions) ⇒ <code>Array.&lt;string&gt;</code>
    * [.get_input_array(input)](#module_input-terminal.Terminal+get_input_array) ⇒ <code>Array.&lt;string&gt;</code>
    * [.execute_command(input)](#module_input-terminal.Terminal+execute_command) ⇒ <code>ExitObject</code>

<a name="new_module_input-terminal.Terminal_new"></a>

#### new exports.Terminal(input, options, commandHistory, commandList)

| Param | Type | Description |
| --- | --- | --- |
| input | <code>HTMLInputElement</code> | input element to turn into a terminal |
| options | <code>object</code> | terminal configuration |
| commandHistory | <code>Array.&lt;ExitObject&gt;</code> | history of commands that have been executed |
| commandList | <code>Array.&lt;Command&gt;</code> | list of commands that can be executed by the user |

**Example**  
```typescript
import { Terminal, Command } from "input-terminal";
const input = document.getElementById("terminal") as HTMLInputElement;
const terminal = new Terminal(input, { prompt: ">> " });
terminal.commands.add(new Command("echo", (args, options, terminal) => {
    console.log(args);
    return {};
}));
terminal.init();
```
<a name="module_input-terminal.Terminal+init"></a>

#### terminal.init() ⇒ <code>void</code>
Initializes the terminal. Attaches input listeners and updates the input.

**Kind**: instance method of [<code>Terminal</code>](#module_input-terminal.Terminal)  
<a name="module_input-terminal.Terminal+update_input"></a>

#### terminal.update\_input([user_input]) ⇒ <code>void</code>
Updates the terminal's user input value.

**Kind**: instance method of [<code>Terminal</code>](#module_input-terminal.Terminal)  

| Param | Type | Description |
| --- | --- | --- |
| [user_input] | <code>string</code> | the value to update the input with; clears the input if no value is provided |

<a name="module_input-terminal.Terminal+get_input_value"></a>

#### terminal.get\_input\_value() ⇒ <code>string</code>
Gets the terminal's user input.

**Kind**: instance method of [<code>Terminal</code>](#module_input-terminal.Terminal)  
**Returns**: <code>string</code> - The string in the input, not including the preprompt and prompt  
<a name="module_input-terminal.Terminal+get_predictions"></a>

#### terminal.get\_predictions([text]) ⇒ <code>Array.&lt;string&gt;</code>
Gets the command predictions based on the user's input.

**Kind**: instance method of [<code>Terminal</code>](#module_input-terminal.Terminal)  
**Returns**: <code>Array.&lt;string&gt;</code> - The predictions for the terminal's user input  

| Param | Type | Description |
| --- | --- | --- |
| [text] | <code>string</code> | The text to get predictions for; if no text is provided, all commands are returned |

<a name="module_input-terminal.Terminal+get_input_array"></a>

#### terminal.get\_input\_array(input) ⇒ <code>Array.&lt;string&gt;</code>
Converts the user's input into an array for command execution.

**Kind**: instance method of [<code>Terminal</code>](#module_input-terminal.Terminal)  
**Returns**: <code>Array.&lt;string&gt;</code> - The array created from the input  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | The string to convert into an array |

<a name="module_input-terminal.Terminal+execute_command"></a>

#### terminal.execute\_command(input) ⇒ <code>ExitObject</code>
Executes a command based on the user's input.

**Kind**: instance method of [<code>Terminal</code>](#module_input-terminal.Terminal)  
**Returns**: <code>ExitObject</code> - The ExitObject returned by the execution  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | The command to execute |

