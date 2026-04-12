<script lang="ts">
  import Toggle from "./Toggle.svelte";
  import { sources as supportedSources } from "$lib/constants/sources";

  interface Props {
    initialSources: string[];
    sources: string[];
    onChange: (sources: string[]) => void;
  }

  let { onChange, sources, initialSources }: Props = $props();
</script>

<div class="space-y-3">
  {#each initialSources as source}
    {@const sourceName =
      source in supportedSources
        ? supportedSources[source as keyof typeof supportedSources].name
        : source}
    <Toggle
      checked={sources.includes(source)}
      onToggled={(checked) => {
        if (checked) {
          onChange([source, ...sources]);
        } else {
          onChange(initialSources.filter((item) => item !== source));
        }
      }}
      label={sourceName}
    />
  {/each}
</div>
