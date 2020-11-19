<script>
  export let title = null;
  export let viewBox;
</script>

<style>
  svg {
    stroke: currentColor;
    fill: currentColor;
    stroke-width: 0;
    width: 1em;
    height: auto;
    max-height: 1em;
    vertical-align: -0.15em;
  } 
</style>

<svg xmlns="http://www.w3.org/2000/svg" {viewBox}>
  {#if title}
    <title>{title}</title>
  {/if}
  <slot />
</svg>
