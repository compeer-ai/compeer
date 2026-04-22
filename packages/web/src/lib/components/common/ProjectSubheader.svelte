<script lang="ts">
  import { page } from "$app/state";
  import classNames from "classnames";
  import Icon from "./Icon.svelte";
  import {
    Settings2,
    SquareDashedMousePointer,
  } from "@lucide/svelte";
  import { readProject } from "$lib/remotes/store.remote";

  const store = await readProject({ id: page.params.projectId!! });
  const workspace = page.params.workspace!!;
  function isActive(pathname: string) {
    return page.url.pathname === pathname;
  }
  const pages = [
    {
      name: "Captures",
      path: `/${workspace}/store/${store.id}/captures`,
      icon: SquareDashedMousePointer,
    },
    {
      name: "Settings",
      path: `/${workspace}/store/${store.id}/settings`,
      icon: Settings2,
    },
  ];
</script>

<div
  class="flex space-x-7 border-b border-gray-300 px-7 h-18 font-medium bg-white"
  data-sveltekit-preload-data="hover"
>
  {#each pages as page}
    <a href={page.path} class="flex flex-col justify-between">
      <div></div>
      <div
        class={classNames(
          "flex items-center space-x-2 transition ease-in-out hover:text-black",
          {
            "text-black": isActive(page.path),
          },
        )}
      >
        <Icon icon={page.icon}></Icon>
        <span class="py-3">{page.name}</span>
      </div>
      <div
        class={classNames("h-0.75", {
          "bg-primary w-full rounded-t-lg": isActive(page.path),
        })}
      ></div>
    </a>
  {/each}
</div>
