<script lang="ts">
  import { ChevronRight } from "@lucide/svelte";

  interface Props {
    crumbs: {
      name: string;
      href: string;
    }[];
  }

  const { crumbs }: Props = $props();
</script>

<nav aria-label="Breadcrumb">
  <ol class="flex items-center space-x-3">
    {#each crumbs as { href, name }}
      <li class="space-x-2 flex items-center">
        <a {href} aria-label={name}>
          {name}
        </a>
        <ChevronRight size={15} />
      </li>
    {/each}
  </ol>
</nav>
