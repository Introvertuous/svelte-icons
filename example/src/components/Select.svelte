<script>
  export let bindable;
  export let loading = false;
  export let loadingUrl;
  export let openUrl;
</script>

<style>
  select {
    flex: 0 0 185px;
    height: 100%;
    margin-right: 0.5em;
    font-size: 15px;

    padding: 0.25em;
    border: 1px solid #ccc;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: var(--url);
    background-position: 96%;
    background-size: 8%;
    background-repeat: no-repeat;
    background-color: #eee;
  }
</style>

<select
  style="--url: url({loading ? loadingUrl : openUrl});"
  bind:value={$bindable}
    disabled={loading}
  >
  <slot />
</select>
