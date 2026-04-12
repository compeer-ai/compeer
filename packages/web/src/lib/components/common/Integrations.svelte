<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { animate } from "motion/mini";
  import BrandIcon from "./BrandIcon.svelte";

  const brands = [
    "Wikipedia",
    "HubSpot",
    "GitHub",
    "Atlassian",
    "Notion",
    "Crunchbase",
    "Intercom",
    "TechCrunch",
  ];

  let index = $state(0);
  let pillElement = $state<HTMLElement>();
  let interval = $state<number>();

  async function transitionToNext() {
    if (!pillElement) throw new Error("Pill element not found");
    await animate(
      pillElement,
      { opacity: 0, y: -6 },
      { duration: 0.15, ease: "easeIn" }
    ).finished;
    index = (index + 1) % brands.length;
    animate(
      pillElement,
      { opacity: [0, 1], y: [6, 0] },
      { duration: 0.2, ease: "easeOut" }
    );
  }

  onMount(() => {
    interval = window.setInterval(transitionToNext, 3000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<section class="flex divide-x divide-gray-300" id="integrations">
  <div
    class="space-y-3 p-12 w-1/2 text-center flex flex-col items-center justify-center"
  >
    <h2 class="text-xl font-semibold tracking-tight text-black">
      So many integrations, it's hard to count
    </h2>
    <div class="flex items-center space-x-2 justify-center">
      <p>Extract data from</p>
      <div
        bind:this={pillElement}
        class="border h-10 shadow-sm shadow-gray-100 flex rounded-full items-center justify-center px-3 border-gray-300 text-black font-medium tracking-tight"
      >
        {brands[index]}
      </div>

      <p>into Barque</p>
    </div>
  </div>
  <div class="w-1/2">
    <div class="grid grid-cols-3">
      <div
        class="flex p-12 items-center justify-center font-medium text-black
                  border-r border-b border-dashed border-gray-300"
      >
        <BrandIcon
          brand="wikipedia"
          alt="Wikipedia Logo"
          height={25}
          width={25}
        />
      </div>

      <div
        class="flex p-12 items-center justify-center font-medium
                  border-r border-b border-dashed border-gray-300"
      >
        <BrandIcon brand="hubspot" alt="Hubspot Logo" height={25} width={25} />
      </div>

      <div
        class="flex p-12 items-center justify-center font-medium
                  border-b border-dashed border-gray-300"
      >
        <BrandIcon brand="github" alt="GitHub Logo" height={25} width={25} />
      </div>

      <div
        class="flex p-12 items-center justify-center font-medium
                  border-r border-b border-dashed border-gray-300"
      >
        <BrandIcon
          brand="atlassian"
          alt="Atlassian Logo"
          height={25}
          width={25}
        />
      </div>

      <div
        class="flex p-12 items-center justify-center font-medium
                  border-r border-b border-dashed border-gray-300"
      >
        <BrandIcon brand="notion" alt="Notion Logo" height={25} width={25} />
      </div>

      <div
        class="flex p-12 items-center justify-center font-medium
                  border-b border-dashed border-gray-300"
      >
        <BrandIcon
          brand="crunchbase"
          alt="Crunchbase Logo"
          height={25}
          width={25}
        />
      </div>

      <div
        class="flex p-12 items-center justify-center font-medium
                  border-r border-dashed border-gray-300"
      >
        <BrandIcon
          brand="intercom"
          alt="Intercom Logo"
          height={25}
          width={25}
        />
      </div>

      <div
        class="flex p-12 items-center justify-center font-medium
                  border-r border-dashed border-gray-300"
      >
        <BrandIcon
          brand="techcrunch"
          alt="Techcrunch Logo"
          height={25}
          width={25}
        />
      </div>

      <div class="flex p-12 items-center justify-center font-medium">
        <BrandIcon brand="x" alt="X Logo" height={25} width={25} />
      </div>
    </div>
  </div>
</section>
