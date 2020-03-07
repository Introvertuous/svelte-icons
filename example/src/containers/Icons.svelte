<script>
  import { color, icons, category } from '../store.js';
  import SvelteLogo from '../components/SvelteLogo.svelte';
  import Notifications from '../components/Notifications.svelte';

  let notifications;
  let timeout = 10000;

  function fallbackCopy(data) {
    textArea.value = statement;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  const copy = async (ev, statement) => {
    const textArea = document.createElement('textarea');
    const { clipboard } = navigator;

    if (!clipboard) {
      fallbackCopy(statement);
    } else {
      await clipboard.writeText(statement);
    }

    notifications.show('copied import statement to clipboard!');
  };
</script>

<style>
  .entry {
    position: relative;
    flex: 0 0 168px;
    height: 125px;
    color: var(--color);
    padding: 2em 4em;
    margin: 0.5em 0;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
  }

  .entry:hover {
    color: white;
    background-color: #40b3ff;
  }

  label {
    position: absolute;
    left: 5%;
    right: 5%;
    bottom: 0.35em;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: inherit;
  }

  .svelte {
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    width: 100%;
    height: 100%;
    max-width: 88em;
    padding-top: 58px;

    animation-name: blink;
    animation-duration: 1.5s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-fill-mode: none;
    animation-play-state: running;
  }

  @keyframes blink {
    0% {
      color: black;
    }

    100% {
      color: #ff3e00;
    }
  }
</style>

{#each $icons as [name, icon, fetch]}
  <div
    on:click={ev => copy(ev, fetch)}
    class="entry"
    style="--color: {$color};">
    <svelte:component this={icon} />
    <label>{name}</label>
  </div>
{/each}
{#if $category === ''}
  <div class="svelte">
    <SvelteLogo />
  </div>
{/if}
<Notifications bind:this={notifications} {timeout} />
