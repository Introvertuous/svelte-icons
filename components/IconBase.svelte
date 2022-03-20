<script>
  export let title = null;
  export let viewBox;
  let classes;
  export { classes as class };
</script>

<style>
  svg {
    stroke: currentColor;
    fill: currentColor;
    stroke-width: 0;
  }  
</style>

<svg xmlns="http://www.w3.org/2000/svg" {viewBox} class={classes}>
  {#if title}
    <title>{title}</title>
  {/if}
  <slot />
</svg>
