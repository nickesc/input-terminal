---
title: Demo
---

<br>

# Terminal Demo

<div id="terminal-wrapper"><input id="termd" type="text"></div>

<div id="terminal-actions">
  <div id="action-slug">action slug</div>
  <div id="action-buttons">
    <button class="action-button left-end-button" id="autocomplete" title="Autocomplete"><div class="button-icon-container"><svg id="icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32" width="100%" height="100%" fill="currentColor"><defs><style>.st0 {fill: none;}</style></defs><rect x="4" y="6.2" width="2" height="19.7" transform="translate(10 32) rotate(-180)"/>   <polygon points="22 22 28 16 22 10 20.6 11.4 24.2 15 10 15 10 17 24.2 17 20.6 20.6 22 22"/><rect id="_Transparent_Rectangle_" class="st0" width="32" height="32" transform="translate(32 32) rotate(-180)"/> </svg></div></button>
    <button class="action-button middle-button" id="previous" title="Previous command"><div class="button-icon-container"><svg version="1.1"  class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" fill="currentColor"> <style type="text/css"> .st0{fill:none;} </style> <polygon points="16,10 26,20 24.6,21.4 16,12.8 7.4,21.4 6,20 "/> <rect id="_x3C_Transparent_Rectangle_x3E_" class="st0" width="32" height="32"/> </svg></div></button>
    <button class="action-button middle-button" id="next" title="Next command"><div class="button-icon-container"><svg version="1.1"  class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" fill="currentColor"> <style type="text/css"> .st0{fill:none;} </style> <polygon points="16,22 6,12 7.4,10.6 16,19.2 24.6,10.6 26,12 "/> <rect id="_x3C_Transparent_Rectangle_x3E_" class="st0" width="32" height="32"/> </svg></div></button>
    <button class="action-button right-end-button" id="return" title="Execute Command"><div class="button-icon-container"><svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32" width="100%" height="100%" fill="currentColor"><defs><style>.st0 {fill: none;}</style></defs><path d="M10,13l-6,6,6,6,1.4-1.4-3.6-3.6h18.2c1.1,0,2-.9,2-2v-10s-2,0-2,0v10H7.8s3.6-3.6,3.6-3.6l-1.4-1.4Z"/><rect id="_Transparent_Rectangle_" class="st0" width="32" height="32" transform="translate(32 32) rotate(-180)"/> </svg></div></button>
  </div>
</div>

<div id="output-container">
  <pre id="output"></pre>
  <div id="output-bar">
    <div id="output-title">OUTPUT</div>
    <div id="output-status">
      <div id="output-command">———</div>
      <div id="output-code">█</div>
    </div>
  </div>
</div>

<br>

## About

### Commands

#### Built-in Commands

- `alert`
- `clear`
- `commands`
- `echo`
- `history`
- `man`
- `result`
- `return`

#### Custom Commands

- `theme`

Type the above commands into the terminal to execute them. Their output will be displayed in the output section.

<br>

### Controls

Controls can be input with a keyboard, or using the buttons below the terminal interface.

Key | Action
-|-
<kbd>Tab</kbd> | Autocomplete
<kbd>ArrowUp</kbd> | Previous Command
<kbd>ArrowDown</kbd> | Next Command
<kbd>Enter</kbd> | Execute Command


<script src="../input-demo.js" type="module"></script>
