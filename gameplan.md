# input-terminal

## GOALS
- [ ] Finish implementation
  - [ ] Finish adding features, tweaking architecture, fixing big bugs; get it stable and stop messing with the api
- [ ] Finish writing tests
  - [x] 100% test coverage
  - [ ] test coverage for all features
- [ ] Accurate (ish) terminal simulation
  - [ ] Make the terminal as close as possible to a real terminal
- [ ] Performance optimization
  - [ ] Look for ways to optimize, test for large command sets
- [ ] Accessibility
  - [ ] Screen reader support? Other concerns?
- [ ] Publish
  - [ ] publish to npm registry

## TASKS

### Tweaks
- [x] change lastexitcode to lastexitobject
- [x] change all snake_case to camelCase (except built_ins)
- [x] we will not swap event to callback
  - [x] look into benefits/drawbacks of events vs callback
- [x] not converting ts private vs js private
  - [x] convert # event to ts private
  - [x] look into differences, benefits other than compatibility
- [x] add validation that -v options only have one char (return an error saying "expected -test to only have one character")
- [x] change exitobject output type to any, correct all references in code

### Features:
- [x] add raw input property in exit object, use it for history nav
- [x] add option to add commands and history as a list or as individual commands
- [x] prevent empty command from being added to history with option
- [x] prevent duplicate command from being added to commands with option
- [x] add man pages for commands (define in class and add in builtins)
- [ ] add export and import terminal config (command list, history list, options (filesystem if added)) (stringify the object, parse to classes on the other side)
- [ ] add list commands builtin
- [ ] add history builtin
- [ ] add TermVariables object that stores variables in a dict like options but persistent across commands
- [ ] Show prediction in real-time as user types
- [ ] Add required option support

### Fixes
- [x] allow deletion of user input when selection starts at first char of user input
- [x] fix man page on undefined command
- [ ] look for a way to make sure that the enter key has been released before executing another command
- [ ] Add option validation and type checking

### Testing
- [x] add testing for adding command and history as a list
- [x] add listener access tests now that they are public
- [x] add builtin and command history nav option tests
- [x] add individual listener tests
  - [x] previous
  - [x] next
  - [x] autocomplete
  - [x] return
- [x] add builtin tests
- [x] removed modkey option -- never used
- [x] add tests for operation with different option settings
  - [x] for custom defined keys
  - [x] for different prompts with different lengths
  - [x] for terminal with installed builtins or not
  - [x] for whether command history should include empty commands
  - [x] for whether command history nav should show duplicate commands
- [x] separate grouped tests (at "//PREDICTION TESTS", etc. headings)
- [x] add manual tests

### Big changes
- [x] look into return values for classes to prevent access to private vars, but cannot use closures for classes, so not helpful (https://dev.to/bhagatparwinder/classes-in-js-public-private-and-protected-1lok#private)
  - [x] return history and command lists as value instead of accessing them with the list and items properties
- [ ] add ability to use a textarea or an input
- [ ] add a filesystem emulation through a json object
  - [ ] make optional and off by default, probably not useful for anything other than a demo
  - [ ] add commands for interaction with filesystem
    - [ ] touch
    - [ ] mkdir
    - [ ] ls
    - [ ] cd
    - [ ] mv
    - [ ] cp
    - [ ] rm
  - [ ] filesystem only supports certain file types -- number string boolean
  - [ ] allow exporting filesystem to json string
- [ ] Add terminal functions that cause events with attached data for stdout and errout, that the developer can hook into.
  - [ ] prevents having to build a new return/exitobject structure
  - [ ] lets us do realtime output instead of all output returned at the end of the function
  - [ ] also give option to use browser as the output area
  - [ ] add output class that can be attached to an element and hooks into the events automatically
    - [ ] document how to use the default output or how to build your own
- [ ] add callback for command class on execution?

### Docs
- [x] add buttons for interaction on touch
- [ ] README:
  - [ ] expand about section
  - [ ] expand basic usage section
  - [ ] expand basic usage/examples section
  - [ ] add comprehensive feature list
- [ ] Docs:
  - [ ] Create API reference guide
  - [ ] Add examples for all major features
  - [ ] document terminal lifecycle
  - [ ] document settings
  - [ ] document builtins
  - [ ] document event listener for command execution
  - [ ] document autocomplete behavior
  - [ ] Showcase all library features in demo
  - [ ] document command structure
    - [ ] how args are passed
    - [ ] how options are passed (-, --)
    - [ ] how strings are passed ("", '', ``)
    - [ ] how vars are passed ($)
- [ ] document command structure

### Dist
- [ ] publish to npm
  - [ ] finish package config
    - [ ] Add proper entry points and exports
  - [ ] Test package locally
- [ ] CI/CD
  - [x] automate testing on push
  - [ ] automate publishing
  - [ ] automate changelog
  - [ ] automate github release

