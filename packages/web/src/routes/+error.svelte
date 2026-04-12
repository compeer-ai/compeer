<script>
  import { page } from "$app/state";
</script>

<main class="flex h-screen flex-col items-center justify-center space-y-5">
  <div class="space-y-2 text-center">
    <h1 class="text-2xl font-semibold text-black">{page.status}</h1>
    {#if page.error}
      <p>{page.error.message}</p>
    {/if}
  </div>
</main>
