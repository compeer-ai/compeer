<script lang="ts">
  import Loading from "./Loading.svelte";

  let { children } = $props();
  let loading = $state(false);
</script>

<button
  type="submit"
  class="bg-primary-gradient hover:bg-primary flex h-12 w-full cursor-pointer items-center justify-center rounded-lg text-white shadow-sm shadow-gray-100 transition ease-in-out"
  onclick={(event) => {
    const element = event.currentTarget;
    const form = element.parentElement as HTMLFormElement;
    if (form.checkValidity()) {
      loading = true;
    }
  }}
>
  {#if loading}
    <Loading title="Loading..." />
  {:else}
    {@render children()}
  {/if}
</button>
