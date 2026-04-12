<script lang="ts">
  import { page } from "$app/state";
  import classNames from "classnames";
	import Icon from "./Icon.svelte";
	import { Menu } from "@lucide/svelte";
	import { dispatcher } from "$lib/utilities/dispatcher";
	import { goto } from "$app/navigation";

  interface Props {
    docs: { title: string; slug: string }[];
  }
  const { docs }: Props = $props();
  function isActive(slug: string) {
    return page.url.pathname === `/docs/${slug}`;
  }
</script>

<aside class="w-72 space-y-7 md:top-6 h-fit md:sticky md:block hidden">
  <div class="space-y-3 flex flex-col font-medium">
    {#each docs as doc}
      <a href={`/docs/${doc.slug}`}>
        <div
          class={classNames(
            "space-x-2 flex items-center hover:text-black transition ease-in-out cursor-pointer",
            {
              "text-black": isActive( doc.slug),
            },
          )}
        >
          <span>{doc.title}</span>
        </div>
      </a>
    {/each}
  </div>
</aside>

{#snippet drawerContent()}
    <div class="px-7 text-black flex flex-col font-medium space-y-3">
        {#each docs as doc}
          <button onclick={async () => {
            await goto(`/docs/${doc.slug}`);
            dispatcher.clear('drawer')
          }}
            class="text-left"
          >         
            <span>{doc.title}</span>
          </button>
        {/each}
    </div>
{/snippet}

 <div class="md:hidden flex items-center justify-between border border-gray-300 rounded-lg bg-white shadow-sm shadow-gray-100 h-12 px-5">
      <span class="text-black font-medium">Table Of Contents</span>
      <button onclick={() => dispatcher.sendSnippet('drawer', drawerContent)}>
          <Icon icon={Menu} />
      </button>
  </div>
