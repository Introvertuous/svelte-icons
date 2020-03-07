[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![NPM: svelte-icons](https://badge.fury.io/js/svelte-icons.svg)](https://www.npmjs.com/package/svelte-icons)
[![Build Status](https://travis-ci.org/gibdig/svelte-icons.svg?branch=master)](https://travis-ci.org/gibdig/svelte-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Svelte Icons

Icon components for svelte.

### Installation

```
npm install --save svelte-icons
```

### Usage

Visit the [icon navigator](https://www.svelte-icons.gibdig.com) to search through the available icon sets.
Click an icon to copy the import statement to your clipboard.

```
<script>
  import ChevronCircleUp from 'svelte-icons/fa/FaChevronCircleUp.svelte';
</script>

<style>
  .icon {
    color: red;
    width: 32px;
    height: 32px;
  }
</style>

<div class="icon">
  <ChevronCircleUp />
</div>
```

### Running The Example (Icon Navigator)

scripts (yarn prefix omitted)

- submodule
- link (/)
- dev (/)
- link svelte-icons (/example)
- dev (/example)

[ NOTE / TODO ]: Building the example takes a very long time, but technically hot-reloading should be fast, although it seems that rollup is not caching dynamic imports for some reason, which means dev with hot-reload is not possible atm. The current work around is to remove some number (ideally all but one) of dynamic imports from inside `store.js`, depending on which packages you need during development.
