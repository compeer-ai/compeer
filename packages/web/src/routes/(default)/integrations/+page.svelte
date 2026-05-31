<script lang="ts">
  import Card from "$lib/components/common/Card.svelte";
  import { animations } from "$lib/utilities/animations";
  import Metadata from "$lib/components/common/Metadata.svelte";
  import Button from "$lib/components/common/Button.svelte";
	import { readBookmarklet } from "$lib/remotes/integrations.remote";
	import { download } from "$lib/utilities/download";

  const bookmarklet = readBookmarklet();
</script>


<Metadata title="Compeer: Settings" description="Give AI Eyes to your Data" />
{#if bookmarklet.ready}
<section class="space-y-5 p-7" use:animations.fadeInForward>
  <h1 class="text-xl font-semibold text-black">Integrations</h1>
  <div class="space-y-5">
    <Card title="Bookmarklet" collaspable>
        <div class="p-5 space-y-3">
            <p>Capture web pages or selections of web pages as you browse</p>
            <Button variant='wide' onclick={() => download.start(bookmarklet.current, 'bookmarklet.js', 'application/javascript')}>Download</Button>
        </div>
    </Card>
  </div>
</section>
{/if}