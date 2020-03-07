<script>
  import { onMount } from 'svelte';
  import { filter, category, color, loading } from '../store.js';
  import Select from '../components/Select.svelte';
  import GithubLogo from 'svelte-icons/di/DiGithubAlt.svelte';
  import CloseIcon from 'svelte-icons/md/MdClose.svelte';
  import SvelteLogo from '../components/SvelteLogo.svelte';

  let inputElement;

  onMount(() => inputElement.focus());

  const onclick = ev => filter.set('');

  const onblur = ({ target }) => target.focus();
</script>

<style>
  nav {
    font-weight: 300;
    padding: 1em 2em;
    position: fixed;
    width: 100%;
    background-color: white;
    z-index: 1;
    height: 58px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0, 0, 0, 0.5);
  }

  input[type='color'] {
    flex: none;
    height: 100%;
    margin-right: 0.5em;
  }

  .filter {
    flex: 1;
    height: 100%;
    font-size: 15px;
    padding: 0.25em;
    border: solid 1px black;
    display: flex;
    flex-direction: row;
    margin-right: 0.5em;
  }

  .filter:focus-within {
    border: solid 1px #40b3ff;
  }

  .filter > input {
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
  }

  .filter > button {
    flex: 0 0 16px;
  }

  ol {
    flex: none;
    display: flex;
  }

  li {
    width: 32px;
    display: inline-block;
  }

  a,
  button {
    display: flex;
  }

  a:hover {
    color: #40b3ff;
  }

  button:hover {
    color: #ff3e00;
  }
</style>

<nav>
  <input type="color" bind:value={$color} />
  <Select
    bindable={category}
    loading={$loading}
    loadingUrl="/loader.gif"
    openUrl="/open.svg">
    <option value="">Pick a Category</option>
    <option value="di">Dev Icons</option>
    <option value="fa">Font Awesome</option>
    <option value="io">Ionicons</option>
    <option value="md">Material Design Icons</option>
    <option value="ti">Typicons</option>
    <option value="go">Github Octicons</option>
    <option value="gi">Game Icons</option>
    <option value="wi">Weather Icons</option>
  </Select>
  <div class="filter">
    <input
      bind:this={inputElement}
      type="text"
      bind:value={$filter}
      on:blur={onblur} />
    {#if $filter.length > 0}
      <button on:click={onclick}>
        <CloseIcon />
      </button>
    {/if}
  </div>
  <ol>
    <li>
      <a href="https://github.com/gibdig/svelte-icons">
        <GithubLogo />
      </a>
    </li>
    <li>
      <a href="https://svelte.dev/">
        <SvelteLogo />
      </a>
    </li>
  </ol>
</nav>
