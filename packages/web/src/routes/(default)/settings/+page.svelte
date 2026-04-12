<script lang="ts">
  import Card from "$lib/components/common/Card.svelte";
  import { animations } from "$lib/utilities/animations";
  import Metadata from "$lib/components/common/Metadata.svelte";
  import classNames from "classnames";
  import { readTheme, updateThemeCommand } from "$lib/remotes/config.remote";
  import { delay } from "$lib/utilities/delay";
  import { dispatcher } from "$lib/utilities/dispatcher";

  const themes = [
    {
      name: "blue",
      color: "bg-blue-800",
    },
    {
      name: "emerald",
      color: "bg-emerald-800",
    },
    {
      name: "rose",
      color: "bg-rose-800",
    },
    {
      name: "amber",
      color: "bg-amber-800",
    },
    {
      name: "violet",
      color: "bg-violet-800",
    },
  ];

  const invalidate = () => readTheme().refresh();
</script>

<Metadata title="Barque: Settings" description="Give AI Eyes to your Data" />
<section class="space-y-5 p-7" use:animations.fadeInForward>
  <h1 class="text-xl font-semibold text-black">Settings</h1>
  <div class="space-y-5">
    <Card title="Theme" collaspable>
      <div class="p-5 flex gap-3">
        {#each themes as theme}
          <button
            class={classNames(
              theme.color,
              "h-5 w-5 rounded-md shadow-sm shadow-gray-100 hover:scale-[105%] transition ease-in-out",
            )}
            aria-label={theme.name}
            onclick={async () => {
              dispatcher.state("toast", {
                level: "loading",
                message: "Updating Theme",
                id: Date.now(),
              });
              await delay(350);
              await updateThemeCommand({theme: theme.name});
              await invalidate();
              dispatcher.state("toast", {
                level: "success",
                message: "Updated Theme",
                id: Date.now(),
              });
            }}
          ></button>
        {/each}
      </div>
    </Card>
  </div>
</section>
