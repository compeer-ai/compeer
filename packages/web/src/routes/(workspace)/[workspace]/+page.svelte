<script lang="ts">
  import Search from "$lib/components/common/Search.svelte";
  import { animations } from "$lib/utilities/animations";
  import Metadata from "$lib/components/common/Metadata.svelte";
  import { Download, Plus } from "@lucide/svelte";
  import Icon from "$lib/components/common/Icon.svelte";
  import { dispatcher } from "$lib/utilities/dispatcher";
  import ProjectForm from "$lib/components/forms/ProjectForm.svelte";
  import type { Project as IProject } from "$lib/repository/projectRepository";
  import Project from "$lib/components/common/Project.svelte";
  import { readProjects } from "$lib/remotes/project.remote";
	import { readWorkspace } from "$lib/remotes/workspace.remote";
	import { page } from "$app/state";
	import ImportProjectForm from "$lib/components/forms/ImportProjectForm.svelte";
	import { config } from "$lib/utilities/config";

  let query = $state("");
  function filterProjects(projects: IProject[], query: string) {
    if (!query.length) return projects;
    return projects.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const workspace = readWorkspace({
    name: page.params.workspace!!
  })
  const projects = $derived.by(() => workspace.current && readProjects({
    workspaceId: workspace.current.id
  }));
  const invalidate = () => projects!!.refresh()
</script>

<Metadata title="Barque: Home" />
{#if projects?.ready && workspace.ready}
<section class="space-y-5 p-7" use:animations.fadeInForward>
  <div class="flex justify-between">
    <Search bind:query placeholder="Search for a project..." />
    {#snippet addProjectDrawerContent()}
      <div class="px-5">
        <ProjectForm workspaceId={workspace.current.id} {invalidate} />
      </div>
    {/snippet}
      {#snippet importProjectDrawerContent()}
      <div class="px-5">
        <ImportProjectForm workspaceId={workspace.current.id} {invalidate} />
      </div>
    {/snippet}
  <div class="space-x-2 flex">
    <button
      class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
      onclick={() => {
        dispatcher.send("drawer", addProjectDrawerContent);
      }}
    >
      <Icon icon={Plus}></Icon>
      <span>Add Project</span>
    </button>
    {#if config.flags.importProjects}
      <button
        class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
        onclick={() => {
          dispatcher.send("drawer", importProjectDrawerContent);
        }}
      >
        <Icon icon={Download}></Icon>
        <span>Import Project</span>
      </button>
    {/if}
  </div>
  </div>
  {#if filterProjects(projects.current, query).length}
    <div
      class="border border-gray-300 divide-y divide-gray-300 rounded-lg shadow-sm shadow-gray-100 bg-white overflow-hidden"
      use:animations.fadeIn
    >
      {#each filterProjects(projects.current, query) as project}
        <Project {project} />
      {/each}
    </div>
  {/if}
</section>
{/if}