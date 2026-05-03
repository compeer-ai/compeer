<script lang="ts">
  import Icon from "./Icon.svelte";
  import { Search } from "@lucide/svelte";

  interface Props {
    placeholder?: string;
    query: string;
    onChange?: (query: string) => void;
  }

  let { placeholder = "Search...", query = $bindable(""), onChange  }: Props = $props();
</script>

<div
  class="relative h-12 w-87.5 bg-white rounded-lg border border-gray-300 shadow-sm shadow-gray-100"
>
  <div
    class="pointer-events-none absolute text-black inset-y-0 start-0 flex items-center ps-3"
  >
    <Icon icon={Search} />
  </div>
  <input
    type="text"
    oninput={(e) => {
      const value = (e.target as HTMLInputElement).value;
      onChange?.(value)
      query = value;
    }}
    class="h-12 w-full p-3 ps-10 text-sm placeholder:text-gray-400 focus:outline-none"
    {placeholder}
    required
  />
</div>
