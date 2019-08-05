<script>
  import Nav from './Nav.svelte';
  import { icons, scrolling, scrollToTop } from '../store.js';
  import Icons from './Icons.svelte';
  import ChevronCircleUp from 'svelte-icons/fa/FaChevronCircleUp.svelte';
</script>

<style>
  main {
    max-width: 88em;
    margin: 0 auto;
    padding-top: calc(58px + 16px);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  button {
    position: fixed;
    right: 1em;
    bottom: 1em;
    width: 32px;
  }

  button:hover {
    color: #40b3ff;
  }
</style>

<Nav />
<main>
  <Icons />
  {#if $scrolling}
    <button on:click={scrollToTop}>
      <ChevronCircleUp />
    </button>
  {/if}
</main>
