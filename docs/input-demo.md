---
title: Demo
---

<br>

# Terminal Demo

<div id="terminal-wrapper"><input id="termd" type="text"></div>

<div id="terminal-actions">
  <div id="action-slug">action slug</div>
  <div id="action-buttons">
    <button class="action-button left-end-button" id="autocomplete"><div class="button-icon-container"><svg  xmlns="http://www.w3.org/2000/svg"   width="100%" height="100%"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-bar-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 12l-10 0" /><path d="M20 12l-4 4" /><path d="M20 12l-4 -4" /><path d="M4 4l0 16" /></svg></div></button>
    <button class="action-button middle-button" id="previous"><div class="button-icon-container"><svg  xmlns="http://www.w3.org/2000/svg"   width="100%" height="100%"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 11l-6 -6" /><path d="M6 11l6 -6" /></svg></div></button>
    <button class="action-button middle-button" id="next"><div class="button-icon-container"><svg  xmlns="http://www.w3.org/2000/svg"   width="100%" height="100%"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 13l-6 6" /><path d="M6 13l6 6" /></svg></div></button>
    <button class="action-button right-end-button" id="return"><div class="button-icon-container"><svg  xmlns="http://www.w3.org/2000/svg"   width="100%" height="100%"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" /></svg></div></button>
  </div>
</div>
<pre id="output">Output prints here...</pre>

<br>

## Built-in Commands
- `echo`
- `man`
- `result`
- `return`
- `alert`

Type the above commands into the terminal to execute them. Their output will be displayed in the output section.

<br>

## Controls
Controls can be input with a keyboard, or using the buttons below the terminal interface.

Key | Action
-|-
<kbd>Tab</kbd> | Autocomplete
<kbd>ArrowUp</kbd> | Previous Command
<kbd>ArrowDown</kbd> | Next Command
<kbd>Enter</kbd> | Execute Command


<script src="../input-demo.js" type="module"></script>
