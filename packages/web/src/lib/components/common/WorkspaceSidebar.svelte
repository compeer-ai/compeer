<script lang="ts">
  import { page } from "$app/state";
  import type { Store } from "$lib/repository/projectRepository";
  import classNames from "classnames";
  import Logo from "./Logo.svelte";
  import { ChevronsUpDown, Home, Settings2 } from "@lucide/svelte";
  import Icon from "./Icon.svelte";
	import type { Workspace } from "$lib/repository/workspaceRepository";
	import { dispatcher } from "$lib/utilities/dispatcher";
	import type { User } from "$lib/models/user";
	
  interface Props {
    user?: User;
    projects: Store[];
    workspaces: Workspace[]
  }
  const { projects, workspaces, user }: Props = $props();
  const workspace = page.params.workspace;
  function isActiveProject(projectId: string) {
    return (
      page.url.pathname.startsWith(`/${workspace}/store/${projectId}`) &&
      page.params.projectId === projectId
    );
  }

  function isActive(pathname: typeof page.url.pathname) {
    return page.url.pathname === pathname;
  }
</script>

{#snippet drawerContent()}
  <div class="space-y-3 px-5 flex flex-col">
    {#each workspaces as workspace}
      <a href={`/${workspace.name}`} onclick={() => dispatcher.state('closeDrawer', {})}>
        <span class="hover:text-black transition ease-in-out">{workspace.name}</span>
      </a>
    {/each}
  </div>
{/snippet}
<div class="w-100 flex flex-col justify-between">
  <div class=" space-y-7"  data-sveltekit-preload-data="hover">
    <div class="border-b border-gray-300 px-7 h-18 flex items-center justify-between">
      <a href={`/`}>
        <Logo />
      </a>
      <button onclick={() => dispatcher.send('drawer', drawerContent)}  class="border shadow-sm shadow-gray-100 hover:bg-gray-100/30 ease-in-out rounded-lg text-black font-medium space-x-2 border-gray-300 h-10 flex items-center text-sm px-3">
        <span>
          {page.params.workspace}
        </span>
        <Icon icon={ChevronsUpDown} />
      </button>
    </div>
    <div class="space-y-3 flex flex-col px-7 font-medium">
      <a href={`/${workspace}`}>
        <div
          class={classNames(
            "space-x-2 flex items-center hover:text-black transition ease-in-out cursor-pointer",
            {
              "text-black": isActive(`/${workspace}`),
            },
          )}
        >
          <Icon icon={Home} size={15} strokeWidth={2} />
          <span>Home</span>
        </div>
      </a>
      <a href={`/${workspace}/settings`}>
        <div
          class={classNames(
            "space-x-2 flex items-center hover:text-black transition ease-in-out cursor-pointer",
            {
              "text-black": isActive(`/${workspace}/settings`),
            },
          )}
        >
          <Icon icon={Settings2} size={15} strokeWidth={2} />
          <span>Settings</span>
        </div>
      </a>
    </div>
    {#if projects.length}
      <div class="space-y-3 px-7">
        <h2 class="font-semibold text-black text-sm">Projects</h2>
        <div class="space-y-2 font-medium flex flex-col">
          {#each projects as store}
            <a href={`/${workspace}/store/${store.id}/captures`}>
              <span
                class={classNames({
                  "text-black": isActiveProject(store.id),
                })}>{store.name}</span
              >
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  {#if user}
    <div class="border-t border-gray-300 h-14 font-medium flex items-center text-black px-7">
      {user.name}
    </div>
  {/if}
</div>
