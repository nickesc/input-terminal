<h3 align="center" >
  <div>
    <a href="https://github.com/nickesc/input-terminal"><img alt="Source: Github" src="https://img.shields.io/badge/source-github-brightgreen?style=for-the-badge&logo=github&labelColor=%23505050"></a>
    <a href="https://github.com/nickesc/input-terminal/actions/workflows/ts-tests.yml"><img alt="Tests: github.com/nickesc/input-terminal/actions/workflows/ts-tests.yml" src="https://img.shields.io/github/actions/workflow/status/nickesc/input-terminal/ts-tests.yml?logo=github&label=tests&logoColor=white&style=for-the-badge&labelColor=%23505050"></a>
    <br>
    <a href="https://www.npmjs.com/package/input-terminal"><img alt="NPM: npmjs.com/package/input-terminal" src="https://img.shields.io/npm/v/input-terminal?style=for-the-badge&logo=npm&logoColor=white&label=npm&color=%23C12127&labelColor=%23505050"></a>
  </div>
  <br>
  <img src="docs/icon.svg" width="150px">
  <h3 align="center">
    <code>input-terminal</code>
  </h3>
  <h6 align="center">
    by <a href="https://nickesc.github.io">N. Escobar</a> / <a href="https://github.com/nickesc">nickesc</a>
  </h6>
  <h6 align="center">
    <!-- tagline -->
  </h6>
</h3>

<br>

## About `input-terminal`

To get started:

### Automatic

In a command prompt, replace `PROJECT_NAME` with your project's name and run:
```sh
curl -s https://raw.githubusercontent.com/nickesc/input-terminal/refs/heads/main/init.sh | bash /dev/stdin PROJECT_NAME
```

### Manual

1. Clone this repository:

   ```sh
   git clone https://github.com/nickesc/input-terminal.git
   ```

2. Define the project name:
   
   ```sh
   PROJECT_NAME=replace_with_project_name
   ```

3. Rename `testproject.ts` and `tests/testproject.test.ts`, and the folder:
   
   ```sh
   mv ./testproject ./$PROJECT_NAME && cd ./$PROJECT_NAME
   mv ./testproject.ts ./$PROJECT_NAME.ts
   mv ./tests/testproject.test.ts ./tests/$PROJECT_NAME.test.ts
   ```

4. Find and replace the string `input-terminal` in the project folder with your project name:
   
   ```sh
   cd $PROJECT_NAME && grep -rl 'input-terminal' . --exclude-dir={.git,node_modules} | xargs sed -i '' 's/input-terminal/'$PROJECT_NAME'/g'
   ```

5. Remove the `git` repository:
   
   ```sh
   rm -rf .git
   ```

6. Initialize a new `git` repository
   
   ```sh
   git init && git add . && git commit -m "initial commit"
   ```

7. Install `npm` dependencies, run `build`, `docs` and `test` scripts:
   
   ```sh
   npm install && npm run build:docs && npm test
   ```

## Install

Install `input-terminal` via NPM:

```sh
npm i input-terminal
```

Import the `input-terminal` class in your TypeScript or JavaScript file:

```ts
import { input-terminal } from "input-terminal";
```

## Basic Usage

> TODO

## Reference

For full documentation of the module and its methods, please see the [Documentation](/docs/documentation.md) page.

## License

`input-terminal` is released under the **MIT** license. For more information, see the repository's [LICENSE](/LICENSE) file.
