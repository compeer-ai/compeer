<script lang="ts" generics="T extends Record<string, any>">
  import classNames from "classnames";
  import type { Snippet } from "svelte";
  import Search from "./Search.svelte";
  import Drawer from "./Drawer.svelte";
  import { Ellipsis } from "@lucide/svelte";
  import Icon from "./Icon.svelte";
  import { goto } from "$app/navigation";
  import { animations } from "$lib/utilities/animations";
  import { dispatcher } from "$lib/utilities/dispatcher";

  interface Props<T> {
    actionButtons?: Snippet;
    rows: T[];
    columns: Record<
      string,
      (params: { row: T; index: number }) => ReturnType<Snippet>
    >;
    rowButtons?: ((params: { row: T; index: number }) => ReturnType<Snippet>)[];
    searchPlaceholder: string;
    selectedRow?: (row: T) => ReturnType<Snippet>;
    dropdown?: ((params: { row: T; index: number }) => ReturnType<Snippet>)[];
    columnMapping: Record<string, string>;
  }

  let selectedDropdown = $state(-1);
  let search = $state("");

  function clickOutside(node: HTMLElement, index: number) {
    function handleClick(event: MouseEvent) {
      if (!node.contains(event.target as Node)) {
        selectedDropdown === index && (selectedDropdown = -1);
      }
    }
    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }

  let {
    actionButtons,
    columns,
    rows,
    rowButtons,
    searchPlaceholder,
    columnMapping,
    dropdown,
    selectedRow,
  }: Props<T> = $props();

  const searchedRows = $derived(
    rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    )
  );
  const originalColumnKeys = Object.keys(columnMapping);
</script>

{#snippet rowContent({ row, index }: { row: T; index: number })}
  <tr
    class={classNames({
      "transition duration-150 ease-in-out hover:bg-gray-100/[.3]":
        !!selectedRow,
    })}
  >
    {#each originalColumnKeys as originalColumnKey}
      {#snippet drawerContent()}
        {#if selectedRow}
          {@render selectedRow(row)}
        {/if}
      {/snippet}
      <td
        class={classNames("truncate px-5 py-4", {
          "cursor-pointer": !!selectedRow,
        })}
        onclick={() => {
          if (selectedRow) {
            dispatcher.send("drawer", drawerContent);
          }
        }}
      >
        {@render columns[originalColumnKey]({ row, index })}
      </td>
    {/each}
    {#if dropdown}
      <td class="relative" use:clickOutside={index}>
        <button
          onclick={() =>
            (selectedDropdown = selectedDropdown >= 0 ? -1 : index)}
          class="cursor-pointer text-black"
          aria-label="Dropdown"
        >
          <Icon icon={Ellipsis}></Icon>
        </button>
        {#if selectedDropdown == index}
          <div
            use:animations.fadeInForward
            class="absolute top-full right-0 z-50 -mt-3 w-48 divide-y divide-gray-300 overflow-hidden rounded-lg border border-gray-300 bg-white backdrop-blur-sm"
            onmouseleave={() => (selectedDropdown = -1)}
            role="listbox"
          >
            {#each dropdown as option}
              {@render option({ row, index })}
            {/each}
          </div>
        {/if}
      </td>
      <td></td>
    {:else if rowButtons}
      {#each rowButtons as rowButton}
        <td>
          {@render rowButton({ row, index })}
        </td>
        <td></td>
      {/each}
    {/if}
  </tr>
{/snippet}
<section class="space-y-5">
  <div class="space-y-3 md:flex md:justify-between md:space-y-0">
    <div class="space-y-3 md:flex md:space-y-0 md:space-x-3">
      <Search placeholder={searchPlaceholder} bind:query={search} />
    </div>
    <div class="space-x-3">
      {#if actionButtons}
        {@render actionButtons()}
      {/if}
    </div>
  </div>
  <div
    class="flex flex-row rounded-lg border border-gray-300 shadow-sm shadow-gray-100 bg-white"
  >
    <div class={`h-125 w-full overflow-y-auto`}>
      <table class="w-full table-auto text-left">
        <thead class="border-b border-gray-300 text-black uppercase">
          <tr>
            {#each originalColumnKeys as originalColumnKey, index}
              <th
                scope="col"
                class={`px-5 py-4 ${index > 1 ? "hidden md:table-cell" : ""}`}
              >
                <div class="flex flex-row items-center space-x-2">
                  <span class="text-sm">
                    {columnMapping[originalColumnKey]}
                  </span>
                </div>
              </th>
            {/each}
            {#if rowButtons}
              {#each rowButtons as _, index}
                <th class="w-5"></th>
              {/each}
              <th class="w-5"></th>
            {:else if dropdown}
              <th class="w-5"></th>
              <th class="w-5"></th>
            {/if}
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          {#each searchedRows as row, index}
            {@render rowContent({ row, index })}
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>
